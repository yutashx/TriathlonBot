class BikeFormMail extends Mail{
    menuSheet:Sheet;
    menuSessions:MenuSession[] = [];

    constructor(config: any, sendFlag: SendFlag){
        super(config, sendFlag)

        const sendAfterNDays:number = this.config["SendBikeFormMailAfterNDays"]

        try{
            const menu = new Menu(this.config["SheetId"], this.config["MenuSheetName"]);
            this.menuSessions = menu.parseAfterNDays(sendAfterNDays)
            this.overwriteSendFlag(menu.sendFlag);

            if (!this.menuSessions.some(x => x.event == "バイク")){
                console.log(`After ${sendAfterNDays} days is not bike day.`);
                this.overwriteSendFlag("prevent");
            }
        }catch(e){
            this.sendFlag = "prevent";
            console.log(`Spreadsheet parsing error: ${e}`);
        }
    }

    protected makeAbstract():string{
        const bikeSessions:MenuSession[] = this.menuSessions.filter(menuSession => menuSession.event == "バイク" )
        if (bikeSessions.length == 0)  throw new Error(`There is no bike day.`)

        const deadlineDay:string = Utility.getAfterDaysMMDDwithSlash(this.config["SendBikeFormMailAfterNDays"]);
        const deadlineTime:string = Utility.getTimeFormat(new Date(this.config["BikeFormDeadlineTime"]))
        const date:string = Utility.makeDataFormatMMDDwithSlash(new Date(bikeSessions[0].date))
        const formSheetName:string = Utility.makeDataFormatYYYYMMDD(new Date(bikeSessions[0].date))
        const places:string = bikeSessions.map(bikeSession => bikeSession.place).join("/")

        const description:string = `${date}のバイク練は${places}に行きます。
        返信期限は${deadlineDay}の${deadlineTime}です。
        それに伴い、選手とマネージャーの出欠確認をいたします。`
        const descriptionFollowing:string = `${description}参加する方は以下の返信フォームに従って返信して下さい。`

        const bikeForm:BikeForm = new BikeForm(this.config["SheetId"], formSheetName, this.config["BikeFormDefaultSheetName"])
        const formUrls:string[] = bikeForm.generate(this.config["BikeFormMailSubject"][1], descriptionFollowing);
        // There exists time lag to generate a sheet in the spreadsheet,
        // so we should sleep just a moment.
        bikeForm.renameFormSheet()
        bikeForm.unlink();
        
        const abstract:string = `
        次回のバイク練について連絡します。<br>\n
        ${description}参加する方は<a href="${formUrls[0]}">この返信フォーム</a>に返信してください。<br>\n
        <br>\n
        <br>\n
        `

        return abstract;
    }
}
