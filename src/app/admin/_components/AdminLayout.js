'use client';
//
import Image from 'next/image';
import {
  adminColors,
  adminSizes,
  adminStyles,
  mergeStyles,
} from '@/app/admin/_lib/style/adminTokens';

export default function AdminLayout({
  children,
  title = '대시보드',
  currentMenu = 'dashboard',
}) {
  const navItems = [
    { icon: '📊', label: '대시보드', href: '/admin', key: 'dashboard' },
    { icon: '👥', label: '회원 관리', href: '/admin/users', key: 'users' },
    { icon: '📋', label: '문의 관리', href: '/admin/fqa', key: 'fqa' },
  ];

  //const handleLogout = () => {
  //  if (confirm('로그아웃 하시겠습니까?')) {
  //    try {
  //      localStorage.removeItem('loggedInAdmin');
  //      localStorage.removeItem('loggedInUser');
  //    } catch (err) {
  //      console.error('Logout error:', err);
  //    }
  //    window.location.href = '/';
  //  }
  //};
  //
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
            <a
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: adminSizes.spacing.md,
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer',
              }}
            >
              <Image
                src="/Logo.png"
                alt="MovieHub Logo"
                width={32}
                height={32}
                style={{ objectFit: 'contain' }}
              />
              <span>MovieHub</span>
              <span style={adminStyles.sidebar.logoBadge}>ADMIN</span>
            </a>
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
                  window.location.href = '/';
                }
              }}
            >
              로그아웃
            </button>
          </div>
        </header>

        {/* ========================================
            메인 콘텐츠 (페이지별 내용)
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
