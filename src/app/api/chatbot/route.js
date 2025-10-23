import { NextResponse } from 'next/server';

/**
 * 챗봇 API 라우트 - Google Gemini API 사용
 * ✨ 대화 히스토리 기능 추가 - 맥락있는 대화 지원
 *
 * .env.local에 GOOGLE_GEMINI_API_KEY 필요
 */

export async function POST(request) {
  try {
    // ✨ 히스토리 파라미터 추가
    const { message, history = [] } = await request.json();

    // API 키 확인
    const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      console.error('⚠️ GOOGLE_GEMINI_API_KEY가 .env.local에 없습니다!');
      return NextResponse.json({
        reply: getRuleBasedResponse(message, history),
      });
    }

    console.log('🔍 Gemini API 호출 시도...', {
      historyLength: history.length,
    });

    // ✨ 대화 히스토리를 Gemini API 형식으로 변환
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `당신은 MovieHub의 친절한 영화 추천 챗봇 "MovieBot"입니다.

역할:
- 사용자에게 영화를 추천하고 영화 관련 정보를 제공합니다
- MovieHub 사이트 사용법을 안내합니다
- 친근하고 따뜻한 톤으로 대화합니다
- ✨ 이전 대화 내용을 기억하고 맥락있게 답변합니다

답변 규칙:
1. 이모지를 적절히 사용하세요 (🎬, 🍿, ⭐, 💕, 🍂 등)
2. 5-7문장 정도로 자연스럽게 답변하세요
3. ✨ 영화 추천 시 구체적이고 설득력 있는 이유를 제공하세요
   - 영화의 분위기, 촬영 미학, 스토리 특징
   - 왜 특정 시즌/상황에 어울리는지
   - 감독의 연출 스타일이나 배우의 연기력
4. 한국어로 자연스럽게 답변하세요
5. 구체적인 영화 제목, 감독, 배우, 줄거리 정보를 활용하세요
6. ✨ 후속 질문("이유가 뭐야?", "왜?" 등)에는 이전 대화를 참고하여 답변하세요
7. 사용자의 감정과 취향을 고려하여 공감하며 답변하세요`,
          },
        ],
      },
      {
        role: 'model',
        parts: [
          {
            text: '네, 알겠습니다! MovieHub의 친절한 챗봇 MovieBot으로서 사용자의 대화 맥락을 기억하며 영화 추천과 상담을 진행하겠습니다. 🎬',
          },
        ],
      },
    ];

    // ✨ 이전 대화 히스토리 추가 (최근 10개만)
    const recentHistory = history.slice(-10);
    recentHistory.forEach((msg) => {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      });
    });

    // 현재 사용자 메시지 추가
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    // Gemini API 호출
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: contents, // ✨ 히스토리 포함!
          generationConfig: {
            temperature: 0.9, // 더 창의적인 답변
            maxOutputTokens: 500, // 더 길고 상세한 답변
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
      return NextResponse.json({
        reply: getRuleBasedResponse(message, history),
      });
    }

    const data = await response.json();

    // 안전 필터링으로 차단된 경우
    if (data.candidates && data.candidates[0]?.finishReason === 'SAFETY') {
      console.log('⚠️ 안전 필터링으로 차단됨');
      return NextResponse.json({
        reply: getRuleBasedResponse(message, history),
      });
    }

    // 응답 추출
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      getRuleBasedResponse(message, history);

    console.log('✅ Gemini API 응답 성공');

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('❌ Chatbot API Error:', error.message);

    // 에러 발생 시 규칙 기반 응답 사용
    try {
      const body = await request.json();
      return NextResponse.json({
        reply: getRuleBasedResponse(body.message, body.history || []),
      });
    } catch {
      return NextResponse.json({
        reply:
          '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요. 🙏',
      });
    }
  }
}

/**
 * ✨ 개선된 규칙 기반 응답 (API 없이 작동)
 * 대화 히스토리를 고려한 맥락있는 응답
 */
