'use client';

import React, { useState } from 'react'; // useEffect 제거
import { useRouter, useSearchParams } from 'next/navigation';

// 팀 스타일 가이드 임포트
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
  const movieId = searchParams.get('movieId');
  const movieTitle = searchParams.get('movieTitle'); // 영화 제목 (선택 사항)

  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false); // isEditing 상태 제거
  const MAX_LENGTH = 1000;

  // useEffect (수정 관련) 제거됨

  const handleTextChange = (event) => {
    const text = event.target.value;
    if (text.length <= MAX_LENGTH) {
      setReviewText(text);
    }
  };

  // handleSubmit 함수 (새 글 작성 로직만 남김)
  const handleSubmit = () => {
    if (isSubmitting) return;

    if (rating === 0) {
      alert('별점을 선택해주세요.');
      return;
    }
    if ((reviewText || '').trim() === '') {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const loggedInUser = localStorage.getItem('loggedInUser') || '나';
      const allReviews = JSON.parse(localStorage.getItem('myReviews') || '[]');

      // 새 리뷰 객체 생성
      const newReview = {
        id: Date.now(),
        movieId: movieId,
        movieTitle: movieTitle || null, // 영화 제목 추가 (없으면 null)
        userName: loggedInUser,
        rating: rating,
        content: (reviewText || '').trim(),
        likes: 0,
        date: new Date().toISOString().split('T')[0],
        isVerified: false,
      };
      // 새 리뷰를 배열 맨 앞에 추가
      const updatedReviews = [newReview, ...allReviews];

      localStorage.setItem('myReviews', JSON.stringify(updatedReviews));
      alert('리뷰가 브라우저에 임시 저장되었습니다!');

      // 저장 후 영화 상세 페이지로 이동 (movieId가 있을 경우)
      if (movieId) {
        router.push(`/movieInfo/${movieId}`);
      } else {
        router.push('/mypage/reviews'); // movieId 없으면 내 리뷰 목록으로
      }
    } catch (error) {
      console.error('LocalStorage 저장 중 오류 발생:', error);
      alert('리뷰 저장에 실패했습니다.');
      setIsSubmitting(false); // 오류 시 상태 해제
    }
  };

  // styles 객체 (수정 관련 스타일 제거됨, 이전 코드와 거의 동일)
  const styles = {
    pageWrapper: {
      backgroundColor: colors.dark,
      color: colors.textPrimary || 'white',
      minHeight: 'calc(100vh - 160px)',
      padding: `${spacing.xxl} 0`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentContainer: {
      backgroundColor: colors.white,
      color: colors.dark,
      borderRadius: borderRadius.medium,
      padding: spacing.xl,
      width: '1100px', // 가로 크기
      height: '500px', // 세로 크기
      boxShadow: commonStyles.card?.boxShadow || '0 4px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      fontSize: fontSize.xxlarge,
      fontWeight: fontWeight.bold,
      color: colors.dark,
      marginBottom: spacing.lg,
      paddingBottom: spacing.md,
      borderBottom: `1px solid ${colors.lightGray}`,
      flexShrink: 0,
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
    textarea: {
      width: '1050px',
      flexGrow: 1,
      // height: '300px', // flexGrow 사용 시 height 제거 또는 auto
      padding: spacing.md,
      fontSize: fontSize.medium,
      border: `1px solid ${colors.lightGray}`,
      borderRadius: borderRadius.small,
      resize: 'none',
      marginBottom: spacing.sm,
      fontFamily: 'inherit',
      alignSelf: 'center',
    },
    charCount: {
      textAlign: 'right',
      fontSize: fontSize.small,
      color: colors.mediumGray,
      marginBottom: spacing.lg,
      width: '1050px',
      alignSelf: 'center',
      flexShrink: 0,
    },
    buttonContainer: {
      textAlign: 'center',
      marginTop: 'auto',
      paddingBottom: spacing.lg,
      flexShrink: 0,
    },
    submitButtonBase: {
      ...commonStyles.button,
      width: '1080px',
      height: '50px',
      fontSize: '18px',
      color: '#fff',
      border: 'none',
      cursor: 'not-allowed',
      opacity: 0.7,
      transition: 'background-color 0.3s ease, opacity 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto',
      padding: '0',
      backgroundColor: '#cccccc',
    },
  };

  const hasText = (reviewText || '').trim() !== '';

  const dynamicButtonStyle = {
    ...styles.submitButtonBase,
    backgroundColor: hasText && rating > 0 ? '#DB6666' : '#cccccc',
    cursor: hasText && rating > 0 ? 'pointer' : 'not-allowed',
    opacity: hasText && rating > 0 ? 1 : 0.7,
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.contentContainer}>
        {/* 제목 (수정 관련 조건 제거) */}
        <h1 style={styles.title}>감상 후기 작성</h1>

        {/* 별점 UI */}
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

        {/* 텍스트 영역 */}
        <textarea
          style={styles.textarea}
          placeholder={`감상 후기는 최대 ${MAX_LENGTH}자까지 등록 가능합니다. 영화와 관련 없는 내용은 임의로 삭제될 수 있습니다.`}
          value={reviewText}
          onChange={handleTextChange}
        />
        <div style={styles.charCount}>
          {reviewText.length} / {MAX_LENGTH} 자
        </div>

        {/* 버튼 */}
        <div style={styles.buttonContainer}>
          <button
            style={dynamicButtonStyle}
            onClick={handleSubmit}
            disabled={!hasText || rating === 0 || isSubmitting}
          >
            {/* 버튼 텍스트 (수정 관련 조건 제거) */}
            {isSubmitting ? '등록 중...' : '등록하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
