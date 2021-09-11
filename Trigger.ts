
function SendTestPracticeEmail(){
	sendMailSystem("presend", "DailyMenuMailSubject", DailyMenuMail)
}

function SendProductionPracticeEmail(){
	sendMailSystem("send", "DailyMenuMailSubject", DailyMenuMail)
}

function SendProductionBikeFormEmail(){
	sendMailSystem("send", "BikeFormMailSubject", BikeFormMail)
}

function SendTestWeeklyMenuMail(){
	sendMailSystem("presend", "WeeklyMenuMailSubject", WeeklyMenuMail)
}

function SendProductionWeeklyMenuMail(){
	sendMailSystem("send", "WeeklyMenuMailSubject", WeeklyMenuMail)
}

function SendTestWeeklyFilledCheckMail(){
	sendMailSystem("presend", "ValidateWeeklyMenuSubject", ValidateMenu)
}

const sendMailSystem = (sendFlag:SendFlag, subject:string, Mail:any) => {
	try{
		const config = (new Config("config", "members")).parseStrictly()
		const mail = new Mail(config, sendFlag)
		// The errorMail is for debug mail instance
		// When error occurs in initializing production mail instance, we cannot use the instance to send.
		// We should create the another mail instance to send error message.
		// The error mail is always sent debuggers.

		const _subjectSlug:string[] = config[subject]
		if (_subjectSlug.length != 2) throw new Error(`Length of '${subject}' is expected 2, but got ${_subjectSlug.length}`)
		const subjectSlug = _subjectSlug

		mail.send(subjectSlug)
	}catch (error){
		console.log(error)
		const config = (new Config("config", "members")).parseRoughly()
		const errorMail = new Mail(config, sendFlag) 
		errorMail.sendError(error)
	}
}

function UpDateHolidays(){
	const today:Date = new Date();
	const startDate:Date = new Date(today.getFullYear(), 0, 1);
	const endDate:Date = new Date(today.getFullYear()+2, 0, 0); //end of the next year
	const calId:string = "ja.japanese#holiday@group.v.calendar.google.com";
	const calendar:CalendarClass = new CalendarClass(calId);
	const holidays = calendar.getCalendar(startDate, endDate);

	const config = (new Config("config", "members")).parseStrictly()
	const sheet:Sheet = new Sheet(config["SheetId"] as string, config["MenuSheetName"] as string);
	sheet.insertRightTop(holidays);
}