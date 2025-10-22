// src/app/recommendations/page.js

// mainpage/page.js에서 사용했던 MovieSection을 재사용합니다.
import MovieSection from "@/component/MovieSection"; 

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

/**
 * 장르 ID로 영화 목록을 가져오는 함수
 * @param {string} genreIds - 쉼표로 구분된 장르 ID (예: "18,10749")
 */
async function fetchMoviesByGenre(genreIds) {
  if (!genreIds) return []; // 장르 ID가 없으면 빈 배열 반환

  try {
    // 💡 TMDB의 /discover/movie 엔드포인트를 사용합니다.
    // with_genres=18,10749 는 '드라마'와 '로맨스' 장르를
    // *모두* (AND) 포함하는 영화를 검색합니다.
    //
    // 만약 '드라마' *또는* '로맨스' (OR)를 원하면 "18|10749" (파이프)로
    // 요청해야 하지만, 지금은 AND 조건이 더 적절해 보입니다.
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=ko-KR&with_genres=${genreIds}&sort_by=popularity.desc&page=1`,
      { next: { revalidate: 3600 } } // 1시간 캐싱
    );

    if (!res.ok) {
      console.error("Failed to fetch recommendations:", res.statusText);
      return [];
    }

    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("Error fetching recommendations:", err);
    return [];
  }
}

/**
 * 영화 추천 결과 페이지
 * @param {object} props
 * @param {object} props.searchParams - URL의 쿼리 파라미터 (예: { genres: '18,10749' })
 */
export default async function RecommendationsPage({ searchParams }) {
  // 1. URL 쿼리에서 'genres' 값을 가져옵니다.
  const genreIds = searchParams.genres;

  // 2. 해당 장르 ID로 영화를 검색합니다.
  const movies = await fetchMoviesByGenre(genreIds);

  // 3. MovieSection을 재사용하여 결과를 렌더링합니다.
  return (
    <main className="main-container">
      <h1 className="main-title">🎬 추천 영화 결과</h1>

      {movies.length > 0 ? (
        <MovieSection 
          title="회원님을 위한 추천작" 
          movies={movies} 
        />
      ) : (
        <p style={{ textAlign: 'center', marginTop: '40px' }}>
          아쉽지만, 해당 조건의 추천 영화를 찾지 못했습니다. 😢
        </p>
      )}
    </main>
  );
}