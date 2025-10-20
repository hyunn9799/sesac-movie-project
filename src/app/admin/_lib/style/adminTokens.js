// lib/styles/adminTokens.js
// 관리자 페이지 전용 디자인 시스템

export const adminColors = {
  // Primary Colors
  primary: "#E50914", // MovieHub Red
  primaryHover: "#B70710",

  // Background Colors
  bgPrimary: "#F5F7FA", // 메인 배경
  bgSecondary: "#FFFFFF", // 카드 배경
  bgDark: "#1E293B", // 사이드바
  bgHover: "#F8FAFC", // 호버 배경

  // Text Colors
  textPrimary: "#1A202C", // 제목
  textSecondary: "#334155", // 본문
  textTertiary: "#64748B", // 부가 정보
  textLight: "#94A3B8", // 연한 텍스트
  textWhite: "#FFFFFF",
  textWhiteAlpha: "rgba(255, 255, 255, 0.7)",

  // Border Colors
  border: "#E2E8F0",
  borderLight: "#F1F5F9",
  borderDark: "rgba(255, 255, 255, 0.1)",

  // Status Colors
  success: "#10B981",
  successBg: "#D1FAE5",
  successHover: "#059669",

  warning: "#D97706",
  warningBg: "#FEF3C7",

  error: "#EF4444",
  errorBg: "#FEE2E2",
  errorHover: "#DC2626",

  info: "#3B82F6",
  infoBg: "#DBEAFE",
  infoHover: "#2563EB",

  // Stat Card Colors
  statRed: "#DC2626",
  statRedBg: "#FEE2E2",
  statBlue: "#2563EB",
  statBlueBg: "#DBEAFE",
  statYellow: "#D97706",
  statYellowBg: "#FEF3C7",
  statGreen: "#059669",
  statGreenBg: "#D1FAE5",
  statPurple: "#7C3AED",
  statPurpleBg: "#EDE9FE",
  statOrange: "#EA580C",
  statOrangeBg: "#FED7AA",
};

export const adminSizes = {
  // Sidebar
  sidebarWidth: "260px",
  sidebarPadding: "24px 0",

  // Header
  headerHeight: "70px",
  headerPadding: "0 32px",

  // Spacing
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    xxl: "32px",
  },

  // Border Radius
  radius: {
    sm: "6px",
    md: "8px",
    lg: "12px",
    full: "50%",
  },

  // Content Padding
  contentPadding: "32px",
};

export const adminTypography = {
  // Font Family
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

  // Font Sizes
  fontSize: {
    xs: "11px",
    sm: "13px",
    md: "14px",
    lg: "16px",
    xl: "18px",
    xxl: "20px",
    xxxl: "24px",
    display: "32px",
  },

  // Font Weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },

  // Letter Spacing
  letterSpacing: {
    tight: "-0.5px",
    normal: "0",
    wide: "0.5px",
  },
};

export const adminShadows = {
  sm: "0 2px 8px rgba(0, 0, 0, 0.05)",
  md: "0 4px 12px rgba(0, 0, 0, 0.08)",
  lg: "0 8px 20px rgba(0, 0, 0, 0.1)",

  // Button Shadows
  buttonPrimary: "0 4px 12px rgba(16, 185, 129, 0.3)",
  buttonInfo: "0 2px 8px rgba(59, 130, 246, 0.3)",
  buttonError: "0 2px 8px rgba(239, 68, 68, 0.3)",
};

export const adminTransitions = {
  fast: "all 0.15s ease",
  normal: "all 0.2s ease",
  slow: "all 0.3s ease",
};

export const adminZIndex = {
  sidebar: 100,
  header: 90,
  dropdown: 80,
  modal: 1000,
  tooltip: 1100,
};

// ===== 컴포넌트별 스타일 객체 =====

