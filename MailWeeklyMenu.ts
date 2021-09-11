class WeeklyMenuMail extends Mail{
    multiDaysMenuSessions:MenuSession[][] = []
    sheet:Sheet

    constructor(config: any, sendFlag: SendFlag){
        super(config, sendFlag)

        const sheetId = this.config["SheetId"]
        const menuSheetName:string= this.config["MenuSheetName"]

        const day:Day = Utility.day2En(new Date());
        const sendDay:Day = this.config["SendDay"]
        if (day != (this.config["SendDay"] as Day))
            throw new Error(`This script should be executed on ${sendDay}, but today is ${day}`)

        const menu = new Menu(sheetId, menuSheetName)
        this.sheet = new Sheet(sheetId, menuSheetName)
        const dateRange:number[] = this.config["SendDateRange"]
        this.multiDaysMenuSessions = Utility.range(dateRange[0], dateRange[1]).map(x => menu.parseAfterNDays(x))
        this.overwriteSendFlag(menu.sendFlag);
    }

    protected makeAbstract():string{
		const weeklySessions:string[] = this.multiDaysMenuSessions.map(menuSessions => {
			const date:Date = new Date(menuSessions[0].date); 
			const dateSlash:string = Utility.makeDataFormatMMDDwithSlash(date);
			const dayEn:string = Utility.day2En(date);
            const restUrl:string = this.config["RestURL"]

			const eventsJp:EventType[] = menuSessions.map(x => x.event);
			const eventsEn:string[] = eventsJp.map(x => Utility.eventJp2En(x));
			const mains:string[] = menuSessions.map(x => x.detail);
			const dateMMDD:string[] = menuSessions.map(x => Utility.makeDataFormatMMDD(new Date(x.date)));
			const link:string = Utility.zip([eventsEn, mains, dateMMDD, eventsJp]).map(x =>{
                if (["ラン", "スイム", "バイク"].includes(x[3])){
                    return `<a href="${this.config["UoAMenuURL"]}${x[0]}/${x[2]}.html" _target="parent">${x[3]}練[${x[1]}]</a>`
                }else if (x[3] == "休み"){
                    return `<a href="${restUrl}" _target="parent">${x[3]}[${x[1]}]<a>`
                }else{
                    return `<a href=${this.config["UoAIndexURL"]} _target="parent">${x[3]}[${x[1]}]<a>`
                }
            }).join("、");

			const sessions:string = ((dayEn, link)=>{
				const sessions:string = `${dateSlash}(${dayEn}): ${link}`

				return sessions;
			})(dayEn, link);

			return sessions;
		})
        
        const commentColNo:number = this.sheet.getColNum("Comment");
        const row:string[] = this.sheet.getTheDateRows(Utility.makeDateFormat(new Date(this.multiDaysMenuSessions[0][0].date)));
        const comment:string = row[0][commentColNo];

        const weeklySchedule:string = weeklySessions.join("<br>\n");
        const abstract:string = `
        今週の練習メニューについて連絡します。<br>\n
        今週の練習メニューは以下のようになっています。<br>\n
        <br>\n
        -------------------------<br>\n
        ${weeklySchedule}<br>\n
        -------------------------<br>\n
        <br>\n
        ${comment}<br>\n
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
