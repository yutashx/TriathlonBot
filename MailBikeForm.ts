class BikeFormMail extends Mail{
    menuSheet:Sheet;
    bikeMemberSheet:Sheet;
    menuSessions:MenuSession[] = [];
    envs;

    constructor(tag: string, purpose: Purpose, params: MailParams, sendFlag: SendFlag, envs: any, others?:string[]){
        super(tag, purpose, params, sendFlag, others);
        this.envs = envs;
        const sheetId = this.envs["SHEETID"];
        const menuSheetName = this.envs["SHEET_MENU"];
        const bikeMemberSheetName = this.envs["SHEET_BIKE"];

        this.menuSheet = new Sheet(sheetId, menuSheetName);
        this.bikeMemberSheet = new Sheet(sheetId, bikeMemberSheetName);
        try{
            this.parseMenu();
        }catch(e){
            this.sendFlag = "prevent";
            console.log(`Spreadsheet parsing error: ${e}`);
        }
    }

    makeAbstract():string{
        const eventsSummary:string = this.menuSessions.map(x => x.event).join("/");
        const eventMain = ()=>{
            var linkedMains:string[] = [];
            const eventsLink:string[] = this.makeLinks();
            for (var i=0; i<this.menuSessions.length; i++){
                const linkedMain:string = `${this.menuSessions[i].event}練は${eventsLink[i]}`
                linkedMains.push(linkedMain);
            }

            return linkedMains.join("、");
        };
        const uniqDscrpt = this.menuSessions.map(x =>{
            switch(x.event){
                case "スイム":
                    return "新型コロナウイルスによる重点対策期間中はプールに入っていい人数の制限があるのでこのメールに「選手で参加するorマネージャーで参加する」という内容で返信をお願いします。人数によっては時間を分けたり、ラン練になる場合があります。";
                case "バイク":
                    return "";
                case "ラン":
                    return "雨の場合はレイヤートレーニングをします。";
                default:
                    return "";
            }
        }).join("<br>\n");
        const dscrpt = this.others? this.others[0]: "";

        const abstract:string = `
        明日の${eventsSummary}練について連絡します。<br>\n
        明日の${eventMain()}をします。<br>\n
        ${uniqDscrpt}<br>\n
        ${dscrpt}<br>\n
        `

        return abstract;
    }

    makeContents():string{
        const dscrpt:string = "以下詳細です。";
        const menuDetails = ():string =>{
            const links:string[] = this.makeLinks();
            var details:string[] = [];
            if (links.length == this.menuSessions.length){
                for (var i=0; i<links.length; i++){
                    const bikeMembers:string = this.menuSessions[i].event == "バイク"? this.listUpBikeMembers(): "";
                    const meetingPlace:string = this.menuSessions[i].event == "バイク"? "サークル棟": this.menuSessions[i].place;
                    const destination:string = this.menuSessions[i].event == "バイク"? `行き先：  ${this.menuSessions[i].place}<br>\n`: ``;
                    const detail = `
${bikeMembers + "<br>\n"}
-------------------------<br>\n
種目：    ${this.menuSessions[i].event}<br>\n
メイン：   ${links[i]}<br>\n
集合時間： ${this.menuSessions[i].time}<br>\n
集合場所： ${meetingPlace}<br>\n
${destination}
--------------------------<br>\n
                    `
                    details.push(detail);
                }

                return details.join("<br><br>");
            }else{
                return "the number of links and sessions are unmatched";
            }
        }
        const contents:string = `
        ${dscrpt}\n<br>
        ${menuDetails()}\n<br>
        `

        return contents;
    }

    makeLinks():string[]{
        var links:string[] = [];
        for (var i=0; i<this.menuSessions.length; i++){
            const enEvent:string = Utility.eventJp2En(this.menuSessions[i].event);
            const link:string = `<a href=${this.envs.MENUURL}${enEvent}/${Utility.getAfterDaysMMDD(1)}.html>${this.menuSessions[i].detail}</a>`;
            links.push(link);
        }
        return links;
    }

    private listUpBikeMembers():string {
        const athletes:string[] = this.bikeMemberSheet.getBikeMembers("選手");
        const managers:string[] = this.bikeMemberSheet.getBikeMembers("マネージャー");

        if (athletes && managers){
            const members = `
            以下参加者です<br>\n
            選手：<br>\n
            ${athletes.join("<br>")}
            <br>\n
            <br>\n
            マネージャー
            ${managers.join("<br>")}
            <br>\n
            <br>\n
            `

            return members;
        }else{
            return "参加者なし";
        }
    }

    parseMenu(){
        const tomorrow:string = Utility.getAfterDays(1);
        const todayRows:string[] = this.menuSheet.getTheDateRows(tomorrow);

        if (todayRows.length == 1){
            const events:string[] = todayRows[0][this.menuSheet.getColNum("Event")].split("/");
            const details:string[] = todayRows[0][this.menuSheet.getColNum("Detail")].split("/");
            const times:string[] = todayRows[0][this.menuSheet.getColNum("Time")].split("/");
            const places:string[] = todayRows[0][this.menuSheet.getColNum("Place")].split("/");
            const sendFlag:string = todayRows[0][this.menuSheet.getColNum("SendFlag")];
            this.overwriteSendFlag(sendFlag);

            const splitedNums = [events, details, times, places].map(x => x.length);
            // check all columns contains the same number
            if (splitedNums.every(x => x == splitedNums[0])){
                for (var i=0; i<splitedNums[0]; i++){
                    const session:MenuSession = {event: events[i] as EventType, detail: details[i], time: times[i], place: places[i]};
                    this.menuSessions.push(session);
                }
            }else{
                throw new Error(`Expected all columns has the same size ${splitedNums[0]}, but event: ${splitedNums[0]}, detail: ${splitedNums[1]}, time: ${splitedNums[2]}, place: ${splitedNums[3]}.`);
            }
        }else{
            throw new Error(`Expected 1 row, but get ${todayRows.length}.`)
        }
    }

    private overwriteSendFlag(sendFlag){
        const preventFlags = ["1", 1, "prevent", "Prevent"];
        if (preventFlags.includes(sendFlag)){
            this.sendFlag = "prevent";
        }
    }
}
