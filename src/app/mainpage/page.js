import MovieSection from "@/component/MovieSection";

async function fetchMovies(category) {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${category}?api_key=${API_KEY}&language=ko-KR`,
      { next: { revalidate: 3600 } } // 1시간 캐싱
    );

    if (!res.ok) {
      console.error(`Failed to fetch ${category}:`, res.statusText);
      return []; // 오류 시 빈 배열 반환
    }

    const data = await res.json();
    return data.results || []; // results가 undefined일 경우 대비
  } catch (err) {
    console.error(`Error fetching ${category}:`, err);
    return []; // 네트워크 에러 시 빈 배열 반환
  }
}

export default async function MainPage() {
  // 비동기 fetch 결과를 항상 배열로 보장
  const [popular, nowPlaying, topRated] = await Promise.all([
    fetchMovies("popular"),
    fetchMovies("now_playing"),
    fetchMovies("top_rated"),
  ]);

  return (
    <main className="main-container">
      <h1 className="main-title">🎬 MovieHub - 영화 추천</h1>

      <MovieSection title="🔥 인기 영화" movies={popular || []} />
      <MovieSection title="🎥 현재 상영작" movies={nowPlaying || []} />
      <MovieSection title="⭐ 평점 높은 영화" movies={topRated || []} />
    </main>
  );
}
