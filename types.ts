interface MenuSession{
    date: string;
    event: EventType;
    detail: string;
    time: string;
    place:string;
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

type EventType = "イベント"| "ミーティング"| "バイク"| "ラン"| "スイム"|"複合練"|"休み";
type Purpose = "練習"|"リマインダー"|"バイク練出欠確認";
type SendFlag = "send"|"presend"|"prevent";
type SheetColName = "Date"|"Day"|"Event"|"Detail"|"Time"|"Place"|"SendFlag"|"Name"|"ParticipantStyle"|"BikeStatus"|"Car"|"Remarks";
type ParticipantStyle = "選手"|"マネージャー";
type Day = "Sun"|"Mon"|"Tue"|"Wed"|"Thu"|"Fri"|"Sat"|"Error";
