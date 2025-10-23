'use client'; 

import React, { useState } from 'react';

// =========================================================================
// 💡 목업(Mock) 데이터: 사용자가 작성한 리뷰 목록
// =========================================================================
const MOCK_REVIEWS = [
    {
        id: 101,
        movieTitle: "범죄도시 4",
        rating: 5,
        content: "마동석의 시원한 액션이 최고! 스트레스가 확 풀리는 영화입니다. 기대했던 것보다 훨씬 더 재미있었습니다.",
        date: "2025.09.28",
    },
    {
        id: 102,
        movieTitle: "파묘",
        rating: 4,
        content: "기대했던 것보다 더 몰입감 있었습니다. 긴장감이 대단하네요. 배우들의 연기가 정말 일품이었습니다.",
        date: "2025.08.15",
    },
    {
        id: 103,
        movieTitle: "모던 타임즈",
        rating: 5,
        content: "고전 명작은 역시 다르네요. 시대를 초월하는 메시지가 인상적입니다.",
        date: "2025.07.01",
    },
];

/**
 * 인라인 SVG 별 아이콘 컴포넌트
 */
const StarIcon = ({ style }) => (
    <svg 
        style={{ ...style, width: '1em', height: '1em', display: 'block' }}
        viewBox="0 0 24 24" 
        fill="currentColor"
    >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);


/**
 * 별점 아이콘을 렌더링하는 컴포넌트
 * @param {number} rating - 1부터 5까지의 평점
 */
const RatingDisplay = ({ rating }) => {
    const totalStars = 5;

    return (
        <div style={styles.ratingContainer}>
            {Array.from({ length: totalStars }, (_, index) => {
                const isFilled = index < rating;
                const starStyle = isFilled ? styles.fullStar : styles.emptyStar;
                return <StarIcon style={starStyle} key={index} />;
            })}
        </div>
    );
};

/**
 * 개별 리뷰 아이템 컴포넌트
 */
const ReviewItem = ({ review }) => {
    const [isEditHovered, setIsEditHovered] = useState(false);
    const [isDeleteHovered, setIsDeleteHovered] = useState(false);
    const [isCardHovered, setIsCardHovered] = useState(false);

    const editButtonStyle = {
        ...styles.actionButton,
        ...(isEditHovered ? styles.actionButtonHover : {}),
    };
    const deleteButtonStyle = {
        ...styles.actionButtonDanger,
        ...(isDeleteHovered ? styles.actionButtonDangerHover : {}),
    };
    const cardStyle = {
        ...styles.reviewItem,
        ...(isCardHovered ? styles.reviewItemHover : {}),
    };

    return (
        <div 
            style={cardStyle}
            onMouseEnter={() => setIsCardHovered(true)}
            onMouseLeave={() => setIsCardHovered(false)}
        >
            <div style={styles.reviewHeader}>
                <div style={styles.reviewTitleBox}>
                    <h3 style={styles.movieTitle}>{review.movieTitle}</h3>
                    <RatingDisplay rating={review.rating} />
                </div>
                <p style={styles.reviewDate}>작성일: {review.date}</p>
            </div>
            
            <p style={styles.reviewContent}>{review.content}</p>

            <div style={styles.reviewActions}>
                <button 
                    style={editButtonStyle}
                    onMouseEnter={() => setIsEditHovered(true)}
                    onMouseLeave={() => setIsEditHovered(false)}
                    onClick={() => console.log('Edit clicked for review:', review.id)}
                >
                    ✏️ 리뷰 수정
                </button>
                <button 
                    style={deleteButtonStyle}
                    onMouseEnter={() => setIsDeleteHovered(true)}
                    onMouseLeave={() => setIsDeleteHovered(false)}
                    onClick={() => console.log('Delete clicked for review:', review.id)} 
                >
                    🗑️ 리뷰 삭제
                </button>
            </div>
        </div>
    );
};


/**
 * 메인 페이지 컴포넌트: 작성한 리뷰 목록
 */
export default function MyReviewsPage() {
    const reviews = MOCK_REVIEWS;
    const [isBackHovered, setIsBackHovered] = useState(false);

    const handleBack = () => {
        if (typeof window !== 'undefined') {
            window.history.back();
        }
    };

    const backButtonStyle = {
        ...styles.backButton,
        ...(isBackHovered ? styles.backButtonHover : {}),
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.contentContainer}>
                <div style={styles.header}>
                    <h1 style={styles.title}>
                        🎬 내가 작성한 리뷰 <span style={styles.reviewCount}>({reviews.length})</span>
                    </h1>
                    <button 
                        style={backButtonStyle}
                        onClick={handleBack}
                        onMouseEnter={() => setIsBackHovered(true)}
                        onMouseLeave={() => setIsBackHovered(false)}
                    >
                        ← 돌아가기
                    </button>
                </div>

                {/* 리뷰 목록 렌더링 */}
                <div style={styles.reviewList}>
                    {reviews.length > 0 ? (
                        reviews.map(review => (
                            <ReviewItem key={review.id} review={review} />
                        ))
                    ) : (
                        <p style={styles.noReviewText}>아직 작성된 리뷰가 없습니다. 📝</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// =========================================================================
// 🎨 스타일 정의
// =========================================================================

const styles = {
    // 1. 전체 페이지 래퍼
    pageWrapper: {
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        color: 'white',
        minHeight: '100vh',
        padding: '60px 0',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },

    // 2. 콘텐츠 컨테이너
    contentContainer: {
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 20px',
    },
    
    // 3. 헤더 및 제목
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        paddingBottom: '20px',
        borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
    },
    title: {
        fontSize: '36px',
        fontWeight: '700',
        margin: '0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    reviewCount: {
        fontSize: '28px',
        opacity: 0.8,
    },
    backButton: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        fontSize: '15px',
        cursor: 'pointer',
        borderRadius: '25px',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
        fontWeight: '600',
    },
    backButtonHover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
    },

    // 4. 리뷰 목록
    reviewList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    
    // 5. 개별 리뷰 아이템
    reviewItem: {
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '30px',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
    },
    reviewItemHover: {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    reviewHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '15px',
        marginBottom: '20px',
    },
    reviewTitleBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    movieTitle: {
        fontSize: '24px',
        margin: '0',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontWeight: '700',
    },
    reviewDate: {
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.6)',
        margin: '0',
        fontWeight: '500',
    },
    reviewContent: {
        fontSize: '16px',
        lineHeight: '1.8',
        color: 'rgba(255, 255, 255, 0.85)',
        marginBottom: '25px',
        fontWeight: '400',
    },

    // 6. 별점 스타일
    ratingContainer: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '22px',
        gap: '4px',
    },
    fullStar: {
        color: '#FFD700',
        filter: 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.5))',
    },
    emptyStar: {
        color: 'rgba(255, 255, 255, 0.2)',
    },

    // 7. 버튼 섹션
    reviewActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
    },
    actionButton: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        fontSize: '14px',
        cursor: 'pointer',
        borderRadius: '20px',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
        fontWeight: '600',
    },
    actionButtonHover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
    },
    actionButtonDanger: {
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        fontSize: '14px',
        cursor: 'pointer',
        borderRadius: '20px',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(245, 87, 108, 0.3)',
        fontWeight: '600',
    },
    actionButtonDangerHover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(245, 87, 108, 0.5)',
    },
    noReviewText: {
        fontSize: '18px',
        color: 'rgba(255, 255, 255, 0.5)',
        textAlign: 'center',
        marginTop: '60px',
        fontWeight: '500',
    }
};