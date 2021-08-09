class Menu{
	sheet:Sheet;
	sendFlag:string;
	sessions: MenuSession[] = [];

	constructor(sheetId:string, sheetName:string){
		this.sheet = new Sheet(sheetId, sheetName);
	}

	parseAfterNDays(n:number):MenuSession[]{
		const tomorrow:string = Utility.getAfterDays(n);
		const todayRows:string[] = this.sheet.getTheDateRows(tomorrow);

		if (todayRows.length == 1){
		const events:string[] = todayRows[0][this.sheet.getColNum("Event")].split("/");
		const details:string[] = todayRows[0][this.sheet.getColNum("Detail")].split("/");
		const times:string[] = todayRows[0][this.sheet.getColNum("Time")].split("/");
		const places:string[] = todayRows[0][this.sheet.getColNum("Place")].split("/");
		const sendFlag:string = todayRows[0][this.sheet.getColNum("SendFlag")];
		this.sendFlag = sendFlag;

		const splitedNums = [events, details, times, places].map(x => x.length);
		// check all columns contains the same number
		if (splitedNums.every(x => x == splitedNums[0])){
			for (var i=0; i<splitedNums[0]; i++){
			const session:MenuSession = {event: events[i] as EventType, detail: details[i], time: times[i], place: places[i]};
			this.sessions.push(session);
			}
			return this.sessions;
		}else{
			throw new Error(`Expected all columns has the same size ${splitedNums[0]}, but event: ${splitedNums[0]}, detail: ${splitedNums[1]}, time: ${splitedNums[2]}, place: ${splitedNums[3]}.`);

			return [];
		}
		}else{
			throw new Error(`Expected 1 row, but get ${todayRows.length}.`)

			return[];
		}
	}
}