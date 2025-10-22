
// 'use client';
// import styles from './Header.module.css';
// import { useState, useRef, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// export default function Header() {
//   const [query, setQuery] = useState('');
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [suggestions, setSuggestions] = useState([]);
//   const [recent, setRecent] = useState([]);
//   const [saveSearch, setSaveSearch] = useState(true);
//   const [showSuggestionBox, setShowSuggestionBox] = useState(false);

//   const router = useRouter();
//   const closeTimer = useRef(null);
//   const suggestionTimer = useRef(null);
//   const wrapperRef = useRef(null);

//   const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

//   const moodRecommendations = [
//     { label: '슬플 때', genres: '18,10749' },
//     { label: '기분전환', genres: '35,10751' },
//     { label: '로맨틱', genres: '10749,12' },
//     { label: '스릴 넘치게', genres: '53,28' },
//     { label: '웃고 싶을 때', genres: '35' },
//   ];
//   const genreRecommendations = [
//     { label: '액션', genres: '28' },
//     { label: '코미디', genres: '35' },
//     { label: '드라마', genres: '18' },
//     { label: '스릴러', genres: '53' },
//     { label: '로맨스', genres: '10749' },
//     { label: 'SF', genres: '878' },
//     { label: '공포', genres: '27' },
//     { label: '애니메이션', genres: '16' },
//     { label: '판타지', genres: '14' },
//     { label: '역사', genres: '36' },
//     { label: '범죄', genres: '80' },
//     { label: '음악', genres: '10402' },
//     { label: '다큐멘터리', genres: '99' },
//   ];
//   const situationRecommendations = [
//     { label: '데이트', genres: '10749,35' },
//     { label: '혼자보기', genres: '18,10749' },
//     { label: '가족과 함께', genres: '10751,35' },
//     { label: '친구들과', genres: '35,12' },
//     { label: '영화관 데이트', genres: '10749,28' },
//     { label: '비오는 날', genres: '18,10749' },
//     { label: '잠 안 올 때', genres: '35' },
//   ];

//   useEffect(() => {
//     try {
//       const saved = JSON.parse(localStorage.getItem('recentSearches')) || [];
//       setRecent(saved);
//     } catch {
//       setRecent([]);
//     }
//   }, []);

//   useEffect(() => {
//     const handleOutsideClick = (e) => {
//       if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
//         setShowSuggestionBox(false);
//       }
//     };
//     document.addEventListener('mousedown', handleOutsideClick);
//     return () => document.removeEventListener('mousedown', handleOutsideClick);
//   }, []);

//   useEffect(() => {
//     if (!query || query.trim().length < 2) {
//       setSuggestions([]);
//       return;
//     }

//     if (suggestionTimer.current) clearTimeout(suggestionTimer.current);

//     suggestionTimer.current = setTimeout(async () => {
//       try {
//         const encoded = encodeURIComponent(query.trim());
//         const res = await fetch(
//           `https://api.themoviedb.org/3/search/multi?query=${encoded}&api_key=${API_KEY}&language=ko-KR&page=1&include_adult=false`
//         );
//         if (!res.ok) {
//           console.error('TMDB search failed:', res.status, res.statusText);
//           setSuggestions([]);
//           return;
//         }
//         const data = await res.json();
//         const items = (data.results || [])
//           .filter(Boolean)
//           .slice(0, 8)
//           .map((it) => ({
//             id: `${it.media_type || 'unknown'}-${it.id}`,
//             rawId: it.id,
//             media_type: it.media_type,
//             title: it.title || it.name || '제목 없음',
// ... (387줄 남음)
// 접기
// message.txt
// 18KB
// ﻿
// 'use client';
// import styles from './Header.module.css';
// import { useState, useRef, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// export default function Header() {
//   const [query, setQuery] = useState('');
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [suggestions, setSuggestions] = useState([]);
//   const [recent, setRecent] = useState([]);
//   const [saveSearch, setSaveSearch] = useState(true);
//   const [showSuggestionBox, setShowSuggestionBox] = useState(false);

//   const router = useRouter();
//   const closeTimer = useRef(null);
//   const suggestionTimer = useRef(null);
//   const wrapperRef = useRef(null);

//   const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

