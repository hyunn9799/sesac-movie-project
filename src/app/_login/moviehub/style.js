// // styles.js - 영화 사이트 스타일 가이드 (CDN용)
// // 나중에 Vite/Webpack 사용 시: 모든 const 앞에 export 붙이면 됨!

// // ========== 색상 ==========
// const colors = {
//   // 메인 컬러
//   primary: '#E50914', // Netflix 레드
//   secondary: '#B20710', // 어두운 레드

//   // 배경색
//   dark: '#141414', // 다크 배경
//   darkGray: '#2F2F2F', // 어두운 회색
//   mediumGray: '#808080', // 중간 회색
//   lightGray: '#E5E5E5', // 밝은 회색
//   white: '#FFFFFF',

//   // 강조 색상
//   yellow: '#F5C518', // 별점 색상 (IMDB 스타일)

//   // 상태 색상
//   success: '#4CAF50', // 초록 (성공)
//   warning: '#FF9800', // 주황 (경고)
//   error: '#F44336', // 빨강 (에러)
//   info: '#2196F3', // 하늘색 (정보)

//   // 텍스트
//   textPrimary: '#FFFFFF',
//   textSecondary: '#808080',
//   textLight: '#999999',
// };

// // ========== 간격 (padding, margin) ==========
// const spacing = {
//   xs: '4px',
//   sm: '8px',
//   md: '16px',
//   lg: '24px',
//   xl: '32px',
//   xxl: '48px',
// };

// // ========== 폰트 크기 ==========
// const fontSize = {
//   small: '12px',
//   medium: '14px',
//   large: '16px',
//   xlarge: '20px',
//   xxlarge: '24px',
//   title: '32px',
//   hero: '48px',
// };

// // ========== 폰트 굵기 ==========
// const fontWeight = {
//   light: 300,
//   normal: 400,
//   medium: 500,
//   bold: 700,
// };

// // ========== 그림자 ==========
// const shadow = {
//   small: '0 2px 4px rgba(0,0,0,0.1)',
//   medium: '0 4px 8px rgba(0,0,0,0.15)',
//   large: '0 8px 16px rgba(0,0,0,0.2)',
//   header: '0 2px 8px rgba(0,0,0,0.3)',
// };

// // ========== 테두리 반경 ==========
// const borderRadius = {
//   small: '4px',
//   medium: '8px',
//   large: '12px',
//   round: '20px',
//   circle: '50%',
// };

// // ========== 전환 효과 ==========
// const transition = {
//   fast: 'all 0.2s ease',
//   normal: 'all 0.3s ease',
//   slow: 'all 0.5s ease',
// };

// // ========== 공통 스타일 컴포넌트 ==========
// const commonStyles = {
//   // Header 스타일
//   header: {
//     backgroundColor: colors.dark,
//     color: colors.white,
//     padding: `${spacing.md} ${spacing.xl}`,
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     boxShadow: shadow.header,
//   },

//   // 로고
//   logo: {
//     margin: 0,
// ... (263줄 남음)
// 접기
// styles.js
// 9KB
// <!DOCTYPE html>
// <html lang="ko">
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>MovieHub - 영화 추천 & 리뷰</title>
//     <link rel="stylesheet" href="styles.css" />
//     <script
//       src="https://unpkg.com/react@18/umd/react.development.js"
//       crossorigin
//     ></script>
//     <script
//       src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"
//       crossorigin
//     ></script>
//     <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

//     <!-- 스타일 토큰 불러오기 -->
//     <script src="styles.js"></script>
//   </head>
//   <body style="margin: 0; padding: 0; background-color: #141414">
//     <div id="root"></div>
//     <script type="text/babel">
//       const { useState } = React;

//       // ========== 더미 데이터 ==========
//       const genres = [
//         '액션',
//         '코미디',
//         '드라마',
//         '스릴러',
//         '로맨스',
//         'SF',
//         '공포',
//         '애니메이션',
//       ];
//       const moods = [
//         '슬플 때',
//         '기분 전환',
//         '로맨틱',
//         '스릴 넘치게',
//         '웃고 싶을 때',
//       ];
//       const situations = [
//         '데이트',
//         '혼자보기',
//         '가족과 함께',
//         '친구들과',
//         '비 오는 날',
//       ];

