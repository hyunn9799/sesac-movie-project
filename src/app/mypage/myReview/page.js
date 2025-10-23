'use client';

import Link from 'next/link';
import React, { useEffect, useState, useCallback } from 'react';

// =========================================================================
// 🎨 [MOCK] 스타일 가이드 (ReviewWritePage.jsx와 일관성을 위해 임시 정의)
// =========================================================================
const colors = {
  dark: '#1e1e3f',
  white: '#ffffff',
  textPrimary: '#f4f4f4',
  mediumGray: '#6c757d',
  lightGray: '#dee2e6',
  accent: '#DB6666',
  error: '#dc3545',
};

const spacing = {
  sm: '8px',
  md: '12px',
  lg: '20px',
  xl: '28px',
  xxl: '60px',
};

const fontSize = {
  small: '14px',
  medium: '16px',
  large: '18px',
  xlarge: '24px',
  xxlarge: '32px',
};

const fontWeight = {
  bold: '700',
};

const borderRadius = {
  small: '4px',
  medium: '8px',
};

const commonStyles = {
  card: {
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
  },
  button: {
    padding: '10px 20px',
    borderRadius: borderRadius.medium,
    transition: 'background-color 0.3s ease, transform 0.1s ease',
  },
};

const styles = {
  pageWrapper: {
    background:
      'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    color: 'white',
    minHeight: '100vh',
    padding: '60px 0',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  contentContainer: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 20px',
  },
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
    color: 'white', // Added to ensure visibility
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
  reviewList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
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
  },
};

// =========================================================================
// 🧩 [수정] 모달 컴포넌트 추가 (alert() 대체)
// =========================================================================
const CustomModal = ({
  isOpen,
  message,
  onClose,
  onConfirm,
  showConfirm = false,
  confirmText = '확인',
  cancelText = '취소',
}) => {
  if (!isOpen) return null;

  const modalStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const contentStyles = {
    backgroundColor: colors.white,
    color: colors.dark,
    padding: spacing.xl,
    borderRadius: borderRadius.medium,
    maxWidth: '400px',
    textAlign: 'center',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    animation: 'fadeIn 0.3s ease-out',
  };

  const buttonBaseStyle = {
    ...commonStyles.button,
    marginTop: spacing.lg,
    border: 'none',
    cursor: 'pointer',
    padding: '10px 30px',
    fontWeight: '600',
    minWidth: '100px',
  };

  const confirmButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: colors.accent,
    color: colors.white,
    marginLeft: showConfirm ? spacing.md : '0',
  };

  const cancelButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: colors.lightGray,
    color: colors.dark,
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div style={modalStyles}>
      <div style={contentStyles}>
        <p
          style={{
            fontSize: fontSize.large,
            marginBottom: spacing.lg,
            whiteSpace: 'pre-wrap',
          }}
        >
          {message}
        </p>
        <div
          style={{ display: 'flex', justifyContent: 'center', gap: spacing.md }}
        >
          <button style={cancelButtonStyle} onClick={onClose}>
            {cancelText}
          </button>
          {showConfirm && (
            <button style={confirmButtonStyle} onClick={handleConfirm}>
              {confirmText}
            </button>
          )}
        </div>
      </div>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

// =========================================================================

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
const ReviewItem = ({ review, onEdit, onDelete }) => {
  const [isEditHovered, setIsEditHovered] = useState(false);
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);

  const id = review.movieId;
  const movieTitle = review.movieTitle;
  const reviewId = review.id;

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
          onClick={() => onEdit(review)}
        >
          <Link
            href={`/review/edit?movieId=${id}&movieTitle=${movieTitle}&reviewId=${reviewId}`}
            style={{ textDecoration: 'none', color: 'white' }}
          >
            ✏️ 리뷰 수정
          </Link>
        </button>
        <button
          style={deleteButtonStyle}
          onMouseEnter={() => setIsDeleteHovered(true)}
          onMouseLeave={() => setIsDeleteHovered(false)}
          onClick={() => onDelete(review.id)}
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
  const [isBackHovered, setIsBackHovered] = useState(false);
  const [reviews, setMyReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalAction, setModalAction] = useState(null);
  const [isConfirmModal, setIsConfirmModal] = useState(false);

  const loadReviews = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const reviewData = JSON.parse(
          localStorage.getItem('myReviews') || '[]'
        );
        setMyReviews(reviewData);
      } catch (e) {
        console.error('Local Storage 파싱 오류:', e);
        setMyReviews([]);
      }
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  //const handleEdit = (review) => {
  //  if (typeof window !== 'undefined') {
  //    const url = `/review/edit?movieId=${review.movieId}&movieTitle=${
  //      review.movieTitle
  //    }&reviewId=${review.id}&content=${encodeURIComponent(review.content)}`;
  //    console.log(`[EDIT] Navigating to: ${url}`);
  //    setModalMessage(
  //      `리뷰 수정 페이지로 이동을 시뮬레이션합니다.\n\n편집 URL 쿼리:\n${url}`
  //    );
  //    setIsConfirmModal(false);
  //    setIsModalOpen(true);
  //  }
  //};

  const handleDelete = (reviewId) => {
    const deleteAction = () => {
      if (typeof window !== 'undefined') {
        try {
          const existingReviews = JSON.parse(
            localStorage.getItem('myReviews') || '[]'
          );
          const updatedReviews = existingReviews.filter(
            (review) => review.id !== reviewId
          );
          localStorage.setItem('myReviews', JSON.stringify(updatedReviews));
          setMyReviews(updatedReviews);
          setModalMessage('리뷰가 성공적으로 삭제되었습니다.');
          setIsConfirmModal(false);
          setIsModalOpen(true);
        } catch (e) {
          console.error('리뷰 삭제 중 오류 발생:', e);
          setModalMessage('리뷰 삭제 중 오류가 발생했습니다.');
          setIsConfirmModal(false);
          setIsModalOpen(true);
        }
      }
    };
    setModalMessage('정말로 이 리뷰를 삭제하시겠습니까?');
    setModalAction(() => deleteAction);
    setIsConfirmModal(true);
    setIsModalOpen(true);
  };

  const handleBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalAction(null);
    setIsConfirmModal(false);
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
            🎬 내가 작성한 리뷰{' '}
            <span style={styles.reviewCount}>({reviews?.length || 0})</span>
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
        <div style={styles.reviewList}>
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                // onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <p style={styles.noReviewText}>아직 작성된 리뷰가 없습니다. 📝</p>
          )}
        </div>
      </div>
      <CustomModal
        isOpen={isModalOpen}
        message={modalMessage}
        onClose={handleModalClose}
        onConfirm={modalAction || (() => {})}
        showConfirm={isConfirmModal}
        confirmText={isConfirmModal ? '삭제' : '확인'}
        cancelText={isConfirmModal ? '취소' : '닫기'}
      />
    </div>
  );
}
