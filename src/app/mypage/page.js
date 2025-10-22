"use client"; // ⬅️ useState 훅을 사용하므로 클라이언트 컴포넌트로 지정

import React from 'react';
import { useState } from 'react';
import SettingItem from './_component/SettingItem';
import { useRouter } from 'next/navigation';
import { useGenreStore } from './_component/GenreStoreContext';

const ProfileIcon = () => (
    <div style={styles.profileIcon}>
        🌱
    </div>
);

const arrayToGenreString = (arr) => arr.join(', ');

// 1. 🚀 호버 이벤트가 적용된 커스텀 버튼 컴포넌트
const HoverButton = ({ onClick, children }) => {
    const [isHovered, setIsHovered] = useState(false);

    // 기존 styles.editButton 기반으로 호버 스타일 추가
    const buttonStyle = {
        backgroundColor: isHovered ? '#2c2c2c' : 'transparent', // 🚀 호버 시 어두운 배경색
        color: isHovered ? '#dcdcdc' : '#b69d71', // 🚀 호버 시 밝은 텍스트 색상
        border: isHovered ? '1px solid #dcdcdc' : '1px solid #b69d71', // 🚀 호버 시 테두리 색상 변경
        padding: '5px 10px',
        cursor: 'pointer',
        borderRadius: '4px', // 부드러운 모서리 추가
        transition: 'all 0.3s ease', // 부드러운 전환 효과
        fontWeight: 'normal',
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


// 2. 호버 이벤트가 적용된 회원 탈퇴 버튼 컴포넌트 (이전 요청에서 추가됨)
const WithdrawButton = ({ onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    const buttonStyle = {
        padding: '10px 15px',
        backgroundColor: '#8b0000' , 
        color:  'white', 
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        textAlign: 'center',
        transition: 'background-color 0.3s, color 0.3s',
        width: '100%',
        boxSizing: 'border-box',
        fontSize: '16px',
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


// 3. 마이페이지 컴포넌트 (메인 로직)
export default function MyPage() {

    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const { favGenres, unfavGenres } = useGenreStore();
    const router = useRouter();


    const userData = {
        email: "sesac1234@gmail.com",
        reviewCount: 0,
    };

    const handleProfileEdit = () => {
        router.push('/mypage/profileEdit');
    }
    
    const openWithdrawModal = () => {
        // 실제로는 setIsWithdrawModalOpen(true); 또는 router.push('/mypage/withdraw')
        router.push('/mypage/withdraw'); 
    }

    return (

        <>
            <div style={containerStyle}>

                <div style={overlayStyle}></div>

                <div style={styles.contentBox}>
                    <div style={styles.content}>
                        <div style={styles.profileHeader}>
                            <h2 style={styles.title}>내 프로필</h2>
                            {/* 🚀 HoverButton 적용 */}
                            <HoverButton onClick={handleProfileEdit}>
                                ✏️ 프로필 수정
                            </HoverButton>
                        </div>

                        <ProfileIcon />

                        {/* 계정 Section */}
                        <h3 style={{ fontSize: '18px' }}>계정</h3>
                        <div style={styles.sectionBox}>
                            <SettingItem label="이메일" value={userData.email} />
                            <SettingItem
                                label="비밀번호"
                                value=""
                                isLink={true}
                                linkText="비밀번호 변경"
                                routePath="/mypage/changePwd"
                            />
                        </div>


                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '18px' }}>장르</h3>
                            {/* 🚀 HoverButton 적용 */}
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
                        <h3 style={{ fontSize: '18px' }} >리뷰 관리 / 작성한 리뷰 : {userData.reviewCount}개</h3>
                        <div style={styles.sectionBox}>
                            <SettingItem label="작성한 리뷰" value={`${userData.reviewCount}개`} isLink={true} linkText="보기" routePath="/mypage/reviews" />
                        </div>

                        {/* 회원 탈퇴 Section */}
                        <h3 style={{ fontSize: '18px' }}>회원 탈퇴</h3>
                        <div style={styles.sectionBox}>
                            <WithdrawButton onClick={openWithdrawModal} />
                        </div>
                    </div>


                </div>
            </div>
        </>
    );
}

// 4. 인라인 스타일 정의 (MyPage 전용)
const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#1c1c1c", 
    color: "white",
    display: "flex",
    justifyContent: "center",
    padding: '0px',
    margin: '0px',
    position: 'relative', 

    // 🚀 배경 이미지 스타일
    backgroundImage: `url('/modernTimes.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
};

// ❗ 배경 이미지를 더 어둡게 만드는 오버레이 스타일
const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    zIndex: 1, 
};

const styles = {
    contentBox: {
        zIndex: 2,
        width: '100%', 
    },
    container: { 
        backgroundColor: '#1c1c1c',
        minHeight: '100vh',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
    },
    content: {
        width: 'calc(100% - 40px)', 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '40px 20px',

        borderRadius: '8px',
        marginTop: '50px',
        marginBottom: '50px',
        maxWidth: '650px',

        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        border: '1px solid black'
    },
    profileHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
    },
    title: {
        fontSize: '25px',
        margin: '0'
    },
    // ❗ editButton 스타일은 HoverButton으로 대체되었으므로 주석 처리하거나 제거
    // editButton: { 
    //     backgroundColor: 'transparent',
    //     color: '#b69d71',
    //     border: '1px solid #b69d71',
    //     padding: '5px 10px',
    //     cursor: 'pointer'
    // },
    sectionBox: {
        borderRadius: '5px',
        overflow: 'hidden',
    },
    profileIcon: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        backgroundColor: '#444',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '40px',
        color: 'white',
        border: '1px solid #777',
        margin: '20px 0'
    },
    sectionItem: { 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 0',
        borderBottom: '1px solid #333',
    }
};

const modalStyles = {
    // 모달 스타일은 변경 없음
    backdrop: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    content: {
        backgroundColor: '#1c1c1c',
        padding: '30px',
        borderRadius: '8px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
        border: '1px solid #444'
    },
    closeButton: {
        marginTop: '20px',
        padding: '8px 15px',
        cursor: 'pointer',
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        borderRadius: '4px'
    }
};