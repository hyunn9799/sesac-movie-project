'use client'; 

// 1. useEffect 임포트 추가
import React, { useState, useEffect } from 'react'; 
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
  // 2. editReviewId 가져오기 추가
  const editReviewId = searchParams.get('editReviewId'); 

  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0); 
  const [hoverRating, setHoverRating] = useState(0); 
  // 3. isEditing, isSubmitting 상태 선언 확인 (이미 코드에 있음)
  const [isEditing, setIsEditing] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const MAX_LENGTH = 1000;

  // 4. useEffect 추가 (수정 시 데이터 로드)
  useEffect(() => {
    if (editReviewId && typeof window !== 'undefined') {
      setIsEditing(true); // 수정 모드임을 먼저 설정
      try {
        const allReviews = JSON.parse(localStorage.getItem('myReviews') || '[]');
        const reviewToEdit = allReviews.find(r => String(r.id) === String(editReviewId));
        if (reviewToEdit) {
          setReviewText(String(reviewToEdit.content || '')); // 문자열 보장
          setRating(reviewToEdit.rating || 0); 
        } else {
          // console.warn('수정할 리뷰를 찾을 수 없습니다.'); 
          // 필요 시 사용자에게 알림
        }
      } catch (error) {
          console.error("수정할 리뷰 로딩 오류:", error);
      }
    }
  }, [editReviewId]); // editReviewId가 변경될 때 실행

  const handleTextChange = (event) => {
    const text = event.target.value;
    if (text.length <= MAX_LENGTH) {
      setReviewText(text);
    }
  };

  // 5. handleSubmit 함수 정리 (중복 제거)
  const handleSubmit = () => {
    if (isSubmitting) return; 

    if (rating === 0) {
        alert('별점을 선택해주세요.');
        return;
    }
    if ((reviewText || '').trim() === '') { // 안전한 trim() 호출
        alert('리뷰 내용을 입력해주세요.');
        return;
    }

    setIsSubmitting(true);

    try {
      const loggedInUser = localStorage.getItem('loggedInUser') || '나'; 
      const allReviews = JSON.parse(localStorage.getItem('myReviews') || '[]');
      let updatedReviews;

      if (isEditing) { 
        updatedReviews = allReviews.map(review => {
          if (String(review.id) === String(editReviewId)) {
            return { 
              ...review, 
              content: (reviewText || '').trim(), // 안전하게 trim
              rating: rating, 
              date: new Date().toISOString().split('T')[0],
             };
          }
          return review;
        });
        alert('리뷰가 수정되었습니다!');
      } else { 
        const newReview = { 
            id: Date.now(), 
            movieId: movieId, 
            userName: loggedInUser, 
            rating: rating, 
            content: (reviewText || '').trim(), // 안전하게 trim
            likes: 0, 
            date: new Date().toISOString().split('T')[0], 
            isVerified: false,
         };
        updatedReviews = [newReview, ...allReviews];
        alert('리뷰가 브라우저에 임시 저장되었습니다!');
      }
      
      localStorage.setItem('myReviews', JSON.stringify(updatedReviews));
      router.push(movieId ? `/movieInfo/${movieId}` : '/mypage/reviews');

    } catch (error) {
      console.error("LocalStorage 저장/수정 중 오류 발생:", error);
      alert("리뷰 저장/수정에 실패했습니다.");
      setIsSubmitting(false); // 오류 시 상태 해제
    }
    // 중복된 저장 로직 제거됨
  };

  // 6. styles 객체 정리 (중복 제거 및 통합)
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
    // infoText는 placeholder로 대체되었으므로 제거 가능 (필요시 복구)
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
      flexGrow: 1, // 남은 공간 차지
      height: '300px', // 고정 높이 지정 (flexGrow와 같이 사용 시 주의) -> flexGrow: 1로 대체 가능
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
      width: '1050px', // textarea 너비와 맞춤
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
      backgroundColor: '#cccccc', // 비활성 기본 배경색
    },
  };

  const hasText = (reviewText || '').trim() !== '';

  const dynamicButtonStyle = {
    ...styles.submitButtonBase,
    backgroundColor: hasText && rating > 0 ? '#DB6666' : '#cccccc', // 활성화 조건 수정
    cursor: hasText && rating > 0 ? 'pointer' : 'not-allowed',
    opacity: hasText && rating > 0 ? 1 : 0.7,
  };

  // 7. return 문 정리 (중복 제거)
  return (
    <div style={styles.pageWrapper}>
      <div style={styles.contentContainer}>
        <h1 style={styles.title}>
          {isEditing ? '감상 후기 수정' : '감상 후기 작성'}
        </h1>
        
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
                  style={{ ...styles.star, ...(isFilled ? styles.filledStar : {}) }}
                  onClick={() => setRating(starIndex)} 
                  onMouseEnter={() => setHoverRating(starIndex)} 
                >
                  ★
                </span>
              );
            })}
          </div>
          <span style={{ color: colors.mediumGray, fontSize: fontSize.medium }}>({rating} / 5)</span>
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
            disabled={!hasText || rating === 0 || isSubmitting} // disabled 조건 확인
          >
            {isSubmitting ? (isEditing ? '수정 중...' : '등록 중...') : (isEditing ? '수정하기' : '등록하기')}
          </button>
        </div>
      </div>
    </div>
  );
  // 중복된 return 문 제거됨
}