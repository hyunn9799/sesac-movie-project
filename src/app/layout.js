import Header from '@/component/Header'
import Footer from '@/component/Footer'

export const metadata = {
  title: 'MovieHub - 영화추천',
  description: '영화 리뷰와 평점을 공유하는 커뮤니티',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}