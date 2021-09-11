class ValidateMenu extends Mail{
    //execute on Sunday absolutely
    menuSheet:Sheet;
    multiDaysMenuSessions:MenuSession[][] = [];

    constructor(config: any, sendFlag: SendFlag){
        super(config, sendFlag)

        const sheetId = this.config["SheetId"];
        const menuSheetName = this.config["MenuSheetName"];

        try{
            const menu = new Menu(sheetId, menuSheetName);
            const dateRange = this.config["ValidateDateRange"]
            this.multiDaysMenuSessions = Utility.range(dateRange[0],dateRange[1]).map(x => {
                try{
                    return menu.parseAfterNDays(x)
                }catch(e){
                    const date = new Date() //today
                    date.setDate(date.getDate() + x)
                    const undefinedSession:MenuSession[] = [{date: String(date), event: "undefined", detail: this.config["UndefinedDetail"], time: "00:00", place: "undefined", wbgt: -1}]
                    return undefinedSession
                }
            })
        }catch(e){
            this.overwriteSendFlag("prevent");
            console.log(`Spreadsheet parsing error: ${e}`);
        }
    }

    protected makeAbstract():string{
        const filled:boolean = this.multiDaysMenuSessions.every(menuSessions => {
            const flag:boolean = menuSessions.every(session => {
                return session.detail !== this.config["UndefinedDetail"]
            })

            return flag;
        })
        if (filled) this.overwriteSendFlag("prevent")    

		const undefinedSessions:string[] = this.multiDaysMenuSessions.map(menuSessions => {
            const undefinedSession = menuSessions.filter(session => session.detail == "未定")
            const message = undefinedSession.map(session => `${Utility.makeDataFormatMMDDwithSlash(new Date(session.date))}の${session.event}が未記入です。`).join('<br>\n')
            
            return message
        })
        
        
        const message = undefinedSessions.join("<br>\n")

        const abstract:string = `
        来週の埋めてない練習メニューについて連絡します。<br>\n
        来週の埋めてない練習メニューは以下のようになっています。<br>\n
        <br>\n
        -------------------------<br>\n
        ${message}<br>\n
        -------------------------<br>\n
        `

        return abstract;
    }

    protected overwriteSendFlag(sendFlag){
        const preventFlags = ["2", 2, "prevent", "Prevent", "weekly", "all"];
        if (preventFlags.includes(sendFlag)){
            this.sendFlag = "prevent";
        }
    }

}
