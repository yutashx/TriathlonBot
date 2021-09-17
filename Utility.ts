class Utility{
    constructor(){
    }

    /*
    public static getToday():string{
        const today:Date = new Date();
        const todayFormat:string = this.makeDateFormat(today);

        return todayFormat;
    }

    public static getAfterDays(n:number):string{
        const today:Date = new Date();
        const afterNDays:Date = new Date(today);
        afterNDays.setDate(afterNDays.getDate() + n);
        const dayFormat:string = this.makeDateFormat(afterNDays);

        return dayFormat;
    }
    */

    public static getAfterNDaysFrom(date:Date, n:number):Date{
        date.setDate(date.getDate() + n);

        return date;
    }

    public static date2str(date:Date, format:string):string{
        const formattedDate:string = format
            .replace("%Y", String(date.getFullYear()))
            .replace("%M", String(date.getMonth()).padStart(2, "0"))
            .replace("%D", String(date.getDate()).padStart(2, "0"))

        return formattedDate
    }

    /*
    public static makeDateFormat(day:Date):string{
        const year = day.getFullYear();
        const month = String(day.getMonth()+ 1).padStart(2, "0");
        const date = String(day.getDate()).padStart(2, "0");
        const formatted = `${year}-${month}-${date}`;

        return formatted;
    }

    public static getAfterDaysMMDD(n:number):string{
        const today:Date = new Date();
        const afterNDays:Date = new Date(today);
        afterNDays.setDate(afterNDays.getDate() + n);
        const dayFormat:string = this.makeDataFormatMMDD(afterNDays);

        return dayFormat;
    }

    public static getAfterDaysMMDDwithSlash(n:number):string{
        const today:Date = new Date();
        const afterNDays:Date = new Date(today);
        afterNDays.setDate(afterNDays.getDate() + n);
        const dayFormat:string = this.makeDataFormatMMDDwithSlash(afterNDays);

        return dayFormat;
    }
    
    public static getAfterNDaysDate(n:number){
        const today:Date = new Date();
        const afterNDays:Date = new Date(today);
        afterNDays.setDate(afterNDays.getDate() + n);
        
        return afterNDays
    }

    public static makeDataFormatMMDD(day:Date):string{
        const month = String(day.getMonth()+ 1).padStart(2, "0");
        const date = String(day.getDate()).padStart(2, "0");
        const formatted = `${month}${date}`;

        return formatted;
    }

    public static makeDataFormatMMDDwithSlash(day:Date):string{
        const month = String(day.getMonth()+ 1).padStart(2, "0");
        const date = String(day.getDate()).padStart(2, "0");
        const formatted = `${month}/${date}`;

        return formatted;
    }

    public static makeDataFormatYYYYMMDD(day:Date):string{
        const year = String(day.getFullYear())
        const month = String(day.getMonth()+ 1).padStart(2, "0");
        const date = String(day.getDate()).padStart(2, "0");
        const formatted = `${year}-${month}-${date}`;

        return formatted;
    }
    */
    
    public static dateOrder(right:string, left:string):boolean{
        // input: "YYYY-MM-DD"
        const splitRight:number[] = right.split("-").map(x => Number(x))
        const splitLeft:number[] = left.split("-").map(x => Number(x))
        
        if (splitRight[0] > splitLeft[0]){
            return true
        }else if (splitRight[1] > splitLeft[1]){
            return true
        }else if (splitRight[2] > splitLeft[2]){
            return true
        }else{
            return false
        }
    }

    public static getTimeFormat(time:Date):string{
        const hour = String(time.getHours()).padStart(2, "0");
        const min = String(time.getMinutes()).padStart(2, "0");
        const formatTime = `${hour}:${min}`;
        
        return formatTime;
    }

    public static eventJp2En(event:EventType):string{
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

    public static day2En(date:Date):Day{
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

    public static zip = rows=>rows[0].map((_,c)=>rows.map(row=>row[c]));

    public static range(start:number, stop:number, step:number=1):number[]{
        const result:number[] = [];
        for (var i=start; i<stop; i+=step){
            result.push(i)
        }
        return result;
    }
}