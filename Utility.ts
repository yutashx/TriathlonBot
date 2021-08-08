class Utility{
    constructor(){
    }

    static getToday():string{
        const today:Date = new Date();
        const todayFormat:string = this.makeDateFormat(today);

        return todayFormat;
    }

    static getAfterDays(n:number):string{
        const today:Date = new Date();
        const afterNDays:Date = new Date(today);
        afterNDays.setDate(afterNDays.getDate() + n);
        const dayFormat:string = this.makeDateFormat(afterNDays);

        return dayFormat;
    }

    static makeDateFormat(day:Date):string{
        const year = day.getFullYear();
        const month = String(day.getMonth()+ 1).padStart(2, "0");
        const date = String(day.getDate()).padStart(2, "0");
        const formatted = `${year}-${month}-${date}`;

        return formatted;
    }

    static getAfterDaysMMDD(n:number):string{
        const today:Date = new Date();
        const afterNDays:Date = new Date(today);
        afterNDays.setDate(afterNDays.getDate() + n);
        const dayFormat:string = this.makeDataFormatMMDD(afterNDays);

        return dayFormat;
    }

    static makeDataFormatMMDD(day:Date):string{
        const month = String(day.getMonth()+ 1).padStart(2, "0");
        const date = String(day.getDate()).padStart(2, "0");
        const formatted = `${month}${date}`;

        return formatted;
    }

    static getTimeFormat(time):string{
        const hour = String(time.getHours()).padStart(2, "0");
        const min = String(time.getMinutes()).padStart(2, "0");
        const formatTime = `${hour}:${min}`;
        
        return formatTime;
    }
    
    static eventJp2En(event:EventType):string{
        switch(event){
            case "スイム":
                return "swim";
            case "バイク":
                return "bike";
            case "ラン":
                return "run";
            default:
                return "";
        }
    }
}
