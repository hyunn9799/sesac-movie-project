'use client'
import styles from './Header.module.css'
import { useState, useRef } from 'react' // useRef 추가
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Header() {
  const [query, setQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()
  // 타이머 참조를 위한 useRef 훅 사용
  const closeTimer = useRef(null) 

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${query}`)
    }
  }

  // --- 추천 데이터 생략 (변경 없음) ---
  const moodRecommendations = [
    { label: '슬플 때', genres: '18,10749' }, 
    { label: '기분전환', genres: '35,10751' }, 
    { label: '로맨틱', genres: '10749,12' }, 
    { label: '스릴 넘치게', genres: '53,28' }, 
    { label: '웃고 싶을 때', genres: '35' }, 
  ]
  const genreRecommendations = [
    { label: '액션', genres: '28' },
    { label: '코미디', genres: '35' },
    { label: '드라마', genres: '18' },
    { label: '스릴러', genres: '53' },
    { label: '로맨스', genres: '10749' },
    { label: 'SF', genres: '878' },
    { label: '공포', genres: '27' },
    { label: '애니메이션', genres: '16' },
  ]
  const situationRecommendations = [
    { label: '데이트', genres: '10749,35' }, 
    { label: '혼자보기', genres: '18,10749' }, 
    { label: '가족과 함께', genres: '10751,35' }, 
    { label: '친구들과', genres: '35,12' }, 
  ]
  // ------------------------------------

  const handleRecommendClick = (genres) => {
    router.push(`/recommendations?genres=${genres}`)
    setIsDropdownOpen(false) 
  }

  // 마우스 진입 (드롭다운 열기)
  const handleMouseEnter = () => {
    // 닫기 타이머가 있다면 취소하고 바로 엽니다.
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setIsDropdownOpen(true)
  }

  // 마우스 이탈 (딜레이 후 드롭다운 닫기)
  const handleMouseLeave = () => {
    // 500ms (0.5초) 후에 드롭다운을 닫도록 타이머를 설정합니다.
    closeTimer.current = setTimeout(() => {
      setIsDropdownOpen(false)
    }, 500) 
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.logoSection}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoMain}>MovieReview</span>
            <span className={styles.logoSub}>REVIEWS</span>
          </Link>
        </div>

        {/* '영화 추천' 드롭다운 섹션 */}
        <div
          className={styles.recommendationWrapper}
          onMouseEnter={handleMouseEnter} // 수정된 핸들러 사용
          onMouseLeave={handleMouseLeave} // 수정된 핸들러 사용
        >
          {/* "영화 추천" 트리거 버튼 */}
          <button className={styles.recommendationTriggerButton}>영화 추천</button>

          {/* 드롭다운 패널 */}
          {isDropdownOpen && (
            // 드롭다운 패널 자체에는 별도의 onMouseEnter/onMouseLeave를 걸 필요가 없습니다.
            // 모든 관리는 부모인 .recommendationWrapper에서 이루어집니다.
            <div className={styles.recommendationDropdown}>
              {/* --- 추천 그룹 렌더링 코드 (생략) --- */}
              <div className={styles.recommendationGroup}>
                <h3 className={styles.recommendationTitle}>장르별 추천</h3>
                <div className={styles.recommendationButtonList}>
                  {genreRecommendations.map((item) => (
                    <button
                      key={item.label}
                      className={`${styles.recommendationItemButton} ${styles.genreButton}`}
                      onClick={() => handleRecommendClick(item.genres)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.recommendationGroup}>
                <h3 className={styles.recommendationTitle}>기분별 추천</h3>
                <div className={styles.recommendationButtonList}>
                  {moodRecommendations.map((item) => (
                    <button
                      key={item.label}
                      className={`${styles.recommendationItemButton} ${styles.moodButton}`}
                      onClick={() => handleRecommendClick(item.genres)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.recommendationGroup}>
                <h3 className={styles.recommendationTitle}>상황별 추천</h3>
                <div className={styles.recommendationButtonList}>
                  {situationRecommendations.map((item) => (
                    <button
                      key={item.label}
                      className={`${styles.recommendationItemButton} ${styles.situationButton}`}
                      onClick={() => handleRecommendClick(item.genres)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 검색 섹션 및 인증 섹션 (생략) */}
        <div className={styles.searchSection}>
          <form onSubmit={handleSearch} className={styles.searchContainer}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="영화 검색..."
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              🔍
            </button>
          </form>
        </div>

        <div className={styles.authSection}>
          <div className={styles.authButtons}>
            <Link href="/" className={styles.loginButton}>
              홈
            </Link>
            <Link href="/mypage" className={styles.mypageLink}>
              마이페이지
            </Link>
            <Link href="/login" className={styles.signupButton}>
              로그인
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}