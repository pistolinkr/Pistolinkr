import { NextResponse } from 'next/server';
import { EmailService } from './email-service.js';

export async function POST(request) {
    try {
        const { name, email, type, subject, message } = await request.json();

        // 유효성 검사
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: '모든 필수 필드를 입력해주세요.' },
                { status: 400 }
            );
        }

        // 이메일 형식 검사
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: '유효한 이메일 주소를 입력해주세요.' },
                { status: 400 }
            );
        }

        // 이메일 서비스 인스턴스 생성
        const emailService = new EmailService();
        
        // 피드백 데이터 구성
        const feedbackData = {
            name,
            email,
            type,
            subject,
            message
        };

        // 이메일 전송
        const result = await emailService.sendFeedbackEmail(feedbackData);
        
        return NextResponse.json({
            success: true,
            message: result.message || '피드백이 성공적으로 전송되었습니다!'
        });

    } catch (error) {
        console.error('피드백 전송 오류:', error);
        return NextResponse.json(
            { error: error.message || '피드백 전송 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 