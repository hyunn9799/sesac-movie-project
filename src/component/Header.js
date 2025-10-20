// components/Header.js
'use client'
import styles from './Header.module.css'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Header() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${query}`)
    }
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