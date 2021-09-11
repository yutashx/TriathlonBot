class MonthlyPage{
	targetMonth:{[val:string]: number}; //[YYYY, MM]
	menuSheet:Menu;
	config:any
	constructor(config:any, targetMonth:{[val:string]: number}){
		this.config = config
		this.targetMonth = targetMonth;
		this.menuSheet = new Menu(this.config["SheetId"], this.config["MenuSheetName"]);
	}

	public generateContents():string{
		const targetDates = `${this.targetMonth["year"]}-${String(this.targetMonth["month"]).padStart(2, "0")}`
		const multiDaysMenuSessions:MenuSession[][] = this.menuSheet.parseMatchedDays(targetDates);
		const sessionTable:string[] = multiDaysMenuSessions.map(menuSessions => {
			const date:Date = new Date(menuSessions[0].date); 
			const dateSlash:string = Utility.makeDataFormatMMDDwithSlash(date);
			const dayEn:string = Utility.day2En(date);

			const eventsJp:EventType[] = menuSessions.map(x => x.event);
			const eventsEn:string[] = eventsJp.map(x => Utility.eventJp2En(x));
			const mains:string[] = menuSessions.map(x => x.detail);
			const dateMMDD:string[] = menuSessions.map(x => Utility.makeDataFormatMMDD(new Date(x.date)));
			const link:string[] = Utility.zip([eventsEn, mains, dateMMDD, eventsJp]).map(x =>{
				if (["ラン", "スイム", "バイク"].includes(x[3])){
					return `<a href="${this.config["UoAMenuURL"]}${x[0]}/${x[2]}.html" _target="parent">${x[3]}練[${x[1]}]</a>`
				}else{
					return `<a href="" _target="parent">${x[3]}[${x[1]}]<a>`
				}
			});

			const sessions:string = ((dayEn, link)=>{
				const prefix:string = "";
				const suffix:string = dayEn == "Sat"? "<hr>\n\n": "";
				const sessions:string = `${prefix}<li>${dateSlash}(${dayEn}): ${link}</li>\n${suffix}`

				return sessions;
			})(dayEn, link);

			return sessions;
		})

		const header:string = `<div id=\"contents\">\n<h3>${this.targetMonth["year"]} 部活内容</h3>\n<ul>\n<h4>${this.targetMonth["year"]}年${this.targetMonth["month"]}月</h4>\n<hr>\n<style></style>\n<hr>\n`;
		const footer:string = `<hr>\n\n</ul>\n</div>`
		const html:string = `${header}${sessionTable.join("\n")}${footer}`;

		return html;
	}

	public generateHTML(){
		const template = HtmlService.createTemplateFromFile("uoa_template");
		const contents:string = this.generateContents();
		template.contents = contents;
		template.year = this.targetMonth["year"];

		//reformat
		const lt = /&lt;/g;
		const gt = /&gt;/g;
		const dquote = /&#34;/g;
		const reformatTemplate = template.evaluate().getContent().replace(lt, "<").replace(gt, ">").replace(dquote, "\"");

		return reformatTemplate;
	}
}