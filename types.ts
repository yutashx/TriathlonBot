interface MenuSession{
    date: string;
    event: EventType;
    detail: string;
    time: string;
    place:string;
    wbgt:number;
}

interface Member{
    name: string;
    grade: string;
    address: string;
    belongs: string;
}

interface MailParams{
    subject: string;
    sender: Member;
    to_address: string[];
}

interface BikeFormParam{
    sendNDaysAfter: number; //send an email for N days after bike practice
    deadlineNDayAfter: number; //deadline day is N days after today.
    deadlineTime: string; //HH:MM
}

interface wbgt{
    date: Date;
    time: string;
    wbgt: number;
}

type EventType = "イベント"| "ミーティング"| "バイク"| "ラン"| "スイム"|"休み"|"undefined";
type SendFlag = "send"|"presend"|"prevent"|"debug";
type SheetColName = "Date"|"Day"|"Event"|"Detail"|"Time"|"Place"|"SendFlag"|"Remarks"|"Comment"|
                    "Name"|"ParticipantStyle"|"BikeStatus"|"Car"|
                    "VarName"|"Grade"|"MailAddress"|"Belong"|
                    "Undefined";
type ParticipantStyle = "選手"|"マネージャー";
type Day = "Sun"|"Mon"|"Tue"|"Wed"|"Thu"|"Fri"|"Sat"|"Error";
type WeeklyMail = "Validate"|"Production"
