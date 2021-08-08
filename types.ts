interface MenuSession{
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

type EventType = "イベント"| "ミーティング"| "バイク"| "ラン"| "スイム"|"複合練"|"休み";
type Purpose = "練習"|"リマインダー"|"バイク練出欠確認";
type SendFlag = "send"|"presend"|"prevent";
type SheetColName = "Date"|"Day"|"Event"|"Detail"|"Time"|"Place"|"SendFlag"|"Name"|"ParticipantStyle"|"BikeStatus"|"Remarks";
type ParticipantStyle = "選手"|"マネージャー";