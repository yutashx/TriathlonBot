class Config {
	configSheet: Sheet
	configSheetNumber: number
	membersSheet: Sheet
	membersSheetNumber: number
	membersEntityNames: string[]

	constructor(configSheetName:string, membersSheetName:string){
		const sheetId:string = SpreadsheetApp.getActiveSpreadsheet().getId()

		this.configSheet = new Sheet(sheetId, configSheetName)
		this.configSheetNumber = this.configSheet.searchSheetNumber()
		this.membersSheet = new Sheet(sheetId, membersSheetName)
		this.membersSheetNumber = this.membersSheet.searchSheetNumber()
		
		this.membersEntityNames = ["SenderNames", "DebuggerNames", "TesterNames", "ProductionNames"]
	}
	
	public load(){
		const envs = this.parseConfigSheet()	
		const members = this.parseMembersSheet()
		
		this.membersEntityNames.forEach(entityName => {
			const membersName = envs[entityName]
			const entity = entityName.replace("Names", "")
			envs[entity] = membersName.map(memberName => members[memberName])
		})
		
		return envs
	}
	
	private parseConfigSheet(){
		const dataset = this.configSheet.getDataset(this.configSheet.sheets[this.configSheetNumber])
		const envs: {[key:string]: any} = {}
		dataset.forEach((row, n)=> {
			if (row.length <= 1) return // only one column is ignored
			row.forEach((item, n)=> {
				if (n == 0){
					envs[row[0]] = [] // make dict key
				}else if (item){
					envs[row[0]].push(item) // insert dict item
				}
			});
		});
		return envs
	}
	
	private parseMembersSheet(){
		const dataset = this.membersSheet.getDataset(this.membersSheet.sheets[this.membersSheetNumber], true)
		const header = dataset[0]
		const members: {[key:string]: any} = {}
		dataset.slice(1).forEach((row) => {
			let keyName
			Utility.zip([header, row]).map((keyItem) => {
				if (keyItem[0] == "VarName"){
					keyName = keyItem[1]
					members[keyName] = {}
				} else members[keyName][keyItem[0]] = keyItem[1]
			})
		});
		
		return members
	}
}