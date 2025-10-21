// src/app/movieInfo/[id]/page.js
import React from 'react';
// 팀의 스타일 가이드와 리뷰 데이터는 그대로 사용합니다.
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  commonStyles,
  layout,
} from '@/lib/style/styles';
import { initialReviews } from '@/lib/data/review';

// --- TMDB API 호출 함수들 ---
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// 공통 fetch 함수
async function fetchTMDb(path) {
  const url = `${TMDB_BASE_URL}${path}?api_key=${TMDB_API_KEY}&language=ko-KR`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${url}`);
  }
  return res.json();
}

// 영화 상세 정보
async function getMovieDetails(id) {
  return fetchTMDb(`/movie/${id}`);
}

// (중요) 출연진 및 제작진 정보
async function getMovieCredits(id) {
  return fetchTMDb(`/movie/${id}/credits`);
}

// 영화 이미지 (갤러리용)
async function getMovieImages(id) {
  const url = `${TMDB_BASE_URL}/movie/${id}/images?api_key=${TMDB_API_KEY}`;
  const res = await fetch(url);
  return res.json();
}

// 관련 영화 목록
async function getSimilarMovies(id) {
  return fetchTMDb(`/movie/${id}/similar`);
}

// 영화 비디오 (예고편) 정보
async function getMovieVideos(id) {
  const url = `${TMDB_BASE_URL}/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=ko-KR,en-US`;
  const res = await fetch(url);
  return res.json();
}
// ------------------------------

// 별점 렌더링 헬퍼 함수
const renderStars = (rating) => {
  const score = rating / 2;
  const stars = [];
  const fullStars = Math.floor(score);
  
  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={`full-${i}`} style={{ color: colors.yellow }}>★</span>);
  }
  for (let i = stars.length; i < 5; i++) {
    stars.push(<span key={`empty-${i}`} style={{ color: colors.mediumGray }}>☆</span>);
  }
  return stars;
};

// 런타임 변환 함수
const formatRuntime = (minutes) => {
    if (!minutes) return '';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h > 0 ? `${h}시간 ` : ''}${m}분`;
}

