import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* 왼쪽: 로고/브랜드 */}
        <div className={`${styles.footerSection} ${styles.footerBrand}`}>
          <h3 className={styles.footerTitle}>MovieReview</h3>
          <p className={styles.footerDescription}>
            영화 리뷰와 평점을 공유하는 커뮤니티
          </p>
        </div>

        {/* 중앙: 링크 */}
        <div className={`${styles.footerSection} ${styles.footerLinks}`}>
          <div className={styles.footerColumn}>
            <h4 className={styles.footerSubtitle}>서비스</h4>
            <ul>
              <li>
                <Link href="/">홈</Link>
              </li>
              <li>
                <Link href="/movieinfo">검색</Link>
              </li>
              <li>
                <Link href="/mypage">마이페이지</Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h4 className={styles.footerSubtitle}>정보</h4>
            <ul>
              <li>
                <a href="#privacy">개인정보 처리방침</a>
              </li>
              <li>
                <a href="#terms">이용약관</a>
              </li>
              <li>
                <a href="#contact">문의하기</a>
              </li>
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h4 className={styles.footerSubtitle}>소셜</h4>
            <ul>
              <li>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noreferrer"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noreferrer"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 오른쪽: API 정보 */}
        <div className={`${styles.footerSection} ${styles.footerApi}`}>
          <p className={styles.footerCredit}>
            영화 데이터는{' '}
            <a 
              href="https://www.themoviedb.org/" 
              target="_blank" 
              rel="noreferrer"
            >
              TMDB
            </a>
            에서 제공합니다
          </p>
        </div>
      </div>

      {/* 하단: 저작권 */}
      <div className={styles.footerBottom}>
        <p className={styles.footerCopyright}>
          &copy; {currentYear} MovieReview. All rights reserved.
        </p>
      </div>
    </footer>
  )
}