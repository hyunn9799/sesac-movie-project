import Link from 'next/link';
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
import ReviewList from './ReviewList.js';
import CrewList from './CrewList.js';
import MovieInfoClient from '@/component/MovieInfoClient'; // 클라이언트 컴포넌트 임포트

// --- TMDB API 호출 함수들 ---
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
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
// 출연진 및 제작진 정보
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

// --- 메인 페이지 컴포넌트 ---
export default async function MovieInfoPage({ params }) {
  const { id } = await params;

  const [movie, credits, images, similar, videos] = await Promise.all([
    getMovieDetails(id),
    getMovieCredits(id),
    getMovieImages(id),
    getSimilarMovies(id),
    getMovieVideos(id),
  ]);

  // --- API 데이터 가공 ---
  const director = credits.crew.find((person) => person.job === 'Director');
  const cast = credits.cast.slice(0, 5);
  const galleryImages = images.backdrops.slice(0, 4);
  const relatedMovies = similar.results.slice(0, 5);

  // 헬퍼 함수들을 API 데이터 가공 이후에 정의합니다.
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
  const pageReviews = initialReviews.slice(0, 5);

  // 별점 렌더링 (서버에서 계산하여 직렬화 가능한 JSX로 전달)
  const ratingStars = (() => {
    const score = movie.vote_average / 2;
    const stars = [];
    const fullStars = Math.floor(score);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} style={{ color: colors.yellow }}>★</span>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={`empty-${i}`} style={{ color: colors.mediumGray }}>☆</span>);
    }
    return stars;
  })();

  // 런타임 포맷팅 (서버에서 계산하여 문자열로 전달)
  const formattedRuntime = (() => {
    if (!movie.runtime) return '';
    const h = Math.floor(movie.runtime / 60);
    const m = movie.runtime % 60;
    return `${h > 0 ? `${h}시간 ` : ''}${m}분`;
  })();

  // --- 스타일 정의 ---
  const styles = {
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
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.lg,
    },
    heroImageWrapper: {
      flex: 1,
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
      transition: 'background-color 0.2s',
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
      whiteSpace: 'pre-line',
    },
    reviewContentClickable: {
      fontSize: fontSize.medium,
      color: colors.lightGray,
      lineHeight: 1.5,
      cursor: 'pointer',
      whiteSpace: 'pre-line',
      transition: 'color 0.2s',
    },
    readMoreButton: {
      background: 'none',
      border: 'none',
      color: colors.info,
      cursor: 'pointer',
      padding: '4px 0',
      marginTop: '4px',
      fontSize: '14px',
      fontWeight: fontWeight.bold,
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
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalContent: {
      backgroundColor: colors.darkGray,
      padding: spacing.xl,
      borderRadius: borderRadius.medium,
      width: '90%',
      maxWidth: '700px',
      maxHeight: '80vh',
      overflowY: 'auto',
      position: 'relative',
      border: `1px solid ${colors.mediumGray}`,
    },
    modalCloseButton: {
      position: 'absolute',
      top: spacing.md,
      right: spacing.md,
      background: 'none',
      border: 'none',
      color: colors.white,
      fontSize: '30px',
      cursor: 'pointer',
      lineHeight: 1,
    },
    personHeader: {
      display: 'flex',
      gap: spacing.lg,
      marginBottom: spacing.lg,
      paddingBottom: spacing.lg,
      borderBottom: `1px solid ${colors.mediumGray}`,
    },
    personImage: {
      width: '100px',
      height: '150px',
      objectFit: 'cover',
      borderRadius: borderRadius.medium,
      backgroundColor: colors.dark,
    },
    personInfo: {
      flex: 1,
    },
    personName: {
      fontSize: fontSize.title,
      fontWeight: fontWeight.bold,
      color: colors.white,
      margin: 0,
      marginBottom: spacing.sm,
    },
    personBio: {
      fontSize: fontSize.medium,
      color: colors.lightGray,
      lineHeight: 1.6,
      margin: 0,
    },
    filmographyTitle: {
      fontSize: fontSize.xlarge,
      fontWeight: fontWeight.bold,
      color: colors.white,
      marginBottom: spacing.md,
    },
    filmographyList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    filmographyItem: {
      backgroundColor: colors.dark,
      padding: spacing.md,
      borderRadius: borderRadius.small,
      marginBottom: spacing.sm,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: fontSize.medium,
      color: colors.white,
    },
    filmographyYear: {
      color: colors.textSecondary,
      fontSize: fontSize.small,
      flexShrink: 0,
      marginLeft: spacing.md,
    },
    textPrimary: { color: colors.textPrimary },
    textLight: { color: colors.textLight },
    textSecondary: { color: colors.textSecondary },
  };

  return (
    <MovieInfoClient
      movie={movie}
      credits={credits}
      images={images}
      similar={similar}
      videos={videos}
      styles={styles}
      initialReviews={pageReviews}
      id={id}
      director={director}
      cast={cast}
      galleryImages={galleryImages}
      relatedMovies={relatedMovies}
      videoKey={videoKey}
      ratingStars={ratingStars}
      formattedRuntime={formattedRuntime}
    />
  );
}