//       const topMovies = [
//         { id: 1, title: '오펜하이머', rating: 4.5, poster: '🎬', year: 2023 },
//         { id: 2, title: '듄: 파트2', rating: 4.8, poster: '🎬', year: 2024 },
//         { id: 3, title: '기생충', rating: 4.7, poster: '🎬', year: 2019 },
//         { id: 4, title: '인터스텔라', rating: 4.9, poster: '🎬', year: 2014 },
//         { id: 5, title: '범죄도시4', rating: 4.2, poster: '🎬', year: 2024 },
//       ];

//       const latestMovies = [
//         {
//           id: 6,
//           title: '데드풀과 울버린',
//           rating: 4.3,
//           poster: '🎬',
//           year: 2024,
//         },
//         { id: 7, title: '베놈3', rating: 3.8, poster: '🎬', year: 2024 },
//         { id: 8, title: '위키드', rating: 4.6, poster: '🎬', year: 2024 },
//       ];

//       // ========== 컴포넌트 (styles.js 토큰 사용) ==========

//       function Header({ isLoggedIn, onLoginClick }) {
//         return (
//           <div style={commonStyles.header}>
//             <h1 style={commonStyles.logo}>🎬 MovieHub</h1>
//             <div style={layout.flexRow}>
//               <input
//                 type="text"
//                 placeholder="영화, 감독, 배우 검색..."
//                 style={commonStyles.searchInput}
//               />
//               {isLoggedIn ? (
//                 <>
//                   <button style={commonStyles.buttonOutline}>마이페이지</button>
//                   <button
//                     style={{
//                       ...commonStyles.button,
//                       ...commonStyles.buttonPrimary,
//                     }}
//                     onClick={onLoginClick}
//                   >
//                     로그아웃
//                   </button>
//                 </>
//               ) : (
//                 <button
//                   style={{
//                     ...commonStyles.button,
// ... (199줄 남음)
// 접기
// test.html
// 10KB
// 승 — 오후 12:18
// 'use client';

// import { usePathname } from 'next/navigation';
// import Header from '@/component/Header';
// import Footer from '@/component/Footer';

// export default function RootLayout({ children }) {
//   const pathname = usePathname();

//   // 어드민 페이지인지 확인
//   const isAdminPage = pathname?.startsWith('/admin');

//   return (
//     <html lang="ko">
//       <body>
//         {!isAdminPage && <Header />}
//         {children}
//         {!isAdminPage && <Footer />}
//       </body>
//     </html>
//   );
// }
// pㄷpㄷ
// // styles.js - 영화 사이트 스타일 가이드 (CDN용)
// // 나중에 Vite/Webpack 사용 시: 모든 const 앞에 export 붙이면 됨!

// // ========== 색상 ==========
// const colors = {
//   // 메인 컬러
//   primary: '#E50914', // Netflix 레드
//   secondary: '#B20710', // 어두운 레드

//   // 배경색
//   dark: '#141414', // 다크 배경
//   darkGray: '#2F2F2F', // 어두운 회색
//   mediumGray: '#808080', // 중간 회색
//   lightGray: '#E5E5E5', // 밝은 회색
//   white: '#FFFFFF',

//   // 강조 색상
//   yellow: '#F5C518', // 별점 색상 (IMDB 스타일)

//   // 상태 색상
//   success: '#4CAF50', // 초록 (성공)
//   warning: '#FF9800', // 주황 (경고)
//   error: '#F44336', // 빨강 (에러)
//   info: '#2196F3', // 하늘색 (정보)

//   // 텍스트
//   textPrimary: '#FFFFFF',
//   textSecondary: '#808080',
//   textLight: '#999999',
// };

// // ========== 간격 (padding, margin) ==========
// const spacing = {
//   xs: '4px',
//   sm: '8px',
//   md: '16px',
//   lg: '24px',
//   xl: '32px',
//   xxl: '48px',
// };

