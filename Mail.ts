class Mail{
    tag: string;
    purpose: Purpose;
    params: MailParams;
    sendFlag: SendFlag;
    others: string[]|undefined;

    constructor(tag: string, purpose: Purpose, params: MailParams, sendFlag: SendFlag, others?: string[]){
        this.tag = tag;
        this.purpose = purpose;
        this.params = params;
        this.sendFlag = sendFlag;
        this.others = others;
    }

    send(){
        const subject:string = this.generateSubject();
        const html:string = this.generateHtml();
        const senderName:string = this.params.sender.name;
        const to_address:string = this.params.to_address.join(",");
        const options:{[key: string]: string} = {name: senderName, htmlBody: html};
        const msg:string = "I thought what I'd do was, I'd pretend I was one of those deaf-mutes";

        //console.log(subject);
        console.log(html);

        if (this.sendFlag == "prevent"){
            console.log("sending a mail is prevented");
        }else{
            GmailApp.sendEmail(to_address, subject, msg, options);
            console.log(`[${this.sendFlag}] A mail is sent for ${this.purpose} from ${senderName}: ${this.params.sender.address} to ${to_address}`);
        }
    }

    //generate > make

    generateSubject():string{
        const subject =  `[${this.tag}]${this.params.subject} `

        return subject;
    }

    generateHtml():string{
        const html = this.makeIntroMyself() + this.makeAbstract() + this.makeContents() + this.makeFooter();

        return html;
    }


    makeIntroMyself():string{
        const intro = `${this.params.sender.grade}の${this.params.sender.name}です。<br>`;

        return intro;
    }

    makeAbstract():string{
        const abstract = "<br>";

        return abstract;
    }

    makeContents():string{
        const contents = "<br>";

        return contents;
    }

    makeFooter():String{
        //indent is irregular for space
        const text = `
以上です。<br>
何か質問等がありましたら私まで連絡してください。<br>
--------------------<br>
${this.params.sender.belongs}<br>
${this.params.sender.grade} ${this.params.sender.name}<br>
email: ${this.params.sender.address}<br>
--------------------<br>
        `;

        return text;
    }
}