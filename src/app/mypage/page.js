'use client';

import React, { useEffect } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGenreStore } from './_component/GenreStoreContext';

// 1. 🎈 ProfileIcon
const ProfileIcon = () => <div style={styles.profileIcon}>🌱</div>;

const arrayToGenreString = (arr) => arr.join(', ');

// 2. 🎈 HoverButton 컴포넌트
const HoverButton = ({ onClick, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    background: isHovered
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    border: isHovered ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
    padding: '8px 16px',
    cursor: 'pointer',
    borderRadius: '20px',
    transition: 'all 0.3s ease',
    fontWeight: '600',
    fontSize: '13px',
    boxShadow: isHovered ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none',
  };

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};

// 3. 🎈 WithdrawButton
const WithdrawButton = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    padding: '12px 20px',
    background: isHovered
      ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)'
      : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    fontWeight: '600',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    width: '100%',
    boxSizing: 'border-box',
    fontSize: '14px',
    boxShadow: isHovered
      ? '0 6px 20px rgba(245, 87, 108, 0.5)'
      : '0 4px 15px rgba(245, 87, 108, 0.3)',
    transform: isHovered ? 'translateY(-2px)' : 'none',
  };

  return (
    <div style={{ ...styles.sectionItem, border: 'none', padding: '0px' }}>
      <button
        style={buttonStyle}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        탈퇴하기 😥
      </button>
    </div>
  );
};

