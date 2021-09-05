class WeeklyMenuFilledMail extends Mail{
    //execute on Sunday absolutely
    menuSheet:Sheet;
    multiDaysMenuSessions:MenuSession[][] = [];
    envs:{[val:string]: string};

    constructor(tag: string, purpose: Purpose, params: MailParams, sendFlag: SendFlag, envs: {[val:string]: string}, others?:string[]){
        super(tag, purpose, params, sendFlag, others);
        this.envs = envs;

        const sheetId = this.envs["SHEETID"];
        const menuSheetName = this.envs["SHEET_MENU"];

        try{
            const menu = new Menu(sheetId, menuSheetName);
            this.multiDaysMenuSessions = Utility.range(2,9).map(x => {
                try{
                    return menu.parseAfterNDays(x)
                }catch(e){
                    const date = new Date() //today
                    date.setDate(date.getDate() + x)
                    const undefinedSession:MenuSession[] = [{date: String(date), event: "undefined", detail: "未定", time: "00:00", place: "undefined", wbgt: -1}]
                    return undefinedSession
                }
            })
            this.overwriteSendFlag(menu.sendFlag);
        }catch(e){
            this.overwriteSendFlag("prevent");
            console.log(`Spreadsheet parsing error: ${e}`);
        }
    }

    protected makeAbstract():string{
        const allNotFilled:boolean = this.multiDaysMenuSessions.some(menuSessions => {
            const flag:boolean = menuSessions.some(session => {
                return session.detail === "未定"
            })

            return flag;
        })
        if (!allNotFilled){
            this.overwriteSendFlag("prevent")    
        }

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
