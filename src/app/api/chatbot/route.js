import { NextResponse } from 'next/server';

/**
 * 챗봇 API 라우트 - Google Gemini API 사용
 * 최신 Gemini 2.5 모델 사용
 *
 * .env.local에 GOOGLE_GEMINI_API_KEY 필요
 */

export async function POST(request) {
  try {
    const { message } = await request.json();

    // API 키 확인
    const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      console.error('⚠️ GOOGLE_GEMINI_API_KEY가 .env.local에 없습니다!');
      return NextResponse.json({ reply: getRuleBasedResponse(message) });
    }

    console.log('🔍 Gemini API 호출 시도...');

    // 최신 Gemini 2.5 Flash 모델 사용
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `당신은 MovieHub의 친절한 영화 추천 챗봇 "MovieBot"입니다.

역할:
- 사용자에게 영화를 추천하고 영화 관련 정보를 제공합니다
- MovieHub 사이트 사용법을 안내합니다
- 친근하고 따뜻한 톤으로 대화합니다

답변 규칙:
1. 이모지를 적절히 사용하세요 (🎬, 🍿, ⭐, 💕 등)
2. 3-4문장 이내로 간결하게 답변하세요
3. 영화 추천 시 간단한 이유를 함께 제공하세요
4. 한국어로 자연스럽게 답변하세요
5. 구체적인 영화 제목, 감독, 배우 정보를 활용하세요

사용자 질문: ${message}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 300,
            topP: 0.95,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
          ],
        }),
      }
    );

    // 응답 상태 확인
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini API Error:', response.status, errorText);

      // API 오류 시 규칙 기반 응답 사용
      console.log('🔄 규칙 기반 응답으로 전환');
      return NextResponse.json({ reply: getRuleBasedResponse(message) });
    }

    const data = await response.json();

    // 안전 필터링으로 차단된 경우
    if (data.candidates && data.candidates[0].finishReason === 'SAFETY') {
      console.log('⚠️ 안전 필터링으로 차단됨');
      return NextResponse.json({ reply: getRuleBasedResponse(message) });
    }

    // 응답 추출
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      getRuleBasedResponse(message);

    console.log('✅ Gemini API 응답 성공');

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('❌ Chatbot API Error:', error.message);

    // 에러 발생 시 규칙 기반 응답 사용
    try {
      const { message } = await request.json();
      return NextResponse.json({ reply: getRuleBasedResponse(message) });
    } catch {
      return NextResponse.json({
        reply: '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.',
      });
    }
  }
}

/**
 * 규칙 기반 응답 (API 없이 작동)
 * API 키가 없거나 오류 시 대체 응답
 */
function getRuleBasedResponse(message) {
  const msg = message.toLowerCase();

  // 인사
  if (msg.includes('안녕') || msg.includes('하이') || msg.includes('hello')) {
    return '안녕하세요! 👋 MovieHub 챗봇입니다. 영화 추천이나 궁금한 점을 물어보세요!';
  }

  // 영화 추천
  if (
    msg.includes('추천') ||
    msg.includes('뭐 볼까') ||
    msg.includes('재밌는') ||
    msg.includes('좋은 영화')
  ) {
    const recommendations = [
      '🎬 인터스텔라 - 우주를 배경으로 한 감동적인 SF 영화예요!',
      '🎭 기생충 - 봉준호 감독의 아카데미 수상작! 한국 영화의 자랑이에요!',
      '💥 다크 나이트 - 최고의 히어로 영화 중 하나예요!',
      '❤️ 라라랜드 - 뮤지컬과 로맨스가 결합된 아름다운 영화예요!',
      '🌊 어바웃 타임 - 따뜻하고 감동적인 로맨스 영화예요!',
    ];
    return recommendations[Math.floor(Math.random() * recommendations.length)];
  }

  // 장르별 추천: 액션
  if (msg.includes('액션')) {
    return '💥 액션 영화 추천드려요!\n- 존 윅 시리즈\n- 매드 맥스: 분노의 도로\n- 미션 임파서블 시리즈\n어떤 스타일의 액션을 좋아하세요?';
  }

  // 장르별 추천: 로맨스
  if (msg.includes('로맨스') || msg.includes('사랑')) {
    return '❤️ 로맨스 영화 추천드려요!\n- 노트북\n- 비포 시리즈\n- 러브 액츄얼리\n따뜻한 감동을 느낄 수 있어요!';
  }

  // 장르별 추천: 코미디
  if (msg.includes('코미디') || msg.includes('웃긴')) {
    return '😂 코미디 영화 추천드려요!\n- 극한직업\n- 써니\n- 엑시트\n웃음이 필요할 때 최고예요!';
  }

  // 장르별 추천: 공포
  if (msg.includes('공포') || msg.includes('무서운')) {
    return '😱 공포 영화 추천드려요!\n- 곡성\n- 컨저링\n- 쿰바야\n밤에 보시면 잠 못 이루실 수도 있어요!';
  }

  // 사이트 안내
  if (
    msg.includes('사용법') ||
    msg.includes('어떻게') ||
    msg.includes('방법')
  ) {
    return '📱 MovieHub 사용법:\n1. 메인 페이지에서 인기 영화 확인\n2. 영화 클릭하면 상세 정보 보기\n3. 리뷰 작성하고 다른 사람들과 공유\n4. 로그인하면 찜하기 기능 이용 가능!';
  }

  // 회원가입/로그인
  if (msg.includes('회원가입') || msg.includes('로그인')) {
    return "🔐 회원가입은 상단 메뉴의 '로그인' 버튼을 눌러주세요! 간편하게 가입하실 수 있어요.";
  }

  // 리뷰
  if (msg.includes('리뷰')) {
    return '⭐ 리뷰는 영화 상세 페이지에서 작성할 수 있어요! 별점과 함께 솔직한 감상을 공유해주세요!';
  }

  // 기본 응답
  const defaultResponses = [
    '영화에 대해 궁금한 점이 있으시면 편하게 물어보세요! 🎬',
    '어떤 장르의 영화를 좋아하세요? 추천해드릴게요! 🍿',
    '영화 추천이나 사이트 사용법이 궁금하시면 말씀해주세요! 😊',
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}
