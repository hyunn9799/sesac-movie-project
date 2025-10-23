import Link from 'next/link'
import { useState } from 'react';
// ⭐️ 경로를 실제 모달 컴포넌트 경로에 맞게 확인하세요. ⭐️
import PerSonalModalPage from '@/app/modal/personal/page';
import UseModalPage from '@/app/modal/use/page';
import styles from './Footer.module.css' // CSS 모듈 사용 가정

export default function Footer() {
    const currentYear = new Date().getFullYear()
    
    // ⭐️ [수정] 초기 상태를 false로 설정하여 렌더링 시 모달이 닫혀 있게 합니다. ⭐️
    const [isOpen1, setIsOpen1] = useState(false); 
    const [isOpen2, setIsOpen2] = useState(false);

    const openPersonalModal = () => {
      setIsOpen1(true)
    }

    const openUseModal = () => {
      setIsOpen2(true)
    }
  
    const closeModal = () => {
      setIsOpen1(false);
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
             
                  <li>
                  <Link href="/notice">공지사항</Link>
                </li>
                 <li>
                  <Link href="/qna">문의하기</Link>
                </li>
                
              </ul>
            </div>

            <div className={styles.footerColumn}>
              <h4 className={styles.footerSubtitle}>정보</h4>
              <ul>
                <li>
                  {/* ⭐️ [핵심 수정] 무한 렌더링 방지를 위해 함수를 콜백 형태로 전달합니다. ⭐️ */}
                  <Link href="#" onClick={(e) => { e.preventDefault(); openPersonalModal(); }}>
                    개인 정보 처리 방침
                  </Link>
                </li>
                <li>
                  {/* ⭐️ [핵심 수정] 함수를 콜백 형태로 전달합니다. ⭐️ */}
                  <Link href="#" onClick={(e) => { e.preventDefault(); openUseModal(); }}>
                    자주묻는 질문
                  </Link>
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

        {/* ⭐️ 모달 렌더링 시 closeModal 함수를 prop으로 전달 ⭐️ */}
        {isOpen1 && <PerSonalModalPage closeModal={closeModal} />}
        {isOpen2 && <UseModalPage closeModal={closeModal} />}
      </footer>
    )
}