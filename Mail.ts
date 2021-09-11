class Mail{
    config: any
    sendFlag: SendFlag
    debugFlag: boolean

    tag: string
    title: string
    debugger: Member[]
    tester: Member[]
    receiver: Member[]
    sender: Member

    constructor(config: any, sendFlag: SendFlag, debugFlag:boolean=false){
        this.config = config
        this.sendFlag = sendFlag
        this.debugFlag = debugFlag

        // Bot must inform debugger when error is ocurred,
        // so debugger must be register bot as early stage as possible.
        if (this.config["Debugger"].length == 0) throw new Error(`No one is Debugger`)
        this.debugger = this.config["Debugger"]
    }

    public send(subjectSlug: string[]){
        if (this.config["Tester"].length == 0) throw new Error(`No one is Tester`)
        this.tester = this.config["Tester"]

        if (this.config["Receiver"].length == 0) throw new Error(`No one is Receiver`)
        this.receiver = this.config["Receiver"]

        if (this.config["Sender"].length != 1) throw new Error(`Sender is only one`)
        this.sender = this.config["Sender"][0]

        if (subjectSlug.length != 2) throw new Error(`The number of subject_slug is not two`)
        this.tag = subjectSlug[0]
        this.title = subjectSlug[1]

        const subject:string = this.generateSubject()
        const html:string = this.generateHtml()

        const senderName:string = this.sender.name
        const to_address:string = this.decideAddress().map(member => member.address).join(",")

        const options:{[key: string]: string} = {name: senderName, htmlBody: html};
        const msg:string = "I thought what I'd do was, I'd pretend I was one of those deaf-mutes";

        switch (this.sendFlag){
            case "prevent":
                console.log("sending a mail is prevented")
                break
            case "send":
            case "presend":
                GmailApp.sendEmail(to_address, subject, msg, options);
                console.log(`[${this.sendFlag}] A mail is sent from ${senderName}: ${this.sender.address} to ${to_address}`);
                break
            case "debug":
                const to_debugger:string = this.debugger.map(member => member.address).join(",")
                GmailApp.sendEmail(to_debugger, subject, msg, options);
                console.log(`[${this.sendFlag}] A mail is sent from ${senderName}: ${this.sender.address} to ${to_address}`);
                break
            default:
                console.log(`no flag is matched`)
                break
        }
    }
    
    public sendError(error_msg: string){
        const error_subject:string = `[Error] You should fix right now!`
        const to_address:string = this.debugger.map(member => member.address).join(",")

        GmailApp.sendEmail(to_address, error_subject, error_msg);
        console.log(`[error] This Triathlon Bot is now facing some problem! ${error_msg}`)
    }
    
    private decideAddress():Member[]{
        if (this.debugFlag) return this.debugger

        switch (this.sendFlag){
            case "send":
                return this.receiver
            case "presend":
                return this.tester
            case "prevent":
                return this.debugger
            default:
                return this.debugger
        }
    }

    //generate > make

    private generateSubject():string{
        const prefix:string = this.sendFlag == "presend"? `[Presend]`: ``;
        const subject:string =  prefix + `[${this.tag}]${this.title} `

        return subject;
    }

    private generateHtml():string{
        const html:string = this.makeIntroMyself() + this.makeAbstract() + this.makeContents() + this.makeFooter();

        return html;
    }


    private makeIntroMyself():string{
        const intro = `${this.sender.grade}の${this.sender.name}です。<br>`;

        return intro;
    }

    protected makeAbstract():string{
        const abstract = "<br>";

        return abstract;
    }

    protected makeContents():string{
        const contents = "<br>";

        return contents;
    }

    protected makeFooter():String{
        //indent is irregular for space
        const text = `
        以上です。<br>
        何か質問等がありましたら私まで連絡してください。<br>
        -------------------------<br>
        ${this.sender.belongs}<br>
        ${this.sender.grade} ${this.sender.name}<br>
        email: ${this.sender.address}<br>
        -------------------------<br>
        `;

        return text;
    }

    protected overwriteSendFlag(sendFlag){
        const preventFlags = ["1", 1, "prevent", "Prevent", "daily", "all"];
        if (preventFlags.includes(sendFlag)){
            this.sendFlag = "prevent";
        }
    }
    
}
