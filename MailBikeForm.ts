class BikeFormMail extends Mail{
    menuSheet:Sheet;
    bikeMemberSheet:Sheet;
    menuSessions:MenuSession[] = [];
    envs:{[val:string]: string};
    bikeFormParam:BikeFormParam;

    constructor(tag: string, purpose: Purpose, params: MailParams, sendFlag: SendFlag, envs: {[val:string]: string}, bikeFormParam:BikeFormParam,others?:string[]){
        super(tag, purpose, params, sendFlag, others);
        this.bikeFormParam = bikeFormParam;
        this.envs = envs;

        const sheetId = this.envs["SHEETID"];
        const menuSheetName = this.envs["SHEET_MENU"];
        const bikeForm:BikeForm = new BikeForm(sheetId, menuSheetName);

        try{
            const menu = new Menu(sheetId, menuSheetName);
            this.menuSessions = menu.parseAfterNDays(bikeFormParam.sendNDaysAfter)
            this.overwriteSendFlag(menu.sendFlag);

            if (!this.menuSessions.some(x => x.event == "バイク")){
                console.log(`After ${bikeFormParam.sendNDaysAfter} days is not bike day.`);
                this.overwriteSendFlag("prevent");
            }
        }catch(e){
            this.sendFlag = "prevent";
            console.log(`Spreadsheet parsing error: ${e}`);
        }
    }

    makeAbstract():string{
        const bikeSessionIndex:number[] = this.menuSessions.map((x, index) =>{
            if (x.event == "バイク") return index;
            else return -1;
        }).filter(x => x != -1);
        const bikeSession:MenuSession = bikeSessionIndex.length == 1? this.menuSessions[bikeSessionIndex[0]]: {date: "", event: "休み", detail: "", time: "", place: ""};
        const deadlineDay:string = Utility.getAfterDaysMMDDwithSlash(this.bikeFormParam.deadlineNDayAfter);
        const deadlineTime:string = this.bikeFormParam.deadlineTime;
        const description:string = `次回のバイク練は${bikeSession.place}に行きます。返信期限は${deadlineDay}の${deadlineTime}です。それに伴い、選手とマネージャーの出欠確認をいたします。`;
        const descriptionFollowing:string = `${description}参加する方は以下の返信フォームに従って返信して下さい。`
        const bikeForm:BikeForm = new BikeForm(this.envs["SHEETID"], this.envs["SHEET_BIKE"])
        bikeForm.unlink(this.envs["SHEET_BIKE"]);
        const formUrls:string[] = bikeForm.generate(this.params.subject, description);
        
        const abstract:string = `
        次回のバイク練について連絡します。<br>\n
        ${description}参加する方は<a href="${formUrls[0]}">この返信フォーム</a>に返信してください。<br>\n
        <br>\n
        <br>\n
        `

        return abstract;
    }

    private overwriteSendFlag(sendFlag){
        const preventFlags = ["1", 1, "prevent", "Prevent"];
        if (preventFlags.includes(sendFlag)){
            this.sendFlag = "prevent";
        }
    }
}
