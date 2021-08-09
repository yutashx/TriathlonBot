class WeeklyMenuMail extends Mail{
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
            const day:Day = Utility.day2En(new Date());
            if (day != "Sun") throw new Error(`This script should be executed on Sunday, Today is ${day}`)
            const menu = new Menu(sheetId, menuSheetName);
            this.multiDaysMenuSessions = Utility.range(0, 7).map(x => menu.parseAfterNDays(x))
        }catch(e){
            this.overwriteSendFlag("prevent");
            console.log(`Spreadsheet parsing error: ${e}`);
        }
    }

    makeAbstract():string{
		const weeklySessions:string[] = this.multiDaysMenuSessions.map(menuSessions => {
			const date:Date = new Date(menuSessions[0].date); 
			const dateSlash:string = Utility.makeDataFormatMMDDwithSlash(date);
			const dayEn:string = Utility.day2En(date);
            const restUrl:string = `https://script.google.com/macros/s/AKfycbxMpB-cByM-czKKvjASqmHAYWscd8nrkcEvVoDa3qWfVBwSoXoFaWA8CHNq1OgkJ_XpaQ/exec`;

			const eventsJp:EventType[] = menuSessions.map(x => x.event);
			const eventsEn:string[] = eventsJp.map(x => Utility.eventJp2En(x));
			const mains:string[] = menuSessions.map(x => x.detail);
			const dateMMDD:string[] = menuSessions.map(x => Utility.makeDataFormatMMDD(new Date(x.date)));
			const link:string[] = Utility.zip([eventsEn, mains, dateMMDD, eventsJp]).map(x=>{
                if (["ラン", "スイム", "バイク"].includes(x[3])){
                    return `<a href="${this.envs["MENUURL"]}${x[0]}/${x[2]}.html" _target="parent">${x[3]}練[${x[1]}]</a>`
                }else if (x[3] == "休み"){
                    return `<a href="${restUrl}" _target="parent">${x[3]}[${x[1]}]<a>`
                }else{
                    return `<a href="http://web-ext.u-aizu.ac.jp/circles/triathlon/index.html" _target="parent">${x[3]}[${x[1]}]<a>`
                }
            }
			);

			const sessions:string = ((dayEn, link)=>{
				const sessions:string = `${dateSlash}(${dayEn}): ${link}`

				return sessions;
			})(dayEn, link);

			return sessions;
		})
        
        const weeklySchedule:string = weeklySessions.join("<br>\n");
        const abstract:string = `
        今週の練習メニューについて連絡します。<br>\n
        今週の練習メニューは以下のようになっています。<br>\n
        <br>\n
        -------------------------<br>\n
        ${weeklySchedule}<br>\n
        -------------------------<br>\n
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
