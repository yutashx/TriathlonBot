class Sheet{
    id:string;
    sheetName:string;
    spreadsheet;
    sheets;

    constructor(id:string, sheetName:string){
        this.id = id;
        this.sheetName = sheetName;
        this.spreadsheet = SpreadsheetApp.openById(this.id);
        this.sheets = this.spreadsheet.getSheets();
    }

    getTheDateRows(date:string):string[]{
        try{
            const sheetNo:number = this.searchSheetNumber();
            const rows:string[] = this.searchRows(sheetNo, "Date", date);

            return rows;
        }catch(e){
            console.log(`getTheDataRows: ${e}`);

            return [];
        }
    }

    getBikeMembers(style:ParticipantStyle):string[]{
        try{
            const sheetNo:number = this.searchSheetNumber();
            const rows = this.searchRows(sheetNo, "ParticipantStyle", style as string);
            const names = rows.map(x => x[this.getColNum("Name")]);

            return names;
        }catch{
            console.log(`getBikeMembers: {e}`);

            return [];
        }
    }

    searchRows(sheetNo:number, colName:SheetColName, item:string){
        const sheet = this.sheets[sheetNo];
        const range = sheet.getDataRange();
        const lastRow = range.getLastRow();
        const lastCol = range.getLastColumn();
        const dataset = sheet.getRange(2, 1, lastRow, lastCol).getValues(); //2行1列目(headerを除く)からデータを取得
        const colNum = this.getColNum(colName);
        var matchedItems = [];

        for (var i = 0; i < lastRow; i++){
            const lookUpItem = dataset[i][colNum];
            const formatLookUpItem:string = colName == "Date" && lookUpItem?  Utility.makeDateFormat(lookUpItem): lookUpItem;
            if (formatLookUpItem == item){
                matchedItems.push(dataset[i]);
            }
        }

        if (matchedItems){
            return matchedItems;
        }else{
            throw new Error(`no item is found searched for item ${item} at sheetNo: ${sheetNo}`);
            return [];
        }
    }

    getColNum(colName: SheetColName){
        switch(colName){
            //Menu Sheet
            case "Date":
                return 0;
            case "Day":
                return 1;
            case "Event":
                return 2;
            case "Detail":
                return 3;
            case "Time":
                return 4;
            case "Place":
                return 5;
            case "SendFlag":
                return 6;

            //Bike Member Sheet, column 0 is the same as the menu sheet
            case "Name":
                return 1;
            case "ParticipantStyle":
                return 2;
            case "BikeStatus":
                return 3;
            case "Car":
                return 4;
            case "Remarks":
                return 5;
            default:
                return -1;
        }
    }

    searchSheetNumber():number{
        for (var i = 0; i < this.sheets.length; i++){
            if (this.sheets[i].getSheetName().includes(this.sheetName)){
                console.log(`Sheet Name: ${this.sheetName} is found as No.${i}`);
                return i;
            }
        }
        throw new Error(`Sheet Name: ${this.sheetName} is not found`);
        return -1;
    }
}
