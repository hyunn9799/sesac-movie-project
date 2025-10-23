'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/auth/AuthContext';
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  commonStyles,
} from '@/lib/style/styles';

export default function ReviewButton({ movieId, movieTitle, styles }) {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReviewClick = () => {
    if (!user) {
      setIsModalOpen(true); // Show popup if not logged in
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {user && (
        <Link
          href={`/review/write?movieId=${movieId}&movieTitle=${movieTitle}`}
        >
          <button style={styles.reviewButton}>작성하기</button>
        </Link>
      )}

      {/* Popup Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button style={styles.modalCloseButton} onClick={closeModal}>
              &times;
            </button>
            <h2 style={{ ...styles.sectionTitle, textAlign: 'center' }}>
              로그인 필요
            </h2>
            <p style={{ ...styles.description, textAlign: 'center' }}>
              리뷰를 작성하려면 로그인이 필요합니다. 로그인 페이지로
              이동하시겠습니까?
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: spacing.md,
                marginTop: spacing.lg,
              }}
            >
              <Link href="/login">
                <button
                  style={{
                    ...styles.reviewButton,
                    padding: `${spacing.sm} ${spacing.md}`,
                  }}
                >
                  확인
                </button>
              </Link>
              <button
                style={{
                  ...styles.reviewButton,
                  backgroundColor: colors.mediumGray,
                  padding: `${spacing.sm} ${spacing.md}`,
                }}
                onClick={closeModal}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
