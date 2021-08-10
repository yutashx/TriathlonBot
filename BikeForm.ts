class BikeForm{
	sheet:Sheet;
	constructor(sheetId:string, sheetName:string){
		const sheet = new Sheet(sheetId, sheetName);
		this.sheet = sheet;
	}

	public generate(subject:string, description:string):string[]{
		const ss = this.sheet.spreadsheet;
		const form = FormApp.create(subject)
		.setDescription(description)
		.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
		
		const name = form.addTextItem()
		.setTitle("氏名")
		.setRequired(true);

		const checkBoxValidation = FormApp.createCheckboxValidation()
		.setHelpText("一つ選んでください")
		.requireSelectExactly(1)
		.build();

		const role = form.addCheckboxItem();
		role.setRequired(true)
		.setValidation(checkBoxValidation)
		.setTitle("参加方法")
		.setChoices([
			role.createChoice("選手"),
			role.createChoice("マネージャー")
		])
		

		const participantStyle = form.addCheckboxItem();
		participantStyle.setTitle("バイク")
			.setChoices([
			participantStyle.createChoice("部のバイクで参加")
		])

		const car = form.addCheckboxItem();
		car.setTitle("車出し")
		.setChoices([
			car.createChoice("可能")
		])
		const remarks = form.addTextItem();
		remarks.setTitle("備考");

		const publishUrl = form.getPublishedUrl();
		const editUrl = form.getEditUrl();
		
		return [publishUrl, editUrl]
	}

	public unlink(sheetName:string):boolean{
		const sheets = this.sheet.sheets; 
		const unlinkStatus:boolean = sheets.map(x =>{
			if (x.getSheetName().includes(sheetName)){
				const form = FormApp.openByUrl(x.getFormUrl());
				form.removeDestination(); //unlink sheet
				this.sheet.spreadsheet.deleteSheet(x); //delete sheet

				return true;
			}else return false;
		}).some(x => x == true);

		return unlinkStatus;
	}
}