//   const moodRecommendations = [
//     { label: '슬플 때', genres: '18,10749' },
//     { label: '기분전환', genres: '35,10751' },
//     { label: '로맨틱', genres: '10749,12' },
//     { label: '스릴 넘치게', genres: '53,28' },
//     { label: '웃고 싶을 때', genres: '35' },
//   ];
//   const genreRecommendations = [
//     { label: '액션', genres: '28' },
//     { label: '코미디', genres: '35' },
//     { label: '드라마', genres: '18' },
//     { label: '스릴러', genres: '53' },
//     { label: '로맨스', genres: '10749' },
//     { label: 'SF', genres: '878' },
//     { label: '공포', genres: '27' },
//     { label: '애니메이션', genres: '16' },
//     { label: '판타지', genres: '14' },
//     { label: '역사', genres: '36' },
//     { label: '범죄', genres: '80' },
//     { label: '음악', genres: '10402' },
//     { label: '다큐멘터리', genres: '99' },
//   ];
//   const situationRecommendations = [
//     { label: '데이트', genres: '10749,35' },
//     { label: '혼자보기', genres: '18,10749' },
//     { label: '가족과 함께', genres: '10751,35' },
//     { label: '친구들과', genres: '35,12' },
//     { label: '영화관 데이트', genres: '10749,28' },
//     { label: '비오는 날', genres: '18,10749' },
//     { label: '잠 안 올 때', genres: '35' },
//   ];

//   useEffect(() => {
//     try {
//       const saved = JSON.parse(localStorage.getItem('recentSearches')) || [];
//       setRecent(saved);
//     } catch {
//       setRecent([]);
//     }
//   }, []);

//   useEffect(() => {
//     const handleOutsideClick = (e) => {
//       if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
//         setShowSuggestionBox(false);
//       }
//     };
//     document.addEventListener('mousedown', handleOutsideClick);
//     return () => document.removeEventListener('mousedown', handleOutsideClick);
//   }, []);

//   useEffect(() => {
//     if (!query || query.trim().length < 2) {
//       setSuggestions([]);
//       return;
//     }

//     if (suggestionTimer.current) clearTimeout(suggestionTimer.current);

//     suggestionTimer.current = setTimeout(async () => {
//       try {
//         const encoded = encodeURIComponent(query.trim());
//         const res = await fetch(
//           `https://api.themoviedb.org/3/search/multi?query=${encoded}&api_key=${API_KEY}&language=ko-KR&page=1&include_adult=false`
//         );
//         if (!res.ok) {
//           console.error('TMDB search failed:', res.status, res.statusText);
//           setSuggestions([]);
//           return;
//         }
//         const data = await res.json();
//         const items = (data.results || [])
//           .filter(Boolean)
//           .slice(0, 8)
//           .map((it) => ({
//             id: `${it.media_type || 'unknown'}-${it.id}`,
//             rawId: it.id,
//             media_type: it.media_type,
//             title: it.title || it.name || '제목 없음',
//             sub:
//               it.release_date ||
//               it.first_air_date ||
//               it.known_for_department ||
//               '',
//             poster_path: it.poster_path || it.profile_path || null,
//           }));
//         setSuggestions(items);
//         setShowSuggestionBox(true);
//       } catch (err) {
//         console.error('Error fetching suggestions:', err);
//         setSuggestions([]);
//       }
//     }, 300);

//     return () => {
//       if (suggestionTimer.current) clearTimeout(suggestionTimer.current);
//     };
//   }, [query, API_KEY]);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     const q = query.trim();
//     if (!q) return;
//     router.push(`/search?q=${encodeURIComponent(q)}`);

//     if (saveSearch) {
//       const updated = [q, ...recent.filter((r) => r !== q)].slice(0, 10);
//       try {
//         localStorage.setItem('recentSearches', JSON.stringify(updated));
//       } catch {}
//       setRecent(updated);
//     }

//     setQuery('');
//     setSuggestions([]);
//     setShowSuggestionBox(false);
//   };

//   const handleSuggestionClick = (item) => {
//     const q = item.title;
//     router.push(`/search?q=${encodeURIComponent(q)}`);

//     if (saveSearch) {
//       const updated = [q, ...recent.filter((r) => r !== q)].slice(0, 10);
//       try {
//         localStorage.setItem('recentSearches', JSON.stringify(updated));
//       } catch {}
//       setRecent(updated);
//     }
//     setQuery('');
//     setSuggestions([]);
//     setShowSuggestionBox(false);
//   };

//   const clearRecent = () => {
//     try {
//       localStorage.removeItem('recentSearches');
//     } catch {}
//     setRecent([]);
//   };

