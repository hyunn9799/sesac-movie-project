// styles.js - 영화 사이트 스타일 가이드 (CDN용)
// 나중에 Vite/Webpack 사용 시: 모든 const 앞에 export 붙이면 됨!

// ========== 색상 ==========
// styles.js - 영화 사이트 스타일 가이드 (모듈 버전)

// ========== 색상 ==========
export const colors = {
  primary: '#E50914',
  secondary: '#B20710',
  dark: '#141414',
  darkGray: '#2F2F2F',
  mediumGray: '#808080',
  lightGray: '#E5E5E5',
  white: '#FFFFFF',
  yellow: '#F5C518',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  textPrimary: '#FFFFFF',
  textSecondary: '#808080',
  textLight: '#999999',
};

// ========== 간격 ==========
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

// ========== 폰트 크기 ==========
export const fontSize = {
  small: '12px',
  medium: '14px',
  large: '16px',
  xlarge: '20px',
  xxlarge: '24px',
  title: '32px',
  hero: '48px',
};

// ========== 폰트 굵기 ==========
export const fontWeight = {
  light: 300,
  normal: 400,
  medium: 500,
  bold: 700,
};

// ========== 그림자 ==========
export const shadow = {
  small: '0 2px 4px rgba(0,0,0,0.1)',
  medium: '0 4px 8px rgba(0,0,0,0.15)',
  large: '0 8px 16px rgba(0,0,0,0.2)',
  header: '0 2px 8px rgba(0,0,0,0.3)',
};

// ========== 테두리 반경 ==========
export const borderRadius = {
  small: '4px',
  medium: '8px',
  large: '12px',
  round: '20px',
  circle: '50%',
};

// ========== 전환 효과 ==========
export const transition = {
  fast: 'all 0.2s ease',
  normal: 'all 0.3s ease',
  slow: 'all 0.5s ease',
};

// ========== 공통 스타일 ==========
export const commonStyles = {
  header: {
    backgroundColor: colors.dark,
    color: colors.white,
    padding: `${spacing.md} ${spacing.xl}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: shadow.header,
  },
  logo: {
    margin: 0,
    fontSize: fontSize.xxlarge,
    color: colors.primary,
  },
  searchInput: {
    padding: spacing.sm,
    borderRadius: borderRadius.small,
    border: 'none',
    width: '300px',
    fontSize: fontSize.medium,
  },
  button: {
    padding: `${spacing.sm} ${spacing.lg}`,
    fontSize: fontSize.medium,
    fontWeight: fontWeight.medium,
    border: 'none',
    borderRadius: borderRadius.small,
    cursor: 'pointer',
    transition: transition.normal,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    color: colors.white,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    color: colors.white,
    border: `1px solid ${colors.white}`,
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: borderRadius.small,
  },
  filterButton: {
    backgroundColor: colors.dark,
    color: colors.white,
    border: `1px solid ${colors.mediumGray}`,
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: borderRadius.round,
    cursor: 'pointer',
    transition: transition.normal,
  },
  filterSection: {
    backgroundColor: colors.darkGray,
    padding: spacing.xl,
    color: colors.white,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: spacing.xl,
  },
  movieCard: {
    backgroundColor: colors.darkGray,
    borderRadius: borderRadius.medium,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: transition.normal,
  },
  moviePoster: {
    width: '100%',
    height: '250px',
    backgroundColor: colors.dark,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '80px',
  },
  movieInfo: { padding: spacing.md },
  movieTitle: {
    margin: `0 0 ${spacing.sm} 0`,
    color: colors.white,
    fontSize: fontSize.large,
  },
  movieRating: { color: colors.yellow, fontWeight: fontWeight.bold },
  sectionTitle: {
    color: colors.white,
    marginBottom: spacing.lg,
    fontSize: fontSize.xxlarge,
  },
  footer: {
    backgroundColor: colors.dark,
    color: colors.mediumGray,
    padding: spacing.xl,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  card: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.medium,
    boxShadow: shadow.small,
  },
  input: {
    padding: spacing.md,
    fontSize: fontSize.medium,
    border: `1px solid ${colors.lightGray}`,
    borderRadius: borderRadius.small,
    width: '100%',
  },
  heading: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    margin: `${spacing.lg} 0`,
  },
};

// ========== 레이아웃 ==========
export const layout = {
  movieGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: spacing.lg,
  },
  flexRow: {
    display: 'flex',
    gap: spacing.md,
    alignItems: 'center',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
  },
  spaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};

// ========== 사용 예시 (주석) ==========
/*

## CDN 환경에서 사용 방법

### HTML에서 불러오기
<script src="styles.js"></script>
<script type="text/babel">
  // 바로 사용 가능!
  console.log(colors.primary);
</script>

### 컴포넌트에서 사용
function Header() {   
  return (
    <div style={commonStyles.header}>
      <h1 style={commonStyles.logo}>🎬 MovieHub</h1>
      <input 
        type="text" 
        placeholder="검색..."
        style={commonStyles.searchInput}
      />
      <button style={{
        ...commonStyles.button,
        ...commonStyles.buttonPrimary
      }}>
        로그인
      </button>
    </div>
  );
}

### 나중에 Vite/Webpack 사용 시 변경 방법:
1. 모든 const 앞에 export 추가
   const colors = {...}  →  export const colors = {...}

2. HTML에서 import 사용
   import { colors, spacing, commonStyles } from './styles.js';

*/

// ========== 사용 예시 (주석) ==========
/*

// import는 export된 값을 가져올 때 쓰며,
같은 폴더 안에 있는 파일을 불러올 땐 './파일명.js' 형태로 경로를 쓴다.

import { colors, spacing, commonStyles } from './styles.js';  ('./styles.js' : 같은 위치에 있다.)

// 1. 직접 사용
<div style={{ backgroundColor: colors.primary, padding: spacing.md }}>

// 2. 공통 스타일 사용
<button style={commonStyles.buttonPrimary}>클릭</button>

// 3. 스타일 합치기 (...spread 연산자)
<button style={{ ...commonStyles.button, ...commonStyles.buttonPrimary }}>
  클릭
</button>

// 4. 추가 스타일과 합치기
<div style={{ ...commonStyles.card, marginTop: spacing.lg }}>
  내용
</div>
*/

/* 간단한 예시 */

/* 

import { colors, spacing } from './styles.js'; // 다른파일에서 가져온다.

function Header() {   
  return (
    <div style={{

      backgroundColor: colors.black,  ※                                  ※
      color: colors.white,                요소에 이렇게 넣어주시면 됩니다.
      padding: spacing.large          ※                                  ※

    }}>
      <h1>오늘의 할일!</h1>
    </div>
  );
}

*/
