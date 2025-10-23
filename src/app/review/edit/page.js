'use client'; // 👈 Form handling requires client component

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // For redirection and getting query params

// 팀 스타일 가이드 임포트 (경로 확인 필요)
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  commonStyles,
} from '@/lib/style/styles';

export default function ReviewWritePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const movieId = searchParams.get('movieId'); // URL에서 movieId 가져오기
  const movieTitle = searchParams.get('movieTitle'); // URL에서 movieTitle 가져오기
  const reviewId = searchParams.get('reviewId');

  const [review, setReview] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState();
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false); // isEditing 상태 제거

  useEffect(() => {
    try {
      const reviewData = JSON.parse(localStorage.getItem('myReviews') || '[]');
      const editingReview = reviewData.find((r) => r.id === Number(reviewId));
      setReview(editingReview ?? null);
      console.log('loaded review', editingReview);
    } catch (err) {
      console.error('myReviews parsing error', err);
      setReview(null);
    }
  }, [reviewId]);

  // 2) review가 바뀔 때만 reviewText 상태를 설정 (렌더 중 setState 방지)
  useEffect(() => {
    if (!review) return;

    // 실제로 내용이 다를 때만 setState 호출 (불필요한 재렌더 방지)
    if (review.content != null && review.content !== reviewText) {
      setReviewText(review.content);
    }
  }, [review]);

  const MAX_LENGTH = 1000;

  const handleTextChange = (event) => {
    const text = event.target.value;
    if (text.length <= MAX_LENGTH) {
      setReviewText(text);
    }
  };

  const handleSubmit = () => {
    if (isSubmitting) return;

    if (rating === 0) {
      alert('별점을 선택해주세요.');
      return;
    }
    if (reviewText.trim() === '') {
      alert('리뷰 내용을 입력해주세요.');

      return;
    }

    setIsSubmitting(true);

    // --- 실제 데이터 저장 로직 ---
    // ... (LocalStorage 또는 추후 API 호출 로직) ...
    const savedReviews = JSON.parse(localStorage.getItem('myReviews') || '[]');

    // 특정 id(또는 movieId)에 해당하는 리뷰의 content만 수정
    const updatedReviews = savedReviews.map((review) =>
      review.id === reviewId || review.movieId === movieId
        ? { ...review, content: reviewText, rating: rating }
        : review
    );

    // 변경된 목록 다시 저장
    localStorage.setItem('myReviews', JSON.stringify(updatedReviews));

    alert(
      `리뷰 내용이 수정되었습니다! (영화 ID: ${movieId})\n새 내용: ${reviewText.substring(
        0,
        50
      )}...`
    );
    if (movieId) {
      router.push(`/movieInfo/${movieId}`);
    } else {
      router.push('/');
    }
  };

  // --- 스타일 정의 ---
  const styles = {
    pageWrapper: {
      backgroundColor: colors.dark,
      color: colors.textPrimary || 'white',
      minHeight: 'calc(100vh - 160px)',
      padding: `${spacing.xxl} 0`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center', // [수정] 중앙 정렬 (세로 크기 고정 시)
    },
    contentContainer: {
      backgroundColor: colors.white,
      color: colors.dark,
      borderRadius: borderRadius.medium,
      padding: spacing.xl,
      // 👇 [수정] 감상 후기 작성 컨테이너 크기 고정
      width: '1100px',
      height: '500px',
      boxShadow: commonStyles.card?.boxShadow || '0 4px 8px rgba(0,0,0,0.1)',
      display: 'flex', // [추가] Flexbox 레이아웃 사용
      flexDirection: 'column', // [추가] 세로 방향 정렬
    },
    title: {
      fontSize: fontSize.xxlarge,
      fontWeight: fontWeight.bold,
      color: colors.dark,
      marginBottom: spacing.lg,
      paddingBottom: spacing.md,
      borderBottom: `1px solid ${colors.lightGray}`,
      flexShrink: 0, // [추가] 제목 영역 크기 고정
    },
    ratingContainer: {
      marginBottom: spacing.lg,
      display: 'flex',
      alignItems: 'center',
      gap: spacing.md,
      flexShrink: 0,
      alignSelf: 'center',
      width: '1050px',
    },
    ratingLabel: {
      fontSize: fontSize.medium,
      fontWeight: fontWeight.medium,
      color: colors.dark,
    },
    starsWrapper: {
      display: 'flex',
      gap: '2px',
    },
    star: {
      fontSize: '28px',
      cursor: 'pointer',
      color: colors.lightGray,
      transition: 'color 0.2s',
    },
    filledStar: {
      color: colors.yellow,
    },
    infoText: {
      fontSize: fontSize.medium,
      color: colors.mediumGray,
      marginBottom: spacing.lg,
      padding: spacing.md,
      backgroundColor: '#f8f9fa',
      borderRadius: borderRadius.small,
      flexShrink: 0, // [추가] 안내 텍스트 크기 고정
    },
    textarea: {
      // 👇 [수정] 텍스트 영역 크기 고정 및 Flexbox 활용
      width: '1050px',
      flexGrow: 1, // [추가] 남은 공간 모두 차지
      padding: spacing.md,
      fontSize: fontSize.medium,
      border: `1px solid ${colors.lightGray}`,
      borderRadius: borderRadius.small,
      resize: 'none', // [수정] 크기 조절 비활성화
      marginBottom: spacing.sm,
      fontFamily: 'inherit',
      alignSelf: 'center', // [추가] 가로 중앙 정렬
    },
    charCount: {
      textAlign: 'right',
      fontSize: fontSize.small,
      color: colors.mediumGray,
      marginBottom: spacing.lg,
      width: '1000px', // [추가] textarea와 너비 맞춤
      alignSelf: 'center', // [추가] 가로 중앙 정렬
      flexShrink: 0, // [추가] 글자 수 영역 크기 고정
    },
    buttonContainer: {
      textAlign: 'center', // [수정] 버튼 중앙 정렬
      marginTop: 'auto', // [추가] 버튼을 맨 아래로 밀기
      paddingBottom: spacing.lg, // [추가] 하단 여백
      flexShrink: 0, // [추가] 버튼 영역 크기 고정
    },
    submitButtonBase: {
      ...commonStyles.button,
      // 👇 [수정] 등록 버튼 크기 고정
      width: '1080px',
      height: '50px',
      fontSize: '18px',
      color: '#fff',
      border: 'none',
      cursor: 'not-allowed',
      opacity: 0.7,
      transition: 'background-color 0.3s ease, opacity 0.3s ease',
      display: 'flex', // [추가] Flexbox 사용
      alignItems: 'center', // [추가] 텍스트 세로 중앙 정렬
      justifyContent: 'center', // [추가] 텍스트 가로 중앙 정렬
      margin: '0 auto', // [추가] 버튼 자체를 중앙 정렬
      padding: '0',
    },
  };

  const hasText = reviewText?.trim() !== '';

  const dynamicButtonStyle = {
    ...styles.submitButtonBase,
    backgroundColor: hasText ? '#DB6666' : '#cccccc',
    cursor: hasText ? 'pointer' : 'not-allowed',
    opacity: hasText ? 1 : 0.7,
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.contentContainer}>
        <h1 style={styles.title}>{review?.movieTitle}</h1>
        <div style={styles.ratingContainer}>
          <span style={styles.ratingLabel}>별점 선택:</span>
          <div
            style={styles.starsWrapper}
            onMouseLeave={() => setHoverRating(0)}
          >
            {[1, 2, 3, 4, 5].map((starIndex) => {
              const isFilled = starIndex <= (hoverRating || rating);
              return (
                <span
                  key={starIndex}
                  style={{
                    ...styles.star,
                    ...(isFilled ? styles.filledStar : {}),
                  }}
                  onClick={() => setRating(starIndex)}
                  onMouseEnter={() => setHoverRating(starIndex)}
                >
                  ★
                </span>
              );
            })}
          </div>
          <span style={{ color: colors.mediumGray, fontSize: fontSize.medium }}>
            ({rating} / 5)
          </span>
        </div>

        {/*<p style={styles.infoText}>
          감상 후기는 최대 {MAX_LENGTH}자까지 등록 가능합니다. 영화와 관련 없는 내용은 임의로 삭제될 수 있습니다.
        </p>
        */}
        <textarea
          style={styles.textarea}
          placeholder={`감상 후기는 최대 ${MAX_LENGTH}자까지 등록 가능합니다. 영화와 관련 없는 내용은 임의로 삭제될 수 있습니다.`}
          value={reviewText}
          onChange={handleTextChange}
        />
        <div style={styles.charCount}>
          {reviewText?.length} / {MAX_LENGTH} 자
        </div>

        <div style={styles.buttonContainer}>
          <button
            style={dynamicButtonStyle}
            onClick={handleSubmit}
            disabled={!hasText}
          >
            수정하기
          </button>
        </div>
      </div>
    </div>
  );
}
