// 이메일 전송 서비스
export class EmailService {
    constructor() {
        this.fromEmail = 'noreply@pistolinkr.com';
        this.toEmail = 'pistolinkr@icloud.com';
    }

    async sendFeedbackEmail(feedbackData) {
        try {
            const { name, email, type, subject, message } = feedbackData;
            
            const typeLabels = {
                general: '일반 피드백',
                bug: '버그 신고',
                feature: '기능 요청',
                improvement: '개선 제안'
            };

            const typeLabel = typeLabels[type] || type;
            
            const emailSubject = `[GitHub Dashboard Feedback] ${subject}`;
            const emailBody = `
안녕하세요,

GitHub Dashboard에 대한 피드백이 도착했습니다.

📋 피드백 정보:
• 이름: ${name}
• 이메일: ${email}
• 피드백 유형: ${typeLabel}
• 제목: ${subject}

💬 메시지:
${message}

---
GitHub Dashboard (pistolinkr.com)에서 전송됨
            `.trim();

            // 환경 변수에서 이메일 서비스 설정 확인
            const emailService = process.env.EMAIL_SERVICE || 'console';
            
            switch (emailService.toLowerCase()) {
                case 'sendgrid':
                    return await this.sendWithSendGrid({
                        subject: emailSubject,
                        body: emailBody
                    });
                    
                case 'aws-ses':
                    return await this.sendWithAWSSES({
                        subject: emailSubject,
                        body: emailBody
                    });
                    
                case 'smtp':
                    return await this.sendWithSMTP({
                        subject: emailSubject,
                        body: emailBody
                    });
                    
                default:
                    // 콘솔 출력 (개발/테스트용)
                    console.log('📧 피드백 이메일 전송 완료:');
                    console.log('From:', this.fromEmail);
                    console.log('To:', this.toEmail);
                    console.log('Subject:', emailSubject);
                    console.log('Body:', emailBody);
                    
                    return {
                        success: true,
                        message: '피드백이 성공적으로 전송되었습니다! (콘솔 출력)'
                    };
            }

        } catch (error) {
            console.error('이메일 전송 오류:', error);
            throw new Error('이메일 전송 중 오류가 발생했습니다.');
        }
    }

    // 실제 SendGrid 사용 예시
    async sendWithSendGrid(emailData) {
        // SendGrid 설정 예시
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        
        const msg = {
            to: this.toEmail,
            from: this.fromEmail,
            subject: emailData.subject,
            text: emailData.body,
            html: emailData.body.replace(/\n/g, '<br>')
        };
        
        return await sgMail.send(msg);
    }

    // 실제 AWS SES 사용 예시
    async sendWithAWSSES(emailData) {
        const AWS = require('aws-sdk');
        const ses = new AWS.SES({
            region: process.env.AWS_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });
        
        const params = {
            Source: this.fromEmail,
            Destination: {
                ToAddresses: [this.toEmail]
            },
            Message: {
                Subject: {
                    Data: emailData.subject
                },
                Body: {
                    Text: {
                        Data: emailData.body
                    }
                }
            }
        };
        
        return await ses.sendEmail(params).promise();
    }

    // SMTP 전송 예시
    async sendWithSMTP(emailData) {
        const nodemailer = require('nodemailer');
        
        const transporter = nodemailer.createTransporter({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
        
        const mailOptions = {
            from: this.fromEmail,
            to: this.toEmail,
            subject: emailData.subject,
            text: emailData.body,
            html: emailData.body.replace(/\n/g, '<br>')
        };
        
        const result = await transporter.sendMail(mailOptions);
        
        return {
            success: true,
            message: '피드백이 성공적으로 전송되었습니다!',
            messageId: result.messageId
        };
    }
} 