function getRuleBasedResponse(message, history = []) {
  const msg = message.toLowerCase();

  // ✨ 이전 대화 컨텍스트 분석
  const lastBotMessage =
    history.length > 0 ? history[history.length - 1]?.content || '' : '';

  // ✨ 후속 질문 처리 (이유, 왜, 설명 등)
  if (
    (msg.includes('이유') ||
      msg.includes('왜') ||
      msg.includes('어떻게') ||
      msg.includes('뭐야')) &&
    lastBotMessage
  ) {
    // 마지막 봇 응답에서 추천한 영화 추출
    if (lastBotMessage.includes('라라랜드')) {
      return `🎭 라라랜드를 추천한 이유는요!

가을은 감성적이고 로맨틱한 분위기가 물씬 풍기는 계절이잖아요? 🍂 라라랜드는 데미언 셔젤 감독이 만든 현대 뮤지컬 영화인데, LA의 가을 노을 같은 따뜻한 색감과 재즈 음악이 정말 환상적이에요! 🎵

특히 엠마 스톤과 라이언 고슬링의 케미가 너무 좋고, 꿈을 쫓는 두 사람의 로맨스가 가을의 감성과 딱 맞아떨어져요. OST도 정말 좋아서 영화 본 후에도 오래 여운이 남을 거예요! ⭐`;
    }

    if (lastBotMessage.includes('인터스텔라')) {
      return `🌌 인터스텔라를 추천한 이유는요!

가을 밤하늘의 별들을 보면 우주에 대한 상상이 펼쳐지잖아요? 크리스토퍼 놀란 감독의 인터스텔라는 우주 여행과 시간, 그리고 가족에 대한 사랑을 다룬 걸작이에요! 🚀

매튜 맥커너히의 연기도 감동적이고, 한스 짐머의 음악은 정말 압도적이에요. IMAX로 보면 더 좋지만, 집에서 큰 화면으로 봐도 충분히 감동받을 수 있어요!`;
    }

    if (lastBotMessage.includes('기생충')) {
      return `🎭 기생충을 추천한 이유는요!

봉준호 감독의 천재적인 연출력이 돋보이는 작품이에요! 아카데미 작품상, 감독상, 각본상, 국제영화상 4관왕을 차지한 한국 영화의 자랑이죠! 🏆

사회 계층 간의 격차를 긴장감 넘치는 스릴러로 풀어냈고, 반전에 반전을 거듭하는 스토리가 압권이에요. 송강호를 비롯한 배우들의 연기도 완벽해요!`;
    }

    // 일반 후속 질문
    return `제가 방금 말씀드린 내용에 대해 더 궁금하신가요? 🤔 어떤 부분이 더 알고 싶으신지 구체적으로 말씀해주시면, 더 자세히 설명해드릴게요!`;
  }

  // 인사
  if (
    msg.includes('안녕') ||
    msg.includes('하이') ||
    msg.includes('hello') ||
    msg.includes('hi')
  ) {
    return '안녕하세요! 👋 MovieHub 챗봇 MovieBot이에요! 영화 추천이나 궁금한 점을 편하게 물어보세요! 오늘은 어떤 영화가 보고 싶으세요? 🎬✨';
  }

  // ✨ 가을 관련 영화 추천
  if (msg.includes('가을')) {
    const autumnMovies = [
      {
        title: '라라랜드',
        emoji: '🎭',
        reason:
          '가을의 감성적인 분위기와 재즈 음악, 따뜻한 색감이 완벽하게 어울리는 로맨틱 뮤지컬이에요! 🍂 엠마 스톤과 라이언 고슬링의 케미가 환상적이고, OST는 들을수록 매력적이에요.',
      },
      {
        title: '인터스텔라',
        emoji: '🌌',
        reason:
          '가을 밤하늘의 별들을 보며 보기 좋은 우주 SF 대작이에요! 크리스토퍼 놀란 감독의 연출과 한스 짐머의 웅장한 음악이 깊은 감동을 선사해요. 가족에 대한 사랑 이야기도 따뜻해요! 🍂',
      },
      {
        title: '비포 선라이즈',
        emoji: '🍂',
        reason:
          '가을의 낭만이 물씬 풍기는 유럽을 배경으로 한 로맨스 영화예요! 에단 호크와 줄리 델피가 하룻밤 동안 나누는 대화가 가을 저녁 산책하며 듣기 딱 좋아요.',
      },
    ];

    const movie = autumnMovies[Math.floor(Math.random() * autumnMovies.length)];
    return `${movie.emoji} 가을에 딱 맞는 영화를 추천해드릴게요!

**${movie.title}** 어떠세요?

${movie.reason}

가을 감성 물씬 느끼며 감상해보세요! 🎬✨`;
  }

  // 영화 추천 (일반)
  if (
    msg.includes('추천') ||
    msg.includes('뭐 볼까') ||
    msg.includes('재밌는') ||
    msg.includes('좋은 영화')
  ) {
    const recommendations = [
      {
        title: '인터스텔라',
        emoji: '🌌',
        reason:
          '크리스토퍼 놀란의 SF 걸작! 우주여행과 시간, 가족의 사랑을 다룬 감동적인 영화예요. 한스 짐머의 웅장한 음악과 매튜 맥커너히의 연기가 압권이에요!',
      },
      {
        title: '기생충',
        emoji: '🎭',
        reason:
          '봉준호 감독의 아카데미 4관왕 작품! 사회 계층의 격차를 긴장감 넘치는 스릴러로 풀어낸 한국 영화의 자랑이에요. 반전에 반전을 거듭하는 스토리가 압권!',
      },
      {
        title: '쇼생크 탈출',
        emoji: '⭐',
        reason:
          '희망과 우정을 그린 불멸의 명작! 팀 로빈스와 모건 프리먼의 환상적인 연기와 감동적인 스토리가 시간이 지나도 색바래지 않아요.',
      },
      {
        title: '라라랜드',
        emoji: '🎵',
        reason:
          '꿈과 사랑을 노래하는 현대 뮤지컬! LA의 아름다운 풍경과 재즈 음악, 엠마 스톤과 라이언 고슬링의 케미가 환상적이에요. OST는 정말 중독성 있어요!',
      },
    ];

    const movie =
      recommendations[Math.floor(Math.random() * recommendations.length)];
    return `${movie.emoji} **${movie.title}** 강력 추천드려요!

${movie.reason}

꼭 한번 감상해보세요! 🍿✨`;
  }

  // 장르별 추천: 액션
  if (msg.includes('액션')) {
    return `💥 액션 영화 추천드려요!

**존 윅 시리즈** - 키아누 리브스의 화려한 건 액션과 스타일리시한 연출이 일품!
**매드 맥스: 분노의 도로** - 실제 스턴트 위주의 압도적인 액션 씬과 박진감!
**미션 임파서블 시리즈** - 톰 크루즈의 직접 수행하는 위험천만한 스턴트!

어떤 스타일의 액션을 선호하세요? 스타일리시한 액션? 아니면 스케일 큰 블록버스터? 🎬`;
  }

  // 장르별 추천: 로맨스
  if (msg.includes('로맨스') || msg.includes('사랑')) {
    return `❤️ 로맨스 영화 추천드려요!

**노트북** - 라이언 고슬링과 레이첼 맥아담스의 순애보! 비 오는 키스 씬은 전설이에요!
**비포 시리즈** - 하룻밤의 만남부터 시작되는 깊이 있는 사랑 이야기. 대화 중심의 섬세한 연출!
**러브 액츄얼리** - 여러 커플의 사랑 이야기가 얽힌 따뜻한 앙상블 영화!

따뜻한 감동을 느끼며 힐링해보세요! 💕`;
  }

  // 장르별 추천: 코미디
  if (msg.includes('코미디') || msg.includes('웃긴')) {
    return `😂 코미디 영화 추천드려요!

**극한직업** - 닭집 사장님 코스프레 하는 형사들! 한국 코미디의 정수!
**써니** - 80년대 감성과 웃음, 그리고 눈물까지! 친구들과 보면 더 재밌어요!
**엑시트** - 조정석, 임윤아의 빌딩 탈출 액션 코미디! 긴장감과 웃음을 동시에!

웃음이 필요할 때 강추예요! 스트레스 날려버리세요! 🎉`;
  }

  // 장르별 추천: 공포
  if (
    msg.includes('공포') ||
    msg.includes('무서운') ||
    msg.includes('스릴러')
  ) {
    return `😱 공포/스릴러 영화 추천드려요!

**곡성** - 나홍진 감독의 한국형 오컬트 스릴러! 긴장감과 반전이 압권!
**컨저링** - 제임스 완 감독의 실화 기반 공포 영화! 분위기 연출이 탁월해요!
**헤레디터리** - 심리적 공포가 강한 아트 호러! 충격적인 스토리와 연출!

⚠️ 밤에 보시면 잠 못 이루실 수 있으니 주의하세요! 용기있으신가요? 👻`;
  }

  // 사이트 안내
  if (
    msg.includes('사용법') ||
    msg.includes('어떻게') ||
    msg.includes('방법') ||
    msg.includes('이용')
  ) {
    return `📱 MovieHub 사용법을 알려드릴게요!

1️⃣ **메인 페이지**: 지금 인기있는 영화들을 한눈에 확인하세요
2️⃣ **영화 상세**: 클릭하면 줄거리, 출연진, 평점 등 상세 정보를 볼 수 있어요
3️⃣ **리뷰 작성**: 별점과 함께 감상평을 남겨 다른 사용자와 공유하세요!
4️⃣ **찜하기**: 로그인하면 마음에 드는 영화를 저장할 수 있어요! 💾

더 궁금한 점이 있으시면 언제든 물어보세요! 😊`;
  }

  // 회원가입/로그인
  if (
    msg.includes('회원가입') ||
    msg.includes('로그인') ||
    msg.includes('가입')
  ) {
    return `🔐 회원가입 방법을 안내해드릴게요!

상단 메뉴의 **'로그인'** 버튼을 클릭하시면 간편하게 가입하실 수 있어요! 회원가입을 하시면:
✅ 영화 찜하기
✅ 리뷰 작성하기
✅ 개인 맞춤 추천

이런 기능들을 이용하실 수 있어요! 지금 바로 가입해보세요! 🎉`;
  }

  // 리뷰
  if (msg.includes('리뷰')) {
    return `⭐ 리뷰 작성 방법을 알려드릴게요!

영화 상세 페이지로 들어가시면 리뷰 섹션이 있어요. 거기서:
1️⃣ 별점을 선택하고 (⭐⭐⭐⭐⭐)
2️⃣ 솔직한 감상평을 작성해주세요!
3️⃣ 등록 버튼만 누르면 끝!

다른 사용자들과 영화에 대한 생각을 공유하고 소통해보세요! 여러분의 소중한 리뷰가 다른 분들의 영화 선택에 큰 도움이 돼요! 💬✨`;
  }

  // 기본 응답 (더 친근하고 자연스럽게)
  const defaultResponses = [
    '영화에 대해 궁금한 점이 있으시면 편하게 물어보세요! 어떤 장르를 좋아하세요? 🎬',
    '오늘은 어떤 기분이신가요? 기분에 맞는 영화를 추천해드릴게요! 😊🍿',
    '최근에 본 영화 중에 재밌었던 게 있나요? 비슷한 영화를 추천해드릴게요! ⭐',
    '액션, 로맨스, 코미디, 공포... 어떤 장르가 땡기시나요? 딱 맞는 영화를 찾아드릴게요! 🎭',
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}
