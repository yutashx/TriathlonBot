class Menu{
	sheet:Sheet;
	sendFlag:string;

	constructor(sheetId:string, sheetName:string){
		this.sheet = new Sheet(sheetId, sheetName);
	}

	parseMenu(rows:string[]):MenuSession[]{
		if (rows.length == 1){
			const date:string = rows[0][this.sheet.getColNum("Date")];
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
				for (var i=0; i<splitedNums[0]; i++){
					const session:MenuSession = {date: date, event: events[i] as EventType, detail: details[i], time: times[i], place: places[i]};
					sessions.push(session);
				}
				return sessions;
			}else{
				throw new Error(`Expected all columns has the same size ${splitedNums[0]}, but event: ${splitedNums[0]}, detail: ${splitedNums[1]}, time: ${splitedNums[2]}, place: ${splitedNums[3]}.`);

				return [];
			}
		}else{
			throw new Error(`Expected 1 row, but get ${rows.length}.`)

			return[];
		}
	}

	parseAfterNDays(n:number):MenuSession[]{
		const tomorrow:string = Utility.getAfterDays(n);
		const todayRows:string[] = this.sheet.getTheDateRows(tomorrow);
		const menuSessions:MenuSession[] = this.parseMenu(todayRows);

		return menuSessions;
	}

	parseMatchedDays(targetDates:string):MenuSession[][]{
		const sheetNo:number = this.sheet.searchSheetNumber();
		const dates:string[] = this.sheet.searchRows(sheetNo, "Date", targetDates, Operator.partiallyMatch);
		const multiDaysMenuSessions = dates.map(x => this.parseMenu([x]));

		return multiDaysMenuSessions;
	}

	listUpBikeMembers():string {
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