class CalendarClass{
	calId:string;
	constructor(calId:string){
		this.calId = calId;
	}

	getCalendar(startDate:Date, endDate:Date){
		const cal = CalendarApp.getCalendarById(this.calId);
		const eventDays = cal.getEvents(startDate, endDate).map(x => [x.getStartTime(), x.getTitle()]);

		return eventDays;
	}
}