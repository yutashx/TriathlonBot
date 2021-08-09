class Operator{
	constructor(){}

	public static equal(item0:any, item1:any):boolean{
		const status:boolean = item0 == item1? true: false;

		return status;
	}

	public static partiallyMatch(item0:string, item1:string){
		const status:boolean = item0.includes(item1);

		return status;
	}
}