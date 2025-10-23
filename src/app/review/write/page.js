'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  commonStyles,
} from '@/lib/style/styles';

// styles를 컴포넌트 밖으로 이동
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
  loadingContainer: {
    backgroundColor: colors.white,
    color: colors.dark,
    borderRadius: borderRadius.medium,
    padding: spacing.xl,
    textAlign: 'center',
  },
  contentContainer: {
    backgroundColor: colors.white,
    color: colors.dark,
    borderRadius: borderRadius.medium,
    padding: spacing.xl,
    width: '1100px',
    height: '500px',
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    fontSize: fontSize.medium,
    fontWeight: fontWeight.normal,
    color: colors.mediumGray,
  },
  textarea: {
    width: '1050px',
    flexGrow: 1,
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
    width: '1000px',
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
  },
};

export default function ReviewWritePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const movieId = searchParams.get('movieId');
  const movieTitle = searchParams.get('movieTitle');

  const [reviewText, setReviewText] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const MAX_LENGTH = 1000;
  const hasAlerted = useRef(false); // Track if alert has been shown

  // 로그인 여부 확인
  useEffect(() => {
    // Prevent multiple alerts in strict mode
    if (hasAlerted.current) return;

    const loggedInUser = localStorage.getItem('loggedInUser');
    const loggedInAdmin = localStorage.getItem('loggedInAdmin');

    if (loggedInUser) {
      // 일반 회원 로그인
      setCurrentUser(JSON.parse(loggedInUser));
    } else if (loggedInAdmin) {
      // 관리자 로그인
      setCurrentUser(JSON.parse(loggedInAdmin));
    } else {
      // 로그인 안 됨 - 로그인 페이지로 리다이렉트
      hasAlerted.current = true; // Set flag to prevent duplicate alerts
      alert('로그인이 필요한 서비스입니다.');
      router.push('/login');
    }

    // Cleanup to reset flag on unmount
    return () => {
      hasAlerted.current = false;
    };
  }, [router]);

  const handleTextChange = (event) => {
    const text = event.target.value;
    if (text.length <= MAX_LENGTH) {
      setReviewText(text);
    }
  };

  const handleSubmit = () => {
    if (reviewText.trim() === '') {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    if (!currentUser) {
      alert('로그인 정보를 확인할 수 없습니다.');
      return;
    }

    // 로그인한 사용자 정보로 리뷰 저장
    const savedReviews = JSON.parse(localStorage.getItem('myReviews') || '[]');
    const newReview = {
      id: Date.now(),
      movieId: movieId,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      rating: 0,
      movieTitle: movieTitle,
      content: reviewText,
      likes: 0,
      date: new Date().toISOString().split('T')[0],
      isVerified: true,
    };
    const updatedReviews = [newReview, ...savedReviews];
    localStorage.setItem('myReviews', JSON.stringify(updatedReviews));

    alert(`리뷰가 등록되었습니다!`);

    if (movieId) {
      router.push(`/movieInfo/${movieId}`);
    } else {
      router.push('/');
    }
  };

  // 로그인 확인 중일 때는 로딩 표시
  if (!currentUser) {
    return (
      <div style={styles.pageWrapper}>
        <div style={styles.loadingContainer}>
          <p>로그인 정보를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  const hasText = reviewText.trim() !== '';

  const dynamicButtonStyle = {
    ...styles.submitButtonBase,
    backgroundColor: hasText ? '#DB6666' : '#cccccc',
    cursor: hasText ? 'pointer' : 'not-allowed',
    opacity: hasText ? 1 : 0.7,
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.contentContainer}>
        <h1 style={styles.title}>
          <span>감상 후기 작성</span>
          <span style={styles.userInfo}>작성자: {currentUser.name}</span>
        </h1>

        <textarea
          style={styles.textarea}
          placeholder={`감상 후기는 최대 ${MAX_LENGTH}자까지 등록 가능합니다. 영화와 관련 없는 내용은 임의로 삭제될 수 있습니다.`}
          value={reviewText}
          onChange={handleTextChange}
        />
        <div style={styles.charCount}>
          {reviewText.length} / {MAX_LENGTH} 자
        </div>

        <div style={styles.buttonContainer}>
          <button
            style={dynamicButtonStyle}
            onClick={handleSubmit}
            disabled={!hasText}
          >
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
}
