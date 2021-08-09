class MonthlyPage{
	envs:{[val:string]:string}
	targetMonth:{[val:string]: number}; //[YYYY, MM]
	menuSheet:Menu;
	constructor(envs:{[val:string]:string}, targetMonth:{[val:string]: number}){
		this.envs = envs;
		this.targetMonth = targetMonth;
		this.menuSheet = new Menu(this.envs["SHEETID"], this.envs["SHEET_MENU"]);
	}

	generate():string{
		const targetDates = `${this.targetMonth["year"]}-${String(this.targetMonth["month"]).padStart(2, "0")}`
		const multiDaysMenuSessions:MenuSession[][] = this.menuSheet.parseMatchedDays(targetDates);
		const sessionTable:string[] = multiDaysMenuSessions.map(menuSessions => {
			const date:Date = new Date(menuSessions[0].date); 
			const dateSlash:string = Utility.makeDataFormatMMDDwithSlash(date);
			const dayEn:string = Utility.day2En(date);

			const eventsEn:string[] = menuSessions.map(x => Utility.eventJp2En(x.event));
			const mains:string[] = menuSessions.map(x => x.detail);
			const dateMMDD:string[] = menuSessions.map(x => Utility.makeDataFormatMMDD(new Date(x.date)));
			const link:string[] = Utility.zip([eventsEn, mains, dateMMDD]).map(x=>
				`<a href="${this.envs["MENUURL"]}${x[0]}/${dateMMDD}.html" _target="parent">${x[1]}</a>`
			);

			const sessions:string = ((dayEn, link)=>{
				const prefix:string = dayEn == "Sat"? "<hr>\n": "";
				const suffix:string = dayEn == "Sun"? "<hr>\n\n": "";
				const sessions:string = `${prefix}<li>${dateSlash}(${dayEn}): ${link}</li>\n${suffix}`

				return sessions;
			})(dayEn, link);

			return sessions;
		})

		const header:string = `<div id=\"contents\">\n<h3>"${this.targetMonth["year"]} 部活内容</h3>\n<ul>\n<h4> ${this.targetMonth["year"]}年${this.targetMonth["month"]}月</h4>\n<hr>\n<style></style>\n<hr>\n`;
		const footer:string = `<hr>\n\n</ul>\n</div>`
		const html:string = `${header}${sessionTable}${footer}`;

		return html;
	}
}