import MovieSection from '@/component/MovieSection';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

/**
 * 장르 ID로 영화 목록을 가져오는 함수
 * @param {string} genreIds
 */
async function fetchMoviesByGenre(genreIds) {
  if (!genreIds) return [];
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=ko-KR&with_genres=${genreIds}&sort_by=popularity.desc&page=1`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      console.error('Failed to fetch recommendations:', res.statusText);
      return [];
    }

    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error('Error fetching recommendations:', err);
    return [];
  }
}

/**
 * 영화 추천 결과 페이지
 * @param {object} props
 * @param {object} props.searchParams
 */
export default async function RecommendationsPage({ searchParams }) {
  const genreIds = searchParams.genres;

  const label = searchParams.label
    ? decodeURIComponent(searchParams.label)
    : '추천';

  const movies = await fetchMoviesByGenre(genreIds);

  return (
    <main className="main-container">
      {/* 💡 수정: 동적 타이틀로 변경 */}
      <h1 className="main-title">🎬 {label} 추천 영화 결과</h1>

      {movies.length > 0 ? (
        <MovieSection title="회원님을 위한 추천작" movies={movies} />
      ) : (
        <p style={{ textAlign: 'center', marginTop: '40px' }}>
          아쉽지만, 해당 조건의 추천 영화를 찾지 못했습니다. 😢
        </p>
      )}
    </main>
  );
}
