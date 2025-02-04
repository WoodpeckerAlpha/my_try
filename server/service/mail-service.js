const nodemailer = require("nodemailer");

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        this.transporter.verify((error, success) => {
            if (error) {
                console.error("SMTP server connection error:", error);
            } else {
                console.log("SMTP server is ready to take our messages.");
            }
        });
    }
    async sendActivationMail(to, link) {
        try {
            let message = {
                from: process.env.SMTP_USER, // Sender address
                to,
                subject: `Активация аккаунта на ${process.env.API_URL}`,
                text: "",
                html: `
                    <div>
                        <h1>Для активации перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `,
            };

            let response = await this.transporter.sendMail(message);

            console.log(`Письмо успешно отправлено на адрес ${to}!`);
            console.log("Server response:", response.response);
        } catch (error) {
            console.error(`Ошибка отправки письма на адрес ${to}:`, error);
        }
    }
}

module.exports = new MailService();
