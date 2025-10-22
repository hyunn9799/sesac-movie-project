'use client';

import React, { useState } from 'react';

// 개별 리뷰 아이템을 관리하는 컴포넌트
function ReviewItem({ review, styles }) {
  // 'isExpanded' (펼쳐짐) 상태를 각 리뷰 아이템이 개별적으로 관리합니다.
  const [isExpanded, setIsExpanded] = useState(false);

  // 이 길이(예: 100자)를 기준으로 "더보기"를 표시합니다.
  const TRUNCATE_LENGTH = 100;
  const isLong = review.content.length > TRUNCATE_LENGTH;

  // "더보기" 또는 "간략히" 버튼을 클릭했을 때의 핸들러
  const handleToggle = (e) => {
    // 이벤트가 부모로 전파되는 것을 막습니다 (필요시).
    e.stopPropagation();
    setIsExpanded(!isExpanded); // 상태를 반전시킵니다 (true -> false, false -> true)
  };

  // 리뷰 텍스트를 클릭했을 때 (더보기 버튼과 동일하게 작동)
  const handleTextClick = () => {
    if (isLong && !isExpanded) {
      setIsExpanded(true);
    }
  };

  return (
    <div style={styles.reviewItem}>
      <div style={styles.reviewUser}>{review.userName}</div>
      
      <p 
        // 긴 리뷰일 경우 클릭 가능하도록 스타일과 핸들러 적용
        style={isLong ? styles.reviewContentClickable : styles.reviewContent}
        onClick={handleTextClick}
      >
        {/* 긴 리뷰이면서 펼쳐지지 않았을 때만 텍스트를 자릅니다. */}
        {isLong && !isExpanded
          ? `${review.content.substring(0, TRUNCATE_LENGTH)}...`
          : review.content}
      </p>
      
      {/* 긴 리뷰일 경우에만 "더보기/간략히" 버튼을 보여줍니다. */}
      {isLong && (
        <button onClick={handleToggle} style={styles.readMoreButton}>
          {isExpanded ? '간략히' : '...더보기'}
        </button>
      )}
    </div>
  );
}

// 이 컴포넌트를 page.js에서 import합니다.
export default function ReviewList({ reviews, styles }) {
  return (
    <div style={styles.reviewList}>
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} styles={styles} />
      ))}
    </div>
  );
}