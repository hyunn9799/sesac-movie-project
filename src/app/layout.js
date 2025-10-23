'use client';

import { usePathname } from 'next/navigation';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import Chatbot from '@/component/Chatbot';
import { AuthProvider } from './auth/AuthContext';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // 어드민 페이지인지 확인
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <html lang="ko">
      <AuthProvider>
        <body style={{ margin: '0' }}>
          {!isAdminPage && <Header />}
          {children}
          {!isAdminPage && <Footer />}
          {!isAdminPage && <Chatbot />}
        </body>
      </AuthProvider>
    </html>
  );
}
