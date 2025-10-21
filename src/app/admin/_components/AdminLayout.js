'use client';

import {
  adminColors,
  adminSizes,
  adminStyles,
  mergeStyles,
} from '@/app/admin/_lib/style/adminTokens';

/**
 * 관리자 페이지 공통 레이아웃
 * - 사이드바, 헤더, 푸터를 포함
 * - 모든 관리자 페이지에서 재사용
 *
 * @param {ReactNode} children - 페이지 내용
 * @param {string} title - 페이지 제목 (헤더에 표시)
 * @param {string} currentMenu - 현재 활성화된 메뉴 (예: 'dashboard', 'users')
 */
export default function AdminLayout({
  children,
  title = '대시보드',
  currentMenu = 'dashboard',
}) {
  /**
   * 사이드바 네비게이션 메뉴 항목
   * - icon: 메뉴 아이콘
   * - label: 메뉴 이름
   * - href: 링크 경로
   * - key: 현재 메뉴 구분용 키
   */
  const navItems = [
    { icon: '📊', label: '대시보드', href: '/admin', key: 'dashboard' },
    { icon: '👥', label: '회원 관리', href: '/admin/users', key: 'users' },
    { icon: '🎬', label: '영화 관리', href: '/admin/movies', key: 'movies' },
    { icon: '⭐', label: '리뷰 관리', href: '/admin/reviews', key: 'reviews' },
    // {
    //   icon: "📢",
    //   label: "공지사항",
    //   href: "/admin/announcement",
    //   key: "announcement",
    // },
    {
      icon: '⚙️',
      label: '시스템 설정',
      href: '/admin/settings',
      key: 'settings',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: adminColors.bgPrimary,
      }}
    >
      {/* ========================================
          사이드바 (Sidebar)
          ======================================== */}
      <aside style={adminStyles.sidebar.container}>
        {/* 로고 섹션 */}
        <div
          style={{
            padding: `0 ${adminSizes.spacing.xl} ${adminSizes.spacing.xl}`,
            borderBottom: `1px solid ${adminColors.borderDark}`,
            marginBottom: adminSizes.spacing.xl,
          }}
        >
          <div style={adminStyles.sidebar.logo}>
            <span>🎬</span>
            <span>MovieHub</span>
            <span style={adminStyles.sidebar.logoBadge}>ADMIN</span>
          </div>
        </div>

        {/* 네비게이션 메뉴 */}
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {navItems.map((item, index) => (
            <li
              key={index}
              style={{
                margin: `${adminSizes.spacing.xs} ${adminSizes.spacing.md}`,
              }}
            >
              <a
                href={item.href}
                style={mergeStyles(
                  adminStyles.sidebar.navLink,
                  // 현재 메뉴면 빨간색 배경 활성화
                  item.key === currentMenu
                    ? adminStyles.sidebar.navLinkActive
                    : {}
                )}
              >
                <span
                  style={{
                    fontSize: '18px',
                    width: '20px',
                    textAlign: 'center',
                  }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </aside>

      {/* ========================================
          메인 콘텐츠 영역
          ======================================== */}
      <div style={{ marginLeft: adminSizes.sidebarWidth, flex: 1 }}>
        {/* ========================================
            헤더 (Header)
            ======================================== */}
        <header style={adminStyles.header.container}>
          {/* 페이지 제목 */}
          <h1 style={adminStyles.header.title}>{title}</h1>

          {/* 오른쪽 영역: 관리자 정보 + 로그아웃 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: adminSizes.spacing.lg,
            }}
          >
            {/* 관리자 정보 박스 */}
            <div style={adminStyles.header.adminInfo}>
              <div style={adminStyles.header.avatar}>재승</div>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: adminColors.textSecondary,
                }}
              >
                관리자님
              </span>
            </div>

            {/* 로그아웃 버튼 */}
            <button
              style={mergeStyles(
                adminStyles.button.base,
                adminStyles.button.secondary
              )}
              onClick={() => {
                if (confirm('로그아웃 하시겠습니까?')) {
                  alert('로그아웃 되었습니다.');
                  // TODO: 실제 로그아웃 처리
                  // window.location.href = '/login';
                }
              }}
            >
              로그아웃
            </button>
          </div>
        </header>

        {/* ========================================
            메인 콘텐츠 (페이지별 내용)
            - children으로 전달받은 내용 표시
            ======================================== */}
        <main style={{ padding: adminSizes.contentPadding }}>{children}</main>

        {/* ========================================
            푸터 (Footer)
            ======================================== */}
        <footer
          style={{
            padding: `${adminSizes.spacing.xl} ${adminSizes.contentPadding}`,
            textAlign: 'center',
            color: adminColors.textLight,
            fontSize: '13px',
            background: adminColors.bgSecondary,
            borderTop: `1px solid ${adminColors.border}`,
          }}
        >
          © 2025 MovieHub Admin. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