export const adminStyles = {
  // Sidebar Styles
  sidebar: {
    container: {
      position: "fixed",
      left: 0,
      top: 0,
      width: adminSizes.sidebarWidth,
      height: "100vh",
      background: adminColors.bgDark,
      padding: adminSizes.sidebarPadding,
      zIndex: adminZIndex.sidebar,
      overflowY: "auto",
    },

    logo: {
      display: "flex",
      alignItems: "center",
      gap: adminSizes.spacing.md,
      color: adminColors.textWhite,
      fontSize: adminTypography.fontSize.xxl,
      fontWeight: adminTypography.fontWeight.bold,
    },

    logoBadge: {
      background: adminColors.primary,
      color: adminColors.textWhite,
      fontSize: adminTypography.fontSize.xs,
      padding: "3px 8px",
      borderRadius: adminSizes.radius.sm,
      fontWeight: adminTypography.fontWeight.semibold,
    },

    navLink: {
      display: "flex",
      alignItems: "center",
      gap: adminSizes.spacing.md,
      padding: "12px 16px",
      color: adminColors.textWhiteAlpha,
      textDecoration: "none",
      borderRadius: adminSizes.radius.md,
      fontSize: adminTypography.fontSize.md,
      fontWeight: adminTypography.fontWeight.medium,
      transition: adminTransitions.normal,
    },

    navLinkActive: {
      background: adminColors.primary,
      color: adminColors.textWhite,
    },
  },

  // Header Styles
  header: {
    container: {
      position: "sticky",
      top: 0,
      height: adminSizes.headerHeight,
      background: adminColors.bgSecondary,
      borderBottom: `1px solid ${adminColors.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: adminSizes.headerPadding,
      zIndex: adminZIndex.header,
    },

    title: {
      fontSize: adminTypography.fontSize.xxxl,
      fontWeight: adminTypography.fontWeight.bold,
      color: adminColors.textPrimary,
      margin: 0,
    },

    adminInfo: {
      display: "flex",
      alignItems: "center",
      gap: adminSizes.spacing.md,
      padding: `${adminSizes.spacing.sm} ${adminSizes.spacing.lg}`,
      background: adminColors.bgHover,
      borderRadius: adminSizes.radius.md,
    },

    avatar: {
      width: "36px",
      height: "36px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      borderRadius: adminSizes.radius.full,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: adminColors.textWhite,
      fontWeight: adminTypography.fontWeight.semibold,
      fontSize: adminTypography.fontSize.md,
    },
  },

  // Card Styles
  card: {
    base: {
      background: adminColors.bgSecondary,
      border: `1px solid ${adminColors.border}`,
      borderRadius: adminSizes.radius.lg,
      transition: adminTransitions.normal,
    },

    statCard: {
      padding: adminSizes.spacing.xl,
      cursor: "pointer",
    },

    statIcon: {
      width: "48px",
      height: "48px",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: adminTypography.fontSize.xxxl,
    },

    statValue: {
      fontSize: adminTypography.fontSize.display,
      fontWeight: adminTypography.fontWeight.bold,
      color: adminColors.textPrimary,
    },
  },

  // Button Styles
  button: {
    base: {
      padding: "10px 20px",
      border: "none",
      borderRadius: adminSizes.radius.md,
      fontSize: adminTypography.fontSize.md,
      fontWeight: adminTypography.fontWeight.semibold,
      cursor: "pointer",
      transition: adminTransitions.normal,
      display: "inline-flex",
      alignItems: "center",
      gap: adminSizes.spacing.sm,
    },

    primary: {
      background: adminColors.success,
      color: adminColors.textWhite,
    },

    info: {
      background: adminColors.info,
      color: adminColors.textWhite,
    },

    error: {
      background: adminColors.error,
      color: adminColors.textWhite,
    },

    secondary: {
      background: adminColors.bgHover,
      color: adminColors.textSecondary,
    },

    small: {
      padding: "8px 16px",
      fontSize: adminTypography.fontSize.sm,
    },
  },

  // Table Styles
  table: {
    container: {
      overflowX: "auto",
    },

    table: {
      width: "100%",
      borderCollapse: "collapse",
    },

    thead: {
      background: adminColors.bgHover,
    },

    th: {
      padding: `${adminSizes.spacing.lg} ${adminSizes.spacing.xl}`,
      textAlign: "left",
      fontSize: adminTypography.fontSize.sm,
      fontWeight: adminTypography.fontWeight.semibold,
      color: adminColors.textTertiary,
      textTransform: "uppercase",
      letterSpacing: adminTypography.letterSpacing.wide,
      borderBottom: `1px solid ${adminColors.border}`,
    },

    td: {
      padding: `${adminSizes.spacing.lg} ${adminSizes.spacing.xl}`,
      fontSize: adminTypography.fontSize.md,
      color: adminColors.textSecondary,
      borderBottom: `1px solid ${adminColors.borderLight}`,
    },
  },

  // Badge Styles
  badge: {
    base: {
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: adminSizes.radius.lg,
      fontSize: adminTypography.fontSize.xs,
      fontWeight: adminTypography.fontWeight.semibold,
    },

    success: {
      background: adminColors.successBg,
      color: adminColors.success,
    },

    warning: {
      background: adminColors.warningBg,
      color: adminColors.warning,
    },

    error: {
      background: adminColors.errorBg,
      color: adminColors.error,
    },

    info: {
      background: adminColors.infoBg,
      color: adminColors.info,
    },
  },

  // Form Styles
  form: {
    input: {
      padding: "10px 16px",
      border: `1px solid ${adminColors.border}`,
      borderRadius: adminSizes.radius.md,
      fontSize: adminTypography.fontSize.md,
      color: adminColors.textSecondary,
      background: adminColors.bgSecondary,
      outline: "none",
      transition: adminTransitions.normal,
    },

    select: {
      padding: "10px 16px",
      border: `1px solid ${adminColors.border}`,
      borderRadius: adminSizes.radius.md,
      fontSize: adminTypography.fontSize.md,
      color: adminColors.textSecondary,
      background: adminColors.bgSecondary,
      cursor: "pointer",
      outline: "none",
    },
  },
};

// ===== 유틸리티 함수 =====

// 여러 스타일 객체를 병합하는 헬퍼 함수
export const mergeStyles = (...styles) => {
  return Object.assign({}, ...styles);
};

// 조건부 스타일 적용 헬퍼 함수
export const conditionalStyle = (condition, trueStyle, falseStyle = {}) => {
  return condition ? trueStyle : falseStyle;
};

// 호버 스타일 생성 헬퍼
export const createHoverStyle = (baseColor, hoverColor) => ({
  transition: adminTransitions.normal,
  ":hover": {
    background: hoverColor,
  },
});
