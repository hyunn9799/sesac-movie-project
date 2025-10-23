
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReviewList from '@/app/movieInfo/[id]/ReviewList';
import CrewList from '@/app/movieInfo/[id]/CrewList';
import CustomModal from '@/component/CustomModal';
import { colors, spacing, commonStyles } from '@/lib/style/styles';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export default function MovieInfoClient({
  movie,
  credits,
  images,
  similar,
  videos,
  styles,
  initialReviews,
  id,
  director,
  cast,
  galleryImages,
  relatedMovies,
  videoKey,
  ratingStars,
  formattedRuntime,
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check login status
  const isLoggedIn = typeof window !== 'undefined' && (
    localStorage.getItem('loggedInUser') || localStorage.getItem('loggedInAdmin')
  );

  const handleWriteReviewClick = () => {
    if (!isLoggedIn) {
      setIsModalOpen(true);
    } else {
      router.push(`/review/write?movieId=${id}&movieTitle=${movie.title}`);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalConfirm = () => {
    router.push('/login');
    setIsModalOpen(false);
  };

  return (
    <>
      <div style={styles.pageWrapper}>
        {/* --- 섹션 1: 상단 정보 --- */}
        <div style={styles.heroWrapper}>
          <div style={styles.heroContainer}>
            <div style={styles.heroContent}>
              <h1 style={styles.title}>{movie.title}</h1>
              <div style={styles.metadata}>
                {`${movie.release_date.split('-')[0]} · ${formattedRuntime} · ${movie.genres.map(g => g.name).join(', ')}`}
              </div>
              <p style={styles.description}>{movie.overview}</p>
              <div style={styles.infoBoxes}>
                <div style={styles.infoBox}>
                  <div style={styles.infoBoxTitle}>인기도</div>
                  <div style={styles.infoBoxContent}>{Math.round(movie.popularity)} 점</div>
                  <div style={{ ...styles.infoBoxTitle, marginTop: spacing.md }}>
                    총 투표 수
                  </div>
                  <div style={styles.infoBoxContent}>{movie.vote_count.toLocaleString()} 회</div>
                </div>
                <div style={styles.infoBox}>
                  <div style={styles.infoBoxTitle}>관람객 평점</div>
                  <div style={styles.ratingStars}>{ratingStars}</div>
                  <div style={styles.infoBoxContent}>
                    {movie.vote_average.toFixed(1)} / 10.0
                  </div>
                </div>
              </div>
            </div>

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
          {/* --- 섹션 2: 영화 갤러리 --- */}
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

          {/* --- 섹션 3: 감독 출연 --- */}
          <CrewList director={director} cast={cast} styles={styles} />

          {/* --- 섹션 4: 감상 후기 --- */}
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>감상 후기</h2>
              <button style={styles.reviewButton} onClick={handleWriteReviewClick}>
                작성하기
              </button>
            </div>
            <ReviewList reviews={initialReviews} styles={styles} />
          </section>

          {/* --- 섹션 5: 관련 영화 --- */}
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>관련 영화</h2>
            </div>
            <div style={styles.relatedGrid}>
              {relatedMovies.map((related) => (
                <Link href={`/movieInfo/${related.id}`} key={related.id} style={{ textDecoration: 'none' }}>
                  <div style={{ ...styles.relatedCard, cursor: 'pointer' }}>
                    <img
                      src={`${IMAGE_BASE_URL}/w500${related.poster_path}`}
                      alt={related.title}
                      style={styles.relatedPoster}
                    />
                    <div style={commonStyles.movieInfo || { padding: spacing.md }}>
                      <h3 style={styles.relatedTitle}>{related.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* --- Custom Modal for login prompt --- */}
      <CustomModal
        isOpen={isModalOpen}
        message="로그인을 먼저 해야 합니다."
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        showConfirm={true}
        confirmText="확인"
        cancelText="취소"
      />
    </>
  );
}
