class Config {
	sheetId: string
	configSheet: Sheet
	configSheetNumber: number
	membersSheet: Sheet
	membersSheetNumber: number

	constructor(configSheetName:string, membersSheetName:string){
		this.sheetId = SpreadsheetApp.getActiveSpreadsheet().getId()

		this.configSheet = new Sheet(this.sheetId, configSheetName)
		this.configSheetNumber = this.configSheet.searchSheetNumber()
		this.membersSheet = new Sheet(this.sheetId, membersSheetName)
		this.membersSheetNumber = this.membersSheet.searchSheetNumber()
		
	}
	
	public parseStrictly(){
		// with type check
		const [envs, membersEntityNames] = this.parseConfigSheet()	
		const members = this.parseMembersSheet()
		envs["SheetId"] = this.sheetId
		
		membersEntityNames.forEach(entityName => {
			const membersName = envs[entityName]
			const entity = entityName.replace("Name", "")
			envs[entity] = membersName.map(memberName => members[memberName] as Member)
		})
		
		return envs
	}
	
	public parseRoughly(){
		// without type check
		const dataset = this.configSheet.getDataset(this.configSheet.sheets[this.configSheetNumber])
		const envs: {[key:string]: any} = {}
		const members = this.parseMembersSheet()
		dataset.forEach((row, n)=> {
			row.forEach((item, n)=> {
				if (n == 0) envs[row[0]] = []
				else if (n == 1) undefined // nothing to do
				else if (item !== '') envs[row[0]].push(item)
			})
		})
		envs["Debugger"] = envs["DebuggerName"].map(memberName => members[memberName] as Member)
		
		return envs
	}

	
	private parseConfigSheet(){
		const dataset = this.configSheet.getDataset(this.configSheet.sheets[this.configSheetNumber])
		const envs: {[key:string]: any} = {}
		const membersEntityNames:string[] = []

		dataset.forEach((row, n)=> {
			if (row.length <= 2) return // no value row is ignored
			const key:string = row[0]
			const isArray:boolean = row[1].includes("[]")
			const type:string =  row[1].replace("[]", "")
			if (type == "Member") membersEntityNames.push(key)
			
			if (isArray){
				row.forEach((item, n)=> {
					if (n == 0 || n == 1){
						envs[key] = []
					}else if (item !== ''){
						if (this.typeCheck(type, item)){
							envs[key].push(item)
						}else{
							throw new Error(`type error: ${key} is expected ${type}, but ${typeof item}`)
						}
					}
				})
			}else{
				if (this.typeCheck(type, row[2])){
					envs[key] = row[2]
				}else{
					throw new Error(`type error: ${key} is expected ${type}, but ${typeof row[2]}`)
				}
			}

		})
		return [envs, membersEntityNames]
	}
	
	private typeCheck(type:string, value:any){
		switch(type){
			case "string":
				return (typeof value === "string")
			case "number":
				return (typeof (value as number) === "number")
			case "boolean":
				return (typeof (value as boolean) === "boolean")
			case "Member":
				return (typeof value === "string")
			case "object":
				return (typeof value === "object")
			default:
				return (typeof value === "string")
		}
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