// // ========== 폰트 크기 ==========
// const fontSize = {
//   small: '12px',
//   medium: '14px',
//   large: '16px',
//   xlarge: '20px',
//   xxlarge: '24px',
//   title: '32px',
//   hero: '48px',
// };

// // ========== 폰트 굵기 ==========
// const fontWeight = {
//   light: 300,
//   normal: 400,
//   medium: 500,
//   bold: 700,
// };

// // ========== 그림자 ==========
// const shadow = {
//   small: '0 2px 4px rgba(0,0,0,0.1)',
//   medium: '0 4px 8px rgba(0,0,0,0.15)',
//   large: '0 8px 16px rgba(0,0,0,0.2)',
//   header: '0 2px 8px rgba(0,0,0,0.3)',
// };

// // ========== 테두리 반경 ==========
// const borderRadius = {
//   small: '4px',
//   medium: '8px',
//   large: '12px',
//   round: '20px',
//   circle: '50%',
// };

// // ========== 전환 효과 ==========
// const transition = {
//   fast: 'all 0.2s ease',
//   normal: 'all 0.3s ease',
//   slow: 'all 0.5s ease',
// };

// // ========== 공통 스타일 컴포넌트 ==========
// const commonStyles = {
//   // Header 스타일
//   header: {
//     backgroundColor: colors.dark,
//     color: colors.white,
//     padding: `${spacing.md} ${spacing.xl}`,
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     boxShadow: shadow.header,
//   },

//   // 로고
//   logo: {
//     margin: 0,
//     fontSize: fontSize.xxlarge,
//     color: colors.primary,
//   },

//   // 검색 입력창
//   searchInput: {
//     padding: spacing.sm,
//     borderRadius: borderRadius.small,
//     border: 'none',
//     width: '300px',
//     fontSize: fontSize.medium,
//   },

//   // 버튼 기본
//   button: {
//     padding: `${spacing.sm} ${spacing.lg}`,
//     fontSize: fontSize.medium,
//     fontWeight: fontWeight.medium,
//     border: 'none',
//     borderRadius: borderRadius.small,
//     cursor: 'pointer',
//     transition: transition.normal,
//   },

//   // 주요 버튼 (로그인 등)
//   buttonPrimary: {
//     backgroundColor: colors.primary,
//     color: colors.white,
//   },

//   // 투명 버튼 (마이페이지 등)
//   buttonOutline: {
//     backgroundColor: 'transparent',
//     color: colors.white,
//     border: `1px solid ${colors.white}`,
//     padding: `${spacing.sm} ${spacing.md}`,
//     borderRadius: borderRadius.small,
//   },

//   // 필터 버튼
//   filterButton: {
//     backgroundColor: colors.dark,
//     color: colors.white,
//     border: `1px solid ${colors.mediumGray}`,
//     padding: `${spacing.sm} ${spacing.md}`,
//     borderRadius: borderRadius.round,
//     cursor: 'pointer',
//     transition: transition.normal,
//   },

//   // 필터 섹션
//   filterSection: {
//     backgroundColor: colors.darkGray,
//     padding: spacing.xl,
//     color: colors.white,
//   },

//   // 컨테이너
//   container: {
//     maxWidth: '1200px',
//     margin: '0 auto',
//     padding: spacing.xl,
//   },

//   // 영화 카드
//   movieCard: {
//     backgroundColor: colors.darkGray,
//     borderRadius: borderRadius.medium,
//     overflow: 'hidden',
//     cursor: 'pointer',
//     transition: transition.normal,
//   },

//   // 영화 포스터
//   moviePoster: {
//     width: '100%',
//     height: '250px',
//     backgroundColor: colors.dark,
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     fontSize: '80px',
//   },

//   // 영화 정보
//   movieInfo: {
//     padding: spacing.md,
//   },

//   // 영화 제목
//   movieTitle: {
//     margin: `0 0 ${spacing.sm} 0`,
//     color: colors.white,
//     fontSize: fontSize.large,
//   },

//   // 영화 평점
//   movieRating: {
//     color: colors.yellow,
//     fontWeight: fontWeight.bold,
//   },