//   const handleRecommendClick = (genres, label) => {
//     const encodedLabel = encodeURIComponent(label);
//     router.push(`/recommendations?genres=${genres}&label=${encodedLabel}`);
//     setIsDropdownOpen(false);
//   };

//   const handleMouseEnter = () => {
//     if (closeTimer.current) {
//       clearTimeout(closeTimer.current);
//       closeTimer.current = null;
//     }
//     setIsDropdownOpen(true);
//   };

//   const handleMouseLeave = () => {
//     closeTimer.current = setTimeout(() => {
//       setIsDropdownOpen(false);
//     }, 500);
//   };

//   const handleRecentClick = (item) => {
//     setQuery(item);
//     setShowSuggestionBox(true);
//   };

//   return (
//     <header className={styles.header}>
//       <div className={styles.headerContainer}>
//         <div className={styles.logoSection}>
//           <Link href="/" className={styles.logo}>
//             <div className={styles.logoTextGroup}>
//               <span className={styles.logoMain}>MovieHub</span>
//               <span className={styles.logoSub}>REVIEWS</span>
//             </div>
//             <img
//               src="/Logo.png"
//               alt="MovieHub Logo"
//               className={styles.logoImage}
//             />
//           </Link>
//         </div>

//         {/* 추천 드롭다운 (완전한 항목 목록 렌더링) */}
//         <div
//           className={styles.recommendationWrapper}
//           onMouseEnter={handleMouseEnter}
//           onMouseLeave={handleMouseLeave}
//         >
//           <button className={styles.recommendationTriggerButton}>
//             영화 추천
//           </button>

//           {isDropdownOpen && (
//             <div className={styles.recommendationDropdown}>
//               <div className={styles.recommendationGroup}>
//                 <h3 className={styles.recommendationTitle}>장르별 추천</h3>
//                 <div className={styles.recommendationButtonList}>
//                   {genreRecommendations.map((item) => (
//                     <button
//                       key={item.label}
//                       className={`${styles.recommendationItemButton} ${styles.genreButton}`}
//                       onClick={() =>
//                         handleRecommendClick(item.genres, item.label)
//                       }
//                     >
//                       {item.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className={styles.recommendationGroup}>
//                 <h3 className={styles.recommendationTitle}>기분별 추천</h3>
//                 <div className={styles.recommendationButtonList}>
//                   {moodRecommendations.map((item) => (
//                     <button
//                       key={item.label}
//                       className={`${styles.recommendationItemButton} ${styles.moodButton}`}
//                       onClick={() =>
//                         handleRecommendClick(item.genres, item.label)
//                       }
//                     >
//                       {item.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className={styles.recommendationGroup}>
//                 <h3 className={styles.recommendationTitle}>상황별 추천</h3>
//                 <div className={styles.recommendationButtonList}>
//                   {situationRecommendations.map((item) => (
//                     <button
//                       key={item.label}
//                       className={`${styles.recommendationItemButton} ${styles.situationButton}`}
//                       onClick={() =>
//                         handleRecommendClick(item.genres, item.label)
//                       }
//                     >
//                       {item.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* 검색 섹션 (변경 없음 - 생략) */}
//         <div
//           className={styles.searchSection}
//           ref={wrapperRef}
//           style={{ position: 'relative' }}
//         >
//           <form
//             onSubmit={handleSearch}
//             className={styles.searchContainer}
//             autoComplete="off"
//           >
//             <input
//               type="text"
//               value={query}
//               onChange={(e) => {
//                 setQuery(e.target.value);
//                 if (e.target.value && e.target.value.trim().length >= 2) {
//                   setShowSuggestionBox(true);
//                 } else {
//                   setShowSuggestionBox(false);
//                 }
//               }}
//               placeholder="영화, 배우, 감독 검색..."
//               className={styles.searchInput}
//               aria-label="영화 검색"
//               onFocus={() => {
//                 if (!query) setShowSuggestionBox(true);
//               }}
//             />
//             <button type="submit" className={styles.searchButton}>
//               🔍
//             </button>
//           </form>

