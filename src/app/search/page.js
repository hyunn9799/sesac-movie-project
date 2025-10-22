'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        const encoded = encodeURIComponent(query);
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?query=${encoded}&api_key=${API_KEY}&language=ko-KR&page=1&include_adult=false`
        );

        if (!res.ok) {
          throw new Error('검색에 실패했습니다.');
        }

        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error('검색 오류:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, API_KEY]);

  if (!query) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h1>검색어를 입력해주세요</h1>
        <Link
          href="/"
          style={{ color: '#007bff', textDecoration: 'underline' }}
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h1>검색 중...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h1>오류 발생</h1>
        <p>{error}</p>
        <Link
          href="/"
          style={{ color: '#007bff', textDecoration: 'underline' }}
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>
        &quot;{query}&quot; 검색 결과 ({results.length}개)
      </h1>

      {results.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>
            검색 결과가 없습니다.
          </p>
          <Link
            href="/"
            style={{ color: '#007bff', textDecoration: 'underline' }}
          >
            홈으로 돌아가기
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '20px',
          }}
        >
          {results.map((item) => {
            const title = item.title || item.name || '제목 없음';
            const mediaType = item.media_type;
            const posterPath = item.poster_path || item.profile_path;
            const releaseDate = item.release_date || item.first_air_date || '';
            const id = item.id;

            // 링크 경로 설정 (영화/TV/배우에 따라 다른 페이지로)
            let linkPath = '/';
            if (mediaType === 'movie') {
              linkPath = `/movieInfo/${id}`;
            } else if (mediaType === 'tv') {
              linkPath = `/movieInfo/${id}`;
            } else if (mediaType === 'person') {
              linkPath = `/person/${id}`;
            }

            return (
              <Link
                key={`${mediaType}-${id}`}
                href={linkPath}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '270px',
                      background: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {posterPath ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w342${posterPath}`}
                        alt={title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div style={{ color: '#999', fontSize: '14px' }}>
                        이미지 없음
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '10px' }}>
                    <h3
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        margin: '0 0 5px 0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {title}
                    </h3>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#666',
                        margin: 0,
                      }}
                    >
                      {mediaType === 'movie' && '영화'}
                      {mediaType === 'tv' && 'TV 시리즈'}
                      {mediaType === 'person' && '배우/감독'}
                      {releaseDate && ` · ${releaseDate.slice(0, 4)}`}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
