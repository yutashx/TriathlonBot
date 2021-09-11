function doGet(e){
	console.log(e);
	try{
		const year:number = Number(e.parameter.year);
		const month:number = Number(e.parameter.month);
		const config = (new Config("config", "members")).parseStrictly()

		if (year == NaN || month == NaN) throw new Error(`You forget to specify year or month`);
		const searchMonth:{[val: string]: number} = {"year": year, "month": month};
		const monthlyPage:MonthlyPage = new MonthlyPage(config, searchMonth);
		const html = monthlyPage.generateHTML();

		const response = ContentService.createTextOutput(html);
		response.setMimeType(ContentService.MimeType.TEXT);

		return response;
	}catch(error){
		console.log(error);

		return "error!";
	}

}
