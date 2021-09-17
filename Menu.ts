class Menu{
	sheet:Sheet;
	sendFlag:string;

	constructor(sheetId:string, sheetName:string){
		this.sheet = new Sheet(sheetId, sheetName);
	}

	public parseMenu(rows:string[]):MenuSession[]{
		if (rows.length == 1){
			const date:Date = new Date(rows[0][this.sheet.getColNum("Date")])
			const events:string[] = rows[0][this.sheet.getColNum("Event")].split("/");
			const details:string[] = rows[0][this.sheet.getColNum("Detail")].split("/");
			const times:string[] = rows[0][this.sheet.getColNum("Time")].split("/");
			const places:string[] = rows[0][this.sheet.getColNum("Place")].split("/");
			const sendFlag:string = rows[0][this.sheet.getColNum("SendFlag")];
			this.sendFlag = sendFlag;

			const splitedNums = [events, details, times, places].map(x => x.length);
			// check all columns contains the same number
			if (splitedNums.every(x => x == splitedNums[0])){
				const sessions: MenuSession[] = [];
				const wbgt:Wbgt = new Wbgt();
				wbgt.parse();
				for (var i=0; i<splitedNums[0]; i++){
					const wbgtVal:number = wbgt.search(new Date(date), times[i]);
					const session:MenuSession = {date: date, event: events[i] as EventType, detail: details[i], time: times[i], place: places[i], wbgt: wbgtVal};
					sessions.push(session);
				}
				return sessions;
			}else{
				throw new Error(`Expected all columns has the same size ${splitedNums[0]}, but event: ${splitedNums[0]}, detail: ${splitedNums[1]}, time: ${splitedNums[2]}, place: ${splitedNums[3]}.`);
			}
		}else{
			throw new Error(`Expected 1 row, but get ${rows.length}. You may need to fix MenuSheetName in config sheet.`)
		}
	}

	public parseAfterNDays(n:number):MenuSession[]{
		const date:Date = Utility.getAfterNDaysFrom(new Date(), n)
		const theDay:string = Utility.date2str(date, "%Y-%M-%D")
		const theDayRows:string[] = this.sheet.getTheDateRows(theDay);
		const menuSessions:MenuSession[] = this.parseMenu(theDayRows);

		return menuSessions;
	}

	public parseMatchedDays(targetDates:string):MenuSession[][]{
		const sheetNo:number = this.sheet.searchSheetNumber();
		const dates:string[] = this.sheet.searchRows(sheetNo, "Date", targetDates, Operator.partiallyMatch);
		const multiDaysMenuSessions = dates.map(x => this.parseMenu([x]));

		return multiDaysMenuSessions;
	}

	public listUpBikeMembers():string {
		//for bike sheet
		const athletes:string[] = this.sheet.getBikeMembers("選手");
		const managers:string[] = this.sheet.getBikeMembers("マネージャー");

		if (athletes && managers){
		const members = `
		以下バイク練の参加者です<br>\n
		選手：<br>\n
		${athletes.join("<br>")}
		<br>\n
		<br>\n
		マネージャー：<br>\n
		${managers.join("<br>")}
		<br>\n
		<br>\n
		`

		return members;
		}else{
			return "参加者なし";
		}
	}
}