// 4. 마이페이지 컴포넌트 (메인 로직)
export default function MyPage() {
  const [user, setUser] = useState(null);
  const [myReviews, setMyReviews] = useState([]); // ✅ 빈 배열로 초기화

  useEffect(() => {
    // 🔥 로그인한 사용자 정보 가져오기
    const userData = localStorage.getItem('loggedInUser');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // 🔥 리뷰 데이터 가져오기 (null 체크 추가!)
    const reviewData = localStorage.getItem('myReviews');
    if (reviewData) {
      try {
        const parsedReviews = JSON.parse(reviewData);
        setMyReviews(Array.isArray(parsedReviews) ? parsedReviews : []);
      } catch (error) {
        console.error('리뷰 데이터 파싱 오류:', error);
        setMyReviews([]);
      }
    } else {
      setMyReviews([]); // ✅ 데이터 없으면 빈 배열
    }

    console.log('userData:', userData);
    console.log('reviewData:', reviewData);
  }, []);

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const { favGenres, unfavGenres } = useGenreStore();

  const router = useRouter();

  const userData = {
    email: 'sesac1234@gmail.com',
    reviewCount: 0,
  };

  const handleProfileEdit = () => {
    router.push('/mypage/profileEdit');
  };

  const openWithdrawModal = () => {
    router.push('/mypage/withdraw');
  };

  // SettingItem 임시 Mock 컴포넌트
  const SettingItem = ({
    label,
    value,
    isLink = false,
    linkText = '',
    routePath,
    customAction,
  }) => {
    const [isHovered, setIsHovered] = useState(false);

    const itemStyles = {
      ...settingItemStyles.settingItem,
      padding: '16px 20px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      transition: 'all 0.2s ease',
      backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
    };
    const labelStyle = {
      ...settingItemStyles.settingLabel,
      fontSize: '14px',
      fontWeight: '500',
      color: 'rgba(255, 255, 255, 0.7)',
    };
    const valueStyle = {
      ...settingItemStyles.settingValue,
      fontSize: '14px',
      fontWeight: '600',
      color: 'rgba(255, 255, 255, 0.95)',
    };
    const linkStyle = {
      ...settingItemStyles.linkText,
      fontSize: '13px',
      marginLeft: '12px',
      color: '#667eea',
      fontWeight: '600',
    };

    const handleClick = () => {
      if (routePath) router.push(routePath);
      else if (customAction) customAction();
    };

    return (
      <div
        style={itemStyles}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={labelStyle}>{label}</div>
        <div style={valueStyle}>
          {value}
          {isLink && (
            <span
              style={linkStyle}
              onClick={routePath || customAction ? handleClick : undefined}
            >
              {linkText}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div style={containerStyle}>
        <div style={overlayStyle}></div>

        <div style={styles.contentBox}>
          <div style={styles.content}>
            <div style={styles.profileHeader}>
              <h2 style={styles.title}>내 프로필</h2>
              <HoverButton onClick={handleProfileEdit}>
                ✏️ 프로필 수정
              </HoverButton>
            </div>

            <div style={styles.profileContainer}>
              {/* ProfileIcon 컴포넌트 */}
              <ProfileIcon />

              {/* 사용자 이름 (span 태그) */}
              <span style={styles.liltitle}>{user?.name || '사용자'}</span>
            </div>

            {/* 계정 Section */}
            <h3 style={styles.sectionTitle}>계정</h3>
            <div style={styles.sectionBox}>
              <SettingItem label="이메일" value={user?.email || '-'} />
              <SettingItem
                label="비밀번호"
                value=""
                isLink={true}
                linkText="비밀번호 변경"
                routePath="/mypage/changePwd"
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '30px',
              }}
            >
              <h3 style={styles.sectionTitle}>장르</h3>
              <HoverButton onClick={handleProfileEdit}>
                ✏️ 장르 수정
              </HoverButton>
            </div>
            <div style={styles.sectionBox}>
              <SettingItem
                label="선호 장르"
                value={arrayToGenreString(favGenres)}
                isLink={true}
              />
              <SettingItem
                label="비선호 장르"
                value={arrayToGenreString(unfavGenres)}
                isLink={true}
              />
            </div>

            {/* 리뷰 관리 Section */}
            <h3 style={styles.sectionTitle}>
              리뷰 관리 / 작성한 리뷰 : {myReviews?.length || 0}개
            </h3>
            <div style={styles.sectionBox}>
              <SettingItem
                label="작성한 리뷰"
                value={`${myReviews?.length || 0}개`}
                isLink={true}
                linkText="보기"
                routePath="/mypage/myReview"
              />
            </div>

            {/* 회원 탈퇴 Section */}
            <h3 style={styles.sectionTitle}>회원 탈퇴</h3>
            <div style={styles.sectionBox}>
              <WithdrawButton onClick={openWithdrawModal} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// 5. 🎈 인라인 스타일 정의 (MyPage 전용)
const containerStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  color: 'white',
  display: 'flex',
  justifyContent: 'center',
  padding: '0px',
  margin: '0px',
  position: 'relative',
};

// 6. 🎈 오버레이 스타일
const overlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background:
    'radial-gradient(circle at top right, rgba(102, 126, 234, 0.1), transparent 50%), radial-gradient(circle at bottom left, rgba(118, 75, 162, 0.1), transparent 50%)',
  zIndex: 1,
};

const styles = {
  contentBox: {
    zIndex: 2,
    width: '100%',
  },
  content: {
    width: '100%',
    margin: '0 auto',
    padding: '40px 50px',
    borderRadius: '20px',
    marginTop: '50px',
    marginBottom: '50px',
    maxWidth: '650px',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  profileHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: '28px',
    margin: '0',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  profileContainer: {
    display: 'flex', // 자식 요소들을 Flex 아이템으로 만듭니다.
    flexDirection: 'column', // Flexbox 방향을 수직(세로)으로 설정합니다.
    alignItems: 'center', // 수평축(이 경우, X축)을 기준으로 아이템들을 중앙 정렬합니다.
    justifyContent: 'center', // (선택 사항) 수직축(Y축)을 기준으로 아이템들을 중앙 정렬합니다.
  },
  liltitle: {
    fontSize: '16px',
    marginBottom: '12px',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: '16px',
    marginTop: '30px',
    marginBottom: '12px',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  sectionBox: {
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.03)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
  },
  profileIcon: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    color: 'white',
    border: '3px solid rgba(255, 255, 255, 0.2)',
    margin: '20px 0',
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
  },
  sectionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
};

// 7. SettingItem에 사용될 스타일
const settingItemStyles = {
  settingItem: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  settingLabel: {
    color: 'white',
  },
  settingValue: {
    color: 'white',
    position: 'relative',
  },
  linkText: {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};