// --- 메인 페이지 컴포넌트 ---
export default async function MovieInfoPage({ params }) {
  const { id } = params; 

  const [movie, credits, images, similar, videos] = await Promise.all([
    getMovieDetails(id),
    getMovieCredits(id), // (중요) 여기서 credits 정보를 가져옵니다.
    getMovieImages(id),
    getSimilarMovies(id),
    getMovieVideos(id), 
  ]);

  // --- API 데이터 가공 ---
  
  // (중요) credits 객체에서 실제 감독과 출연진 정보를 추출합니다.
  const director = credits.crew.find((person) => person.job === 'Director');
  const cast = credits.cast.slice(0, 5); // 주요 출연진 5명
  
  const galleryImages = images.backdrops.slice(0, 4);
  const relatedMovies = similar.results.slice(0, 5);
 

// (추가) 로고 및 포스터 데이터 추출 (오류 해결)
const movieLogos = images.logos;
const moviePosters = images.posters.slice(0, 5);

  
  // 예고편 키(key) 찾기
  const findVideoKey = () => {
    const trailer = videos.results.find(
      (v) => v.type === 'Trailer' && v.site === 'YouTube'
    );
    if (trailer) return trailer.key;

    const teaser = videos.results.find(
      (v) => v.type === 'Teaser' && v.site === 'YouTube'
    );
    if (teaser) return teaser.key;
    
    const anyVideo = videos.results.find((v) => v.site === 'YouTube');
    if (anyVideo) return anyVideo.key;

    return null;
  };
  const videoKey = findVideoKey();

  const pageReviews = initialReviews.slice(0, 4);

  // --- 스타일 정의 ---
  const styles = {
    // (모든 스타일은 이전과 동일하게 유지)
    pageWrapper: {
      backgroundColor: colors.dark,
      color: colors.textPrimary,
      minHeight: '100vh',
    },
    heroWrapper: {
      position: 'relative',
      padding: `${spacing.xxl} 0`,
      marginBottom: spacing.xxl,
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(10, 10, 10, 0.9)), url(${IMAGE_BASE_URL}/original${movie.backdrop_path})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    heroContainer: {
      ...commonStyles.container,
      display: 'flex',
      gap: spacing.xxl,
      alignItems: 'flex-start',
    },
    heroContent: {
      flex: 3,
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.lg,
    },
    heroImageWrapper: {
      flex: 1,
      minWidth: '300px',
    },
    posterImage: {
      width: '100%',
      height: 'auto',
      borderRadius: borderRadius.medium,
      border: `1px solid ${colors.darkGray}`,
    },
    videoWrapper: {
      position: 'relative',
      paddingBottom: '56.25%',
      height: 0,
      overflow: 'hidden',
      borderRadius: borderRadius.medium,
      backgroundColor: colors.dark,
      border: `1px solid ${colors.darkGray}`,
    },
    videoIframe: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    title: {
      fontSize: fontSize.hero,
      fontWeight: fontWeight.bold,
      color: colors.white,
      margin: 0,
    },
    metadata: {
      fontSize: fontSize.large,
      color: colors.lightGray,
    },
    description: {
      fontSize: fontSize.medium,
      color: colors.lightGray,
      lineHeight: 1.6,
    },
    infoBoxes: {
      display: 'flex',
      gap: spacing.lg,
      marginTop: spacing.lg,
    },
    infoBox: {
      backgroundColor: 'rgba(30, 30, 30, 0.8)',
      padding: spacing.lg,
      borderRadius: borderRadius.medium,
      flex: 1,
      border: `1px solid ${colors.darkGray}`,
    },
    infoBoxTitle: {
      fontSize: fontSize.medium,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
    },
    infoBoxContent: {
      fontSize: fontSize.large,
      color: colors.white,
      fontWeight: fontWeight.medium,
    },
    ratingStars: {
      fontSize: fontSize.xlarge,
      marginBottom: spacing.sm,
    },
    mainContainer: {
        ...commonStyles.container,
        paddingTop: 0,
    },
    section: {
      marginBottom: spacing.xxl,
    },
    sectionHeader: {
      ...layout.spaceBetween,
      marginBottom: spacing.lg,
      borderBottom: `1px solid ${colors.darkGray}`,
      paddingBottom: spacing.md,
    },
    sectionTitle: {
      ...commonStyles.sectionTitle,
      marginBottom: 0,
    },
    galleryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: spacing.md,
    },
    galleryImage: {
      width: '100%',
      height: '160px',
      objectFit: 'cover',
      borderRadius: borderRadius.medium,
      cursor: 'pointer',
      transition: 'transform 0.3s ease',
    },
    crewGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: spacing.lg,
    },
    crewItem: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: colors.darkGray,
      padding: spacing.md,
      borderRadius: borderRadius.medium,
    },
    crewImage: {
      width: '60px',
      height: '60px',
      borderRadius: borderRadius.circle,
      objectFit: 'cover',
      backgroundColor: colors.dark,
    },
    crewName: {
      fontSize: fontSize.large,
      color: colors.white,
    },
    reviewButton: {
      ...commonStyles.button,
      ...commonStyles.buttonPrimary,
    },
    reviewList: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.lg,
    },
    reviewItem: {
      borderBottom: `1px solid ${colors.darkGray}`,
      paddingBottom: spacing.lg,
    },
    reviewUser: {
      fontSize: fontSize.medium,
      fontWeight: fontWeight.bold,
      color: colors.white,
      marginBottom: spacing.sm,
    },
    reviewContent: {
      fontSize: fontSize.medium,
      color: colors.lightGray,
      lineHeight: 1.5,
    },
    // (추가된 로고/포스터 스타일)
    logoSection: {
      textAlign: 'center',
      marginBottom: spacing.lg,
      padding: spacing.lg,
      backgroundColor: colors.darkGray,
      borderRadius: borderRadius.medium,
    },
    logoImage: {
      maxWidth: '300px',
      maxHeight: '150px',
      filter: 'brightness(0) invert(1)',
    },
    posterGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: spacing.md,
    },
    posterInGallery: {
      width: '100%',
      borderRadius: borderRadius.medium,
      transition: 'transform 0.2s ease',
      cursor: 'pointer',
    },
    relatedGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: spacing.lg,
    },
    relatedCard: {
      ...commonStyles.movieCard,
      cursor: 'default',
    },
    relatedPoster: {
      width: '100%',
      height: '320px',
      objectFit: 'cover',
      backgroundColor: colors.dark,
    },
    relatedTitle: {
      ...commonStyles.movieTitle,
      textAlign: 'center',
      fontSize: fontSize.medium,
      padding: `${spacing.sm} 0`,
    },
  };

  return (
    <div style={styles.pageWrapper}>
      {/* --- 섹션 1: 상단 정보 --- */}
      <div style={styles.heroWrapper}>
        <div style={styles.heroContainer}>
          {/* ... (왼쪽 텍스트 영역) ... */}
          <div style={styles.heroContent}>
            <h1 style={styles.title}>{movie.title}</h1>
            <div style={styles.metadata}>
              {`${movie.release_date.split('-')[0]} · ${formatRuntime(movie.runtime)} · ${movie.genres.map(g => g.name).join(', ')}`}
            </div>
            <p style={styles.description}>{movie.overview}</p>
            <div style={styles.infoBoxes}>
              <div style={styles.infoBox}>
                <div style={styles.infoBoxTitle}>인기도</div>
                <div style={styles.infoBoxContent}>{Math.round(movie.popularity)} 점</div>
                <div style={{...styles.infoBoxTitle, marginTop: spacing.md }}>
                  누적 수익
                </div>
                <div style={styles.infoBoxContent}>${movie.revenue.toLocaleString()}</div>
              </div>
              <div style={styles.infoBox}>
                <div style={styles.infoBoxTitle}>관람객 평점</div>
                <div style={styles.ratingStars}>{renderStars(movie.vote_average)}</div>
                <div style={styles.infoBoxContent}>
                  {movie.vote_average.toFixed(1)} / 10.0
                </div>
              </div>
            </div>
          </div>
          
          {/* ... (오른쪽 예고편/포스터 영역) ... */}
          <div style={styles.heroImageWrapper}>
            {videoKey ? (
              <div style={styles.videoWrapper}>
                <iframe
                  style={styles.videoIframe}
                  src={`https://www.youtube.com/embed/${videoKey}`}
                  title="Movie Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <>
                <img
                  src={`${IMAGE_BASE_URL}/w500${movie.poster_path}`}
                  alt={movie.title}
                  style={styles.posterImage}
                />
                <p style={styles.posterCaption}>
                  *예고편을 찾을 수 없습니다.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <main style={styles.mainContainer}>
        {/* ... (섹션 2: 영화 갤러리) ... */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>영화 갤러리</h2>
          </div>
          <div style={styles.galleryGrid}>
            {galleryImages.map((image, index) => (
              <img
                key={index}
                src={`${IMAGE_BASE_URL}/w780${image.file_path}`}
                alt={`갤러리 이미지 ${index + 1}`}
                style={styles.galleryImage}
              />
            ))}
          </div>
        </section>

        {/* --- (중요) 섹션 3: 감독 출연 (API 데이터 사용) --- */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>감독 & 주요 출연진</h2>
          </div>
          <div style={styles.crewGrid}>
            {/* API로 가져온 director 변수 사용 */}
            {director && (
              <div style={styles.crewItem}>
                <img
                  src={director.profile_path ? `${IMAGE_BASE_URL}/w185${director.profile_path}` : 'https://i.imgur.com/dDD1biL.png'}
                  alt={director.name}
                  style={styles.crewImage}
                />
                <div>
                  <span style={styles.crewName}>{director.name}</span>
                  <div style={{color: colors.textSecondary}}>감독</div>
                </div>
              </div>
            )}
            {/* API로 가져온 cast 변수 사용 */}
            {cast.map((person) => (
              <div key={person.id} style={styles.crewItem}>
                <img
                  src={person.profile_path ? `${IMAGE_BASE_URL}/w185${person.profile_path}` : 'https://i.imgur.com/dDD1biL.png'}
                  alt={person.name}
                  style={styles.crewImage}
                />
                <div>
                  <span style={styles.crewName}>{person.name}</span>
                  <div style={{color: colors.textSecondary}}>{person.character}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- (섹션 4: 감상 후기 - static 데이터 사용) --- */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>감상 후기</h2>
            <button style={styles.reviewButton}>작성하기</button>
          </div>
          <div style={styles.reviewList}>
            {pageReviews.map((review) => (
              <div key={review.id} style={styles.reviewItem}>
                <div style={styles.reviewUser}>{review.userName}</div>
                <p style={styles.reviewContent}>{review.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- (섹션 5: 로고 및 포스터) --- */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>로고 및 포스터</h2>
          </div>
          {movieLogos && movieLogos.length > 0 && (
            <div style={styles.logoSection}>
              <img
                src={`${IMAGE_BASE_URL}/w500${movieLogos[0].file_path}`}
                alt={`${movie.title} Logo`}
                style={styles.logoImage}
              />
            </div>
          )}
          <div style={styles.posterGrid}>
            {images.posters.slice(0, 5).map((poster, index) => ( // 5개만 표시
              <img
                key={index}
                src={`${IMAGE_BASE_URL}/w342${poster.file_path}`}
                alt={`Poster ${index + 1}`}
                style={styles.posterInGallery}
              />
            ))}
          </div>
        </section>


        {/* --- (섹션 6: 관련 영화) --- */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>관련 영화</h2>
          </div>
          <div style={styles.relatedGrid}>
            {relatedMovies.map((related) => (
              <div key={related.id} style={styles.relatedCard}>
                <img
                  src={`${IMAGE_BASE_URL}/w500${related.poster_path}`}
                  alt={related.title}
                  style={styles.relatedPoster}
                />
                <div style={commonStyles.movieInfo}>
                  <h3 style={styles.relatedTitle}>{related.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}