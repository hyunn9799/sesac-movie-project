'use client';

import { usePathname } from 'next/navigation';
import Header from '@/component/Header';
import Footer from '@/component/Footer';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // 어드민 페이지인지 확인
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <html lang="ko">
      <body>
        {!isAdminPage && <Header />}
        {children}
        {!isAdminPage && <Footer />}
      </body>
    </html>
  );
}