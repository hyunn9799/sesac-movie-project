"use client"; // ⬅️ useState 훅을 사용하므로 클라이언트 컴포넌트로 지정

import React from 'react';
import { useState } from 'react';
import SettingItem from './_component/SettingItem';
import { useRouter } from 'next/navigation';
import { useGenreStore } from './_component/GenreStoreContext';


// 1. 모달 컴포넌트 (page.js에 포함하거나 별도 파일로 분리 가능)
const SimpleModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div style={modalStyles.backdrop}>
            <div style={modalStyles.content}>
                <h3>{title}</h3>
                {children}
                <button onClick={onClose} style={modalStyles.closeButton}>닫기</button>
            </div>
        </div>
    );
};

// 2. 프로필 아이콘 컴포넌트 (UI 전용)
const ProfileIcon = () => (
    <div style={styles.profileIcon}>
        🌱
    </div>
);

const arrayToGenreString = (arr) => arr.join(', ');



// 3. 마이페이지 컴포넌트 (메인 로직)
export default function MyPage() {
    
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const {favGenres,unfavGenres} = useGenreStore();

    const router = useRouter();


    const userData = {
        email: "sesac1234@gmail.com",
        reviewCount: 0,
        favGenres: "모험, 공포, 코미디",
        unfavGenres: "액션, 애니메이션, 다큐멘터리"
    };

    const handleWithdraw = () => {
        // 실제로는 API 호출 후 탈퇴 처리
        alert('회원 탈퇴 처리 로직 실행');
        setIsWithdrawModalOpen(false);
    };

    const handleProfileEdit = () => {
        router.push('/mypage/profileEdit');
    }

    const handleSaveGenres = (genres, type) => {
        if (type === 'fav') {
            setFavGenres(genres);
        } else if (type === 'unfav') {
            setUnfavGenres(genres);
        }
        // 저장 후 드롭다운 닫기
        alert(`${type === 'fav' ? '선호' : '비선호'} 장르가 저장되었습니다: ${genres.join(', ')}`);
        setActiveGenreEdit(null);
    };

    return (
        <div style={styles.container}>
            {/* Header */}

            {/* Main Content */}
            <div style={styles.content}>
                <div style={styles.profileHeader}>
                    <h2 style={styles.title}>내 프로필</h2>
                    <button style={styles.editButton} onClick={handleProfileEdit}>
                        ✏️ 프로필 수정
                    </button>
                </div>

                <ProfileIcon />

                {/* 계정 Section */}
                <h3 >계정</h3>
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
                    <h3 >장르</h3>
                    <button style={styles.editButton} onClick={handleProfileEdit}>
                        ✏️ 장르 수정
                    </button>
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
                <h3 >리뷰 관리 / 작성한 리뷰 : {userData.reviewCount}개</h3>
                <div style={styles.sectionBox}>
                    <SettingItem label="작성한 리뷰" value={`${userData.reviewCount}개`} isLink={true} linkText="보기" routePath="/mypage/reviews" />
                </div>

                {/* 회원 탈퇴 Section */}
                <h3 >회원 탈퇴</h3>
                <div style={styles.sectionBox}>
                    <SettingItem
                        label="탈퇴하기"
                        value=""
                        isLink={true}
                        linkText="탈퇴하기"
                        routePath="/mypage/withdraw"

                    />
                </div>
            </div>

            {/* 모달 렌더링 */}
            <SimpleModal
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
                title="정말로 탈퇴하시겠습니까?"
            >
                <p>탈퇴하시면 모든 정보가 영구 삭제됩니다.</p>
                <button onClick={handleWithdraw} style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '10px 15px', marginTop: '15px', cursor: 'pointer' }}>탈퇴 실행</button>
            </SimpleModal>
        </div>
    );
}

// 4. 인라인 스타일 정의 (MyPage 전용)
const styles = {
    container: {
        backgroundColor: '#1c1c1c',
        minHeight: '100vh',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#222',
        padding: '15px 50px',
        borderBottom: '1px solid #444',
    },
    logo: {
        margin: 0,
        color: 'red',
        fontSize: '24px'
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
    },
    welcomeText: {
        marginRight: '15px',
        fontSize: '14px'
    },
    buttonPrimary: {
        backgroundColor: '#c0392b',
        color: 'white',
        border: 'none',
        padding: '8px 15px',
        marginLeft: '10px',
        cursor: 'pointer'
    },
    buttonSecondary: {
        backgroundColor: 'transparent',
        color: 'white',
        border: '1px solid #777',
        padding: '8px 15px',
        marginLeft: '10px',
        cursor: 'pointer'
    },
    content: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px 20px'
    },
    profileHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
    },
    title: {
        fontSize: '28px',
        margin: '0'
    },
    editButton: {
        backgroundColor: 'transparent',
        color: '#aaa',
        border: '1px solid #777',
        padding: '5px 10px',
        cursor: 'pointer'
    },
    sectionTitle: {
        fontSize: '18px',
        marginTop: '30px',
        marginBottom: '10px',
        borderBottom: '1px solid #444',
        paddingBottom: '5px'
    },
    sectionBox: {
        backgroundColor: '#2c2c2c',
        borderRadius: '5px',
        overflow: 'hidden'
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
    }
};

const modalStyles = {
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