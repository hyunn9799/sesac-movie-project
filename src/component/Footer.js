import Link from 'next/link'
import { useState } from 'react';
// ⭐️ 경로를 실제 모달 컴포넌트 경로에 맞게 확인하세요. ⭐️
import PerSonalModalPage from '@/app/modal/personal/page';
import UseModalPage from '@/app/modal/use/page';
import styles from './Footer.module.css' // CSS 모듈 사용 가정

export default function Footer() {
    const currentYear = new Date().getFullYear()
    
    // ⭐️ 초기 상태는 false로 유지합니다. ⭐️
    const [isOpen1, setIsOpen1] = useState(false); 
    const [isOpen2, setIsOpen2] = useState(false);

    const openPersonalModal = () => {
      setIsOpen1(true)
    }

    const openUseModal = () => {
      setIsOpen2(true)
    }
  
    // 각 모달별 닫기 함수
    const closeModal1 = () => {
      setIsOpen1(false);
    };
    const closeModal2 = () => {
      setIsOpen2(false);
    };
    

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
                {/* ⭐️ 누락된 홈/마이페이지 링크를 다시 추가합니다. ⭐️ */}
             
                  <li>
                  <Link href="/notice">공지사항</Link>
                </li>
                  <li>
                  <Link href="/qna">FAQ</Link>
                </li>
                
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h4 className={styles.footerSubtitle}>정보</h4>
              <ul>
                <li>
                  {/* ⭐️ [핵심 수정] Link 대신 <a> 태그를 사용하여 이벤트 충돌을 방지합니다. ⭐️ */}
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); openPersonalModal(); }}
                  >
                    개인 정보 처리 방침
                  </a>
                </li>
                <li>
                  {/* ⭐️ [핵심 수정] Link 대신 <a> 태그를 사용하여 이벤트 충돌을 방지합니다. ⭐️ */}
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); openUseModal(); }}
                  >
                    사이트 이용 약관
                  </a>
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

        {/* ⭐️ 모달 렌더링 시 해당 닫기 함수를 prop으로 전달 ⭐️ */}
        {isOpen1 && <PerSonalModalPage closeModal1={closeModal1} />}
        {isOpen2 && <UseModalPage closeModal2={closeModal2} />}
      </footer>
    )
}