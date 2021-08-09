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

    static getAfterDaysMMDDwithSlash(n:number):string{
        const today:Date = new Date();
        const afterNDays:Date = new Date(today);
        afterNDays.setDate(afterNDays.getDate() + n);
        const dayFormat:string = this.makeDataFormatMMDDwithSlash(afterNDays);

        return dayFormat;
    }

    static makeDataFormatMMDD(day:Date):string{
        const month = String(day.getMonth()+ 1).padStart(2, "0");
        const date = String(day.getDate()).padStart(2, "0");
        const formatted = `${month}${date}`;

        return formatted;
    }

    static makeDataFormatMMDDwithSlash(day:Date):string{
        const month = String(day.getMonth()+ 1).padStart(2, "0");
        const date = String(day.getDate()).padStart(2, "0");
        const formatted = `${month}/${date}`;

        return formatted;
    }

    static getTimeFormat(time:Date):string{
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

    static day2En(date:Date):Day{
        const numDay:number = date.getDay();
        switch(numDay){
            case 0:
                return "Sun";
            case 1:
                return "Mon";
            case 2:
                return "Tue";
            case 3:
                return "Wed";
            case 4:
                return "Thu";
            case 5:
                return "Fri";
            case 6:
                return "Sat";
            default:
                return "Error";
        }
    }

    static zip = rows=>rows[0].map((_,c)=>rows.map(row=>row[c]));
}