function testMail(){
	const flags:SendFlag[] = ["send", "presend", "debug", "prevent"]
	flags.forEach(flag => {
		testMailSystem("TestMailSubject", Mail)
	})
}

function testDailyMail(){
	testMailSystem("DailyMenuMailSubject", DailyMenuMail)	
}

function testWeeklyMail(){
	testMailSystem("WeeklyMenuMailSubject", WeeklyMenuMail)	
}

function testBikeFormMail(){
	testMailSystem("BikeFormMailSubject", BikeFormMail)	
}

function testValidateWeeklyMail(){
	testMailSystem("ValidateWeeklyMenuMailSubject", ValidateMenu)
}

const testMailSystem = (subject:string, Mail:any) => {
	const config = (new Config("config", "members")).parseStrictly()
	const mail = new Mail(config, "debug", true)
	mail.send(config[subject])
}

function testUtility(){
	const today = new Date(2021, 3, 1);
	const formatToday1 = Utility.makeDateFormat(today);
	if ("2021-04-01" == formatToday1){
		console.log("makeDateFormat pass test");
	}else{
		console.log(`test fail: ${formatToday1}`)
	}

	const formatToday2 = Utility.getToday();
	console.log(`getToday: ${formatToday2}`);

	const afterDays = Utility.getAfterDays(3);
	console.log(`getAfterDays: ${afterDays}`)
}

function testUtilityZip(){
	const num:string[] = ["0", "1", "2"];
	const en:string[] = ["zero", "one", "two"];
	const result = Utility.zip([num, en]);

	console.log(result);
}

function testSheet(){
	const config = (new Config("config", "members")).parseStrictly()
	const sheet:Sheet = new Sheet(config["SheetId"] as string, config["MenuSheetName"] as string);
	const sheetNo:number = sheet.searchSheetNumber();

	const row0 = sheet.searchRows(sheetNo, "Event", "スイム", Operator.equal);
	console.log(row0);

	const date:string = "2021-04-01";
	const row1:string[] = sheet.getTheDateRows(date);
	console.log(row1);
}

function testSheetPartially(){
	const config = (new Config("config", "members")).parseStrictly()
	const sheet:Sheet = new Sheet(config["SheetId"] as string, config["MenuSheetName"] as string);
	const sheetNo:number = sheet.searchSheetNumber();

	const date:string = "2021-04";
	const row0 = sheet.searchRows(sheetNo, "Date", date, Operator.partiallyMatch);
	console.log(row0);
}

function testBikeFormGenerate(){
	const config = (new Config("config", "members")).parseStrictly()
	const bikeForm:BikeForm = new BikeForm(config["SheetId"], config["MenuSheetName"], config["BikeFormDefaultSheetName"]);
        const formUrls:string[] = bikeForm.generate(config["BikeFormMailSubject"][1], "sample");
	console.log(formUrls)
}

function testBikeFormUnlink(){
	const config = (new Config("config", "members")).parseStrictly()
	const bikeForm:BikeForm = new BikeForm(config["SheetId"], config["MenuSheetName"], config["BikeFormDefaultSheetName"]);
	const today:string = Utility.makeDataFormatYYYYMMDD(new Date())
	const unlinkStatus = bikeForm.unlink(today);
}

function testMonthlyPage(){
	const config = (new Config("config", "members")).parseStrictly()
	const searchMonth:{[val: string]: number} = {"year": 2021, "month": 5};
	const monthlyPage:MonthlyPage = new MonthlyPage(config, searchMonth);
	const html:string = monthlyPage.generateContents();

	console.log(html);
}

function testMonthlyPageAPI(){
	const searchMonth:{[val: string]: number} = {"year": 2021, "month": 5};
	const params = { parameters: {}, parameter: {year: 2021, month: 5}, queryString: '', contentLength: -1, contextPath: '' }
	const output = doGet(params);

	console.log(output);
}

function testGetCalendar(){
	const today:Date = new Date();
	const startDate:Date = new Date(today.getFullYear(), 0, 1);
	const endDate:Date = new Date(today.getFullYear()+2, 0, 0); //end of the next year
	const calId:string = "ja.japanese#holiday@group.v.calendar.google.com";
	const calendar:CalendarClass = new CalendarClass(calId);
	const holidays = calendar.getCalendar(startDate, endDate);

	const config = (new Config("config", "members")).parseStrictly()
	const sheet:Sheet = new Sheet(config["SheetId"] as string, config["MenuSheetName"] as string);

	sheet.insertRightTop(holidays);

	console.log(holidays);
}

function testWbgt(){
	const URL:string = "https://www.wbgt.env.go.jp/prev15WG/dl/yohou_36361.csv" //aizu wakamatsu
	const wbgt:Wbgt = new Wbgt(URL);
	const today:Date = new Date();
	const tomorrow:Date = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1);
	wbgt.parse();
	const val:number = wbgt.search(tomorrow, "14:10");

	console.log(`WBGT value is ${val}`);
}

function testLoadConfig(){
	const config:Config = new Config("config", "members")
	const envs = config.parseStrictly()
	console.log(envs)

	const debuggerEnvs = config.parseRoughly()
	console.log(debuggerEnvs)
}

function testDateOrder(){
	const date0 = "2021-10-30"
	const date1 = "2020-10-30"
	const date2 = "2021-09-29"
	const date3 = "2021-10-26"

	const test0:boolean = Utility.dateOrder(date0, date1)
	const test1:boolean = Utility.dateOrder(date1, date0)
	console.log(String(test0 == true))
	console.log(String(test1 == false))

	const test2:boolean = Utility.dateOrder(date0, date2)
	const test3:boolean = Utility.dateOrder(date2, date0)
	console.log(String(test2 == true))
	console.log(String(test3 == false))

	const test4:boolean = Utility.dateOrder(date0, date3)
	const test5:boolean = Utility.dateOrder(date3, date0)
	console.log(String(test4 == true))
	console.log(String(test5 == false))

	const test6:boolean = Utility.dateOrder(date0, date0)
	console.log(String(test6 == false))
}