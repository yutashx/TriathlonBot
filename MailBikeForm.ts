class BikeFormMail extends Mail{
    menuSheet:Sheet;
    menuSessions:MenuSession[] = [];

    constructor(config: any, sendFlag: SendFlag){
        super(config, sendFlag)

        const sendAfterNDays:number = this.config["SendBikeFormMailAfterNDays"]

        const menu = new Menu(this.config["SheetId"], this.config["MenuSheetName"], this.config);
        this.menuSessions = menu.parseAfterNDays(sendAfterNDays)
        this.overwriteSendFlag(menu.sendFlag);

        if (this.menuSessions.every(x => x.event !== "バイク")){
            console.log(`After ${sendAfterNDays} days is not bike day.`);
            this.overwriteSendFlag("prevent");
        }
    }

    protected makeAbstract():string{
        const bikeSessions:MenuSession[] = this.menuSessions.filter(menuSession => menuSession.event == "バイク" )
        if (bikeSessions.length == 0){
            const message:string = `There is no bike day`
            console.log(message)
            this.sendFlag = "prevent"
            
            return message
        } 

        const dlDay:Date = Utility.getAfterNDaysFrom(new Date(), this.config["SendBikeFormMailAfterNDays"])
        const deadlineDay:string = Utility.date2str(dlDay, "%M/%D")
        const deadlineTime:string = Utility.getTimeFormat(new Date(this.config["BikeFormDeadlineTime"]))
        const bikeDay:Date = new Date(bikeSessions[0].date)
        const date:string = Utility.date2str(bikeDay, "%M/%D")
        const formSheetName:string = Utility.date2str(bikeDay, "%Y-%M-%D")
        const places:string = bikeSessions.map(bikeSession => bikeSession.place).join("/")

        const description:string = `${date}のバイク練は${places}に行きます。
        返信期限は${deadlineDay}の${deadlineTime}です。
        それに伴い、選手とマネージャーの出欠確認をいたします。`
        const descriptionFollowing:string = `${description}参加する方は以下の返信フォームに従って返信して下さい。`

        const bikeForm:BikeForm = new BikeForm(this.config["SheetId"], formSheetName, this.config["BikeFormDefaultSheetName"])
        const formUrls:string[] = bikeForm.generate(this.config["BikeFormMailSubject"][1], descriptionFollowing);
        const today:string = Utility.date2str(new Date(), "%Y-%M-%D")
        // There exists time lag to generate a sheet in the spreadsheet,
        // so we should sleep just a moment.
        bikeForm.renameFormSheet()
        bikeForm.unlink(today);
        
        const abstract:string = `
        次回のバイク練について連絡します。<br>\n
        ${description}参加する方は<a href="${formUrls[0]}">この返信フォーム</a>に返信してください。<br>\n
        <br>\n
        <br>\n
        `

        return abstract;
    }
}
