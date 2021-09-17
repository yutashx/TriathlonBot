class DailyMenuMail extends Mail{
    menuSessions:MenuSession[] = [];
    bikeMembers:string;
    sheet:Sheet;

    constructor(config: any, sendFlag: SendFlag){
        super(config, sendFlag)

        const sheetId = this.config["SheetId"]
        const menuSheetName:string= this.config["MenuSheetName"]
        const sendDailyMenuMailAfterNDays = this.config["SendDailyMenuMailAfterNDays"]
        const afterNDaysDate:Date = Utility.getAfterNDaysFrom(new Date(), sendDailyMenuMailAfterNDays)
        const bikeFormSheetName = Utility.date2str(afterNDaysDate, "%Y-%M-%D")

        const menu:Menu = new Menu(sheetId, menuSheetName);
        this.sheet = new Sheet(sheetId, menuSheetName);
        this.menuSessions = menu.parseAfterNDays(sendDailyMenuMailAfterNDays);
        this.overwriteSendFlag(menu.sendFlag);

        const bikeMembers:Menu = new Menu(sheetId, bikeFormSheetName);
        this.bikeMembers = bikeMembers.listUpBikeMembers();
    }

    protected makeAbstract():string{
        const eventsSummary:string = this.menuSessions.map(x => x.event).join("/");
        const eventMain = ()=>{
            var linkedMains:string[] = [];
            const eventsLink:string[] = this.makeLinks();
            for (var i=0; i<this.menuSessions.length; i++){
                const linkedMain:string = `${this.menuSessions[i].event}は${eventsLink[i]}`
                linkedMains.push(linkedMain);
            }

            return linkedMains.join("、");
        };
        const uniqDscrpt = this.menuSessions.map(x =>{
            switch(x.event){
                case "スイム":
                    return this.config["SwimMessage"]
                case "バイク":
                    return this.config["BikeMessage"]
                case "ラン":
                    return this.config["RunMessage"]
                default:
                    return "";
            }
        }).join("<br>\n");

        const abstract:string = `
        明日の${eventsSummary}練について連絡します。<br>\n
        明日の${eventMain()}をします。<br>\n
        ${uniqDscrpt}<br>\n
	    ${this.config["DailyMenuMessage"]}<br>\n
        <br>\n
        `

        return abstract;
    }

    protected makeContents():string{
        const dscrpt:string = "以下詳細です。";
        const menuDetails = ():string =>{
            const links:string[] = this.makeLinks();
            var details:string[] = [];
            if (links.length == this.menuSessions.length){
                for (var i=0; i<links.length; i++){
                    const bikeMembers:string = (this.menuSessions[i].event == "バイク" && this.config["BikeMemberDisplay"])? this.bikeMembers: "";
                    const meetingPlace:string = this.menuSessions[i].event == "バイク"? "サークル棟": this.menuSessions[i].place;
                    const destination:string = this.menuSessions[i].event == "バイク"? `行き先：  ${this.menuSessions[i].place}<br>\n`: ``;
                    const wbgt:string= (!["プール"].includes(this.menuSessions[i].place) && this.config["WbgtDisplay"])?
                     `<a href=${this.config["WbgtDescriptionURL"]}">暑さ指数</a>： <a href=${this.config["WbgtAreaURL"]}>${this.menuSessions[i].wbgt}</a>（予報値）<br>\n`:
                      "";

                    const detail = `
                    ${bikeMembers} <br>\n
                    -------------------------<br>\n
                    種目：    ${this.menuSessions[i].event}<br>\n
                    メイン：   ${links[i]}<br>\n
                    集合時間： ${this.menuSessions[i].time}<br>\n
                    集合場所： ${meetingPlace}<br>\n
                    ${destination}
                    ${wbgt}
                    --------------------------<br>\n
                    `
                    details.push(detail);
                }

                return details.join("<br><br>");
            }else{
                return "the number of links and sessions are unmatched";
            }
        }
        const commentColNo:number = this.sheet.getColNum("Comment");
        const theDay:Date = this.menuSessions[0].date
        const row:string[] = this.sheet.getTheDateRows(Utility.date2str(theDay, "%Y-%M-%D"))
        const comment:string = row[0][commentColNo];

        const contents:string = `
        ${comment}\n<br><br>
        ${dscrpt}\n<br>
        ${menuDetails()}\n<br>
        `
        return contents;
    }

    protected makeLinks():string[]{
        const links:string[] = []
        const today:Date = new Date()
        const tomorrow:Date = Utility.getAfterNDaysFrom(today, 1)
        const tomorrowStr:string = Utility.date2str(tomorrow, "%M%D")

        for (var i=0; i<this.menuSessions.length; i++){
            const enEvent:string = Utility.eventJp2En(this.menuSessions[i].event);
            const link:string = `<a href=${this.config["UoAMenuURL"]}${enEvent}/${tomorrowStr}.html>${this.menuSessions[i].detail}</a>`;
            links.push(link);
        }
        return links;
    }
}
