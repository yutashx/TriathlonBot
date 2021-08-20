class Wbgt{
	url:string;
	wbgts:wbgt[];
	constructor(url:string="https://www.wbgt.env.go.jp/prev15WG/dl/yohou_36361.csv"){
		this.url = url;
	}

	public parse(){
		const content:string = UrlFetchApp.fetch(this.url).getContentText("UTF-8");
		const csv:string[][] = Utilities.parseCsv(content);
		const pairs:string[][] = Utility.zip([csv[0], csv[1]])
		const wbgts:wbgt[] = pairs.filter(x => x[0] != "")
		.map(x => {
			const date:Date = new Date(Number(x[0].slice(0,4)), Number(x[0].slice(4,6))-1, Number(x[0].slice(6,8)), Number(x[0].slice(8,10)));
			const time:string = `${x[0].slice(8,10)}:00`
			const wbgtVal:number = Number(x[1])/10;
			const wbgt:wbgt = {date: date, time: time, wbgt: wbgtVal}
			return wbgt;
		})

		this.wbgts = wbgts;
	}

	public search(date:Date, time:string):number{
		const matchDate:wbgt[] = this.wbgts.filter(x => x.date.getFullYear() == date.getFullYear() && x.date.getMonth() == date.getMonth() && x.date.getDate() ==  date.getDate());
		const timeDiff:number[] = matchDate.map(x => Math.abs(Number(time.split(":")[0]) - x.date.getHours()) % 24)
		const min:number = Math.min(...timeDiff);
		try{
			if (timeDiff.length > 0){
				const matchWbgt:wbgt = matchDate[timeDiff.indexOf(min)];
				const wbgtVal:number = matchWbgt.wbgt;
				return wbgtVal;
			}else{
				return -1;
			}

		}catch (e){
			console.log(`unexpected error in Wbgt search: ${e}`)
			return -1;
		}
	}
}