'use client'; // 👈 Form handling requires client component

import React, { useState } from 'react';
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

  const [reviewText, setReviewText] = useState('');
  const MAX_LENGTH = 1000;

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
    
    // --- 실제 데이터 저장 로직 ---
    // 1. 여기서 reviewText 와 movieId 를 서버로 보내 저장하는 API를 호출합니다.
    // 2. 저장이 성공하면 사용자에게 알림을 보여주고 이전 페이지나 마이페이지 등으로 이동시킵니다.
    // --------------------------

    console.log('Movie ID:', movieId); // 어떤 영화에 대한 리뷰인지 확인
    console.log('Review Content:', reviewText); // 작성된 내용 확인
    
    alert(`리뷰가 등록되었습니다! (영화 ID: ${movieId})\n내용: ${reviewText.substring(0, 50)}...`);
    
    // 예시: 등록 후 영화 상세 페이지로 돌아가기 (movieId가 있을 경우)
    if (movieId) {
      router.push(`/movieInfo/${movieId}`);
    } else {
      router.push('/'); // movieId 없으면 홈으로 (또는 마이페이지 등)
    }
  };

  // --- 스타일 정의 (image_debe15.png 기반) ---
  const styles = {
    pageWrapper: {
      backgroundColor: colors.dark,
      color: colors.textPrimary || 'white',
      minHeight: 'calc(100vh - 160px)', // 헤더/푸터 높이 제외 (대략적인 값)
      padding: `${spacing.xxl} 0`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start', // 상단 정렬
    },
    contentContainer: {
      backgroundColor: colors.white,
      color: colors.dark, // 흰 배경에는 어두운 텍스트
      borderRadius: borderRadius.medium,
      padding: spacing.xl,
      width: '90%',
      maxWidth: '800px', // 최대 너비 설정
      boxShadow: commonStyles.card?.boxShadow || '0 4px 8px rgba(0,0,0,0.1)', // 기본 그림자
    },
    title: {
      fontSize: fontSize.xxlarge,
      fontWeight: fontWeight.bold,
      color: colors.dark,
      marginBottom: spacing.lg,
      paddingBottom: spacing.md,
      borderBottom: `1px solid ${colors.lightGray}`,
    },
    infoText: {
      fontSize: fontSize.medium,
      color: colors.mediumGray,
      marginBottom: spacing.lg,
      padding: spacing.md,
      backgroundColor: '#f8f9fa', // 연한 회색 배경
      borderRadius: borderRadius.small,
    },
    textarea: {
      width: '100%',
      minHeight: '200px', // 최소 높이
      padding: spacing.md,
      fontSize: fontSize.medium,
      border: `1px solid ${colors.lightGray}`,
      borderRadius: borderRadius.small,
      resize: 'vertical', // 수직 크기 조절만 허용
      marginBottom: spacing.sm, // 글자 수 표시와의 간격
      fontFamily: 'inherit', // 기본 폰트 사용
    },
    charCount: {
      textAlign: 'right',
      fontSize: fontSize.small,
      color: colors.mediumGray,
      marginBottom: spacing.lg,
    },
    buttonContainer: {
      textAlign: 'right', // 버튼 오른쪽 정렬
    },
    submitButton: {
      ...commonStyles.button, // 기본 버튼 스타일
      ...commonStyles.buttonPrimary, // 기본 빨간색 버튼
      padding: `${spacing.md} ${spacing.xl}`, // 패딩 조정
      fontSize: fontSize.large,
    },
  };

  return (
    // Header와 Footer는 RootLayout에서 자동으로 추가됩니다.
    <div style={styles.pageWrapper}>
      <div style={styles.contentContainer}>
        <h1 style={styles.title}>감상 후기 작성</h1>
        
        <p style={styles.infoText}>
          감상 후기는 최대 {MAX_LENGTH}자까지 등록 가능합니다. 영화와 관련 없는 내용은 임의로 삭제될 수 있습니다.
        </p>

        <textarea
          style={styles.textarea}
          placeholder="여기에 영화 감상 후기를 작성해주세요..."
          value={reviewText}
          onChange={handleTextChange}
        />
        <div style={styles.charCount}>
          {reviewText.length} / {MAX_LENGTH} 자
        </div>

        <div style={styles.buttonContainer}>
          <button style={styles.submitButton} onClick={handleSubmit}>
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
}