//           {/* 자동완성 / 최근검색 박스 (변경 없음 - 생략) */}
//           {showSuggestionBox &&
//             ((query && suggestions.length > 0) ||
//               (!query && recent.length > 0)) && (
//               <div
//                 className={styles.suggestionBox}
//                 style={{
//                   position: 'absolute',
//                   top: 'calc(100% + 6px)',
//                   left: 0,
//                   width: '360px',
//                   maxHeight: '420px',
//                   overflowY: 'auto',
//                   background: '#fff',
//                   color: '#000',
//                   borderRadius: '6px',
//                   boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
//                   zIndex: 60,
//                 }}
//               >
//                 {/* 쿼리 있을 때: 자동완성 결과 표시 */}
//                 {query && suggestions.length > 0 && (
//                   <div>
//                     {suggestions.map((s) => (
//                       <div
//                         key={s.id}
//                         className={styles.suggestionItem}
//                         style={{
//                           padding: '10px',
//                           cursor: 'pointer',
//                           display: 'flex',
//                           gap: '10px',
//                           alignItems: 'center',
//                         }}
//                         onClick={() => handleSuggestionClick(s)}
//                       >
//                         <div
//                           style={{
//                             width: 40,
//                             height: 56,
//                             background: '#eee',
//                             borderRadius: 4,
//                             overflow: 'hidden',
//                           }}
//                         >
//                           {s.poster_path ? (
//                             <img
//                               src={`https://image.tmdb.org/t/p/w92${s.poster_path}`}
//                               alt={s.title}
//                               style={{
//                                 width: '100%',
//                                 height: '100%',
//                                 objectFit: 'cover',
//                               }}
//                             />
//                           ) : (
//                             <div
//                               style={{
//                                 width: '100%',
//                                 height: '100%',
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 justifyContent: 'center',
//                                 fontSize: 12,
//                               }}
//                             >
//                               No
//                             </div>
//                           )}
//                         </div>
//                         <div style={{ flex: 1 }}>
//                           <div style={{ fontWeight: 600 }}>{s.title}</div>
//                           <div style={{ fontSize: 12, color: '#666' }}>
//                             {s.media_type} {s.sub ? `· ${s.sub}` : ''}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {/* 쿼리 없을 때: 최근 검색어 */}
//                 {!query && recent.length > 0 && (
//                   <div>
//                     <div
//                       style={{
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         padding: '8px 10px',
//                         borderBottom: '1px solid #eee',
//                         alignItems: 'center',
//                       }}
//                     >
//                       <strong>최근 검색어</strong>
//                       <div style={{ display: 'flex', gap: 8 }}>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setSaveSearch((s) => !s);
//                           }}
//                           className={styles.smallTextButton}
//                           style={{ fontSize: 12 }}
//                         >
//                           {saveSearch ? '저장 끄기' : '저장 켜기'}
//                         </button>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             clearRecent();
//                           }}
//                           className={styles.smallTextButton}
//                           style={{ fontSize: 12, color: '#e53e3e' }}
//                         >
//                           전체삭제
//                         </button>
//                       </div>
//                     </div>
//                     {recent.map((item, idx) => (
//                       <div
//                         key={idx}
//                         className={styles.recentItem}
//                         style={{
//                           padding: '8px 10px',
//                           cursor: 'pointer',
//                           display: 'flex',
//                           justifyContent: 'space-between',
//                           alignItems: 'center',
//                         }}
//                         onClick={() => handleRecentClick(item)}
//                       >
//                         <div>{item}</div>
//                         <div style={{ fontSize: 12, color: '#666' }}>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               const updated = recent.filter((r) => r !== item);
//                               try {
//                                 localStorage.setItem(
//                                   'recentSearches',
//                                   JSON.stringify(updated)
//                                 );
//                               } catch {}
//                               setRecent(updated);
//                             }}
//                             className={styles.smallTextButton}
//                           >
//                             삭제
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {/* 쿼리 있으나 결과 없음 */}
//                 {query && suggestions.length === 0 && (
//                   <div style={{ padding: 12, color: '#666' }}>
//                     검색 결과가 없습니다.
//                   </div>
//                 )}
//               </div>
//             )}
//         </div>

//         {/* 인증 / 링크 섹션 (변경 없음 - 생략) */}
//         <div className={styles.authSection}>
//           <div className={styles.authButtons}>
//             <Link href="/" className={styles.loginButton}>
//               홈
//             </Link>
//             <Link href="/mypage" className={styles.mypageLink}>
//               마이페이지
//             </Link>
//             <Link href="/login" className={styles.signupButton}>
//               로그인
//             </Link>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }
// message.txt
// 18KB