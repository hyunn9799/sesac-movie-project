'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Footer from '@/component/Footer';
import Chatbot from '@/component/Chatbot';
import { AuthProvider } from './auth/AuthContext';

// Dynamically import Header with SSR disabled
const Header = dynamic(() => import('@/component/Header'), { ssr: false });

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // 어드민 페이지인지 확인
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <html lang="ko">
      <AuthProvider>
        <body style={{ margin: '0' }} suppressHydrationWarning>
          {!isAdminPage && <Header />}
          {children}
          {!isAdminPage && <Footer />}
          {!isAdminPage && <Chatbot />}
        </body>
      </AuthProvider>
    </html>
  );
}