//   // 섹션 제목
//   sectionTitle: {
//     color: colors.white,
//     marginBottom: spacing.lg,
//     fontSize: fontSize.xxlarge,
//   },

//   // Footer
//   footer: {
//     backgroundColor: colors.dark,
//     color: colors.mediumGray,
//     padding: spacing.xl,
//     textAlign: 'center',
//     marginTop: spacing.xxl,
//   },

//   // 카드 (일반용)
//   card: {
//     backgroundColor: colors.white,
//     padding: spacing.lg,
//     borderRadius: borderRadius.medium,
//     boxShadow: shadow.small,
//   },

//   // input (일반용)
//   input: {
//     padding: spacing.md,
//     fontSize: fontSize.medium,
//     border: `1px solid ${colors.lightGray}`,
//     borderRadius: borderRadius.small,
//     width: '100%',
//   },

//   // 제목
//   heading: {
//     fontSize: fontSize.title,
//     fontWeight: fontWeight.bold,
//     color: colors.textPrimary,
//     margin: `${spacing.lg} 0`,
//   },
// };

// // ========== 레이아웃 스타일 ==========
// const layout = {
//   // Grid 레이아웃 (영화 카드)
//   movieGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
//     gap: spacing.lg,
//   },

//   // Flex 레이아웃 (가로 정렬)
//   flexRow: {
//     display: 'flex',
//     gap: spacing.md,
//     alignItems: 'center',
//   },

//   // Flex 레이아웃 (세로 정렬)
//   flexColumn: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: spacing.md,
//   },

//   // Space Between
//   spaceBetween: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
// };

// // ========== 사용 예시 (주석) ==========
// /*

// ## CDN 환경에서 사용 방법

// ### HTML에서 불러오기
// <script src="styles.js"></script>
// <script type="text/babel">
//   // 바로 사용 가능!
//   console.log(colors.primary);
// </script>

// ### 컴포넌트에서 사용
// function Header() {   
//   return (
//     <div style={commonStyles.header}>
//       <h1 style={commonStyles.logo}>🎬 MovieHub</h1>
//       <input 
//         type="text" 
//         placeholder="검색..."
//         style={commonStyles.searchInput}
//       />
//       <button style={{
//         ...commonStyles.button,
//         ...commonStyles.buttonPrimary
//       }}>
//         로그인
//       </button>
//     </div>
//   );
// }

// ### 나중에 Vite/Webpack 사용 시 변경 방법:
// 1. 모든 const 앞에 export 추가
//    const colors = {...}  →  export const colors = {...}

// 2. HTML에서 import 사용
//    import { colors, spacing, commonStyles } from './styles.js';

// */

// // ========== 사용 예시 (주석) ==========
// /*

// // import는 export된 값을 가져올 때 쓰며,
// 같은 폴더 안에 있는 파일을 불러올 땐 './파일명.js' 형태로 경로를 쓴다.

// import { colors, spacing, commonStyles } from './styles.js';  ('./styles.js' : 같은 위치에 있다.)

// // 1. 직접 사용
// <div style={{ backgroundColor: colors.primary, padding: spacing.md }}>

// // 2. 공통 스타일 사용
// <button style={commonStyles.buttonPrimary}>클릭</button>

// // 3. 스타일 합치기 (...spread 연산자)
// <button style={{ ...commonStyles.button, ...commonStyles.buttonPrimary }}>
//   클릭
// </button>

// // 4. 추가 스타일과 합치기
// <div style={{ ...commonStyles.card, marginTop: spacing.lg }}>
//   내용
// </div>
// */

// /* 간단한 예시 */

// /* 

// import { colors, spacing } from './styles.js'; // 다른파일에서 가져온다.

// function Header() {   
//   return (
//     <div style={{

//       backgroundColor: colors.black,  ※                                  ※
//       color: colors.white,                요소에 이렇게 넣어주시면 됩니다.
//       padding: spacing.large          ※                                  ※

//     }}>
//       <h1>오늘의 할일!</h1>
//     </div>
//   );
// }

// */
// styles.js
// 9KB