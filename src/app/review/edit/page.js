'use client'; 

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; 

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
    const movieTitle = searchParams.get('movieTitle'); 
    const reviewId = searchParams.get('reviewId');

    const [review, setReview] = useState([]);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState();
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false); 

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

    useEffect(() => {
        if (!review) return;

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
        const savedReviews = JSON.parse(localStorage.getItem('myReviews') || '[]');

        const reviewIdNumber = Number(reviewId);

        const updatedReviews = savedReviews.map((review) =>
            review.id === reviewIdNumber 
                ? { ...review, content: reviewText, rating: rating , data : new Date().toISOString().split('T')[0]}
                : review
        );
        localStorage.setItem('myReviews', JSON.stringify(updatedReviews));

        alert(
            `리뷰 내용이 수정되었습니다! (영화 ID: ${movieId})\n새 내용: ${reviewText.substring(
                0,
                50
            )}...`
        );
        if (movieId) {
            router.back();
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
            alignItems: 'center', 
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
            flexShrink: 0, 
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
