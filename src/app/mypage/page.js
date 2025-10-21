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
    // useGenreStore의 반환 구조를 확인하여, 필요한 상태만 가져오거나 스토어의 상태를 직접 사용합니다.
    // 현재 코드에서는 setFavGenres, setUnfavGenres가 정의되지 않아 주석 처리하고 favGenres, unfavGenres만 유지합니다.
    const { favGenres, unfavGenres } = useGenreStore(); 

    const router = useRouter();


    const userData = {
        email: "sesac1234@gmail.com",
        reviewCount: 0,
        // favGenres와 unfavGenres는 useGenreStore에서 가져오므로 여기서는 사용하지 않습니다.
    };

    const handleWithdraw = () => {
        // 실제로는 API 호출 후 탈퇴 처리
        alert('회원 탈퇴 처리 로직 실행');
        setIsWithdrawModalOpen(false);
    };

    const handleProfileEdit = () => {
        router.push('/mypage/profileEdit');
    }

    // 이 함수는 현재 useGenreStore의 setter를 사용하지 않으므로 임시로 주석 처리하거나 로직을 수정해야 합니다.
    // const handleSaveGenres = (genres, type) => {
    //     if (type === 'fav') {
    //         setFavGenres(genres); // setFavGenres가 useGenreStore에 있다고 가정
    //     } else if (type === 'unfav') {
    //         setUnfavGenres(genres); // setUnfavGenres가 useGenreStore에 있다고 가정
    //     }
    //     // 저장 후 드롭다운 닫기
    //     alert(`${type === 'fav' ? '선호' : '비선호'} 장르가 저장되었습니다: ${genres.join(', ')}`);
    //     setActiveGenreEdit(null); // setActiveGenreEdit이 정의되지 않아 주석 처리
    // };

    return (

        // ❗ 1. 오버레이 레이어를 추가하기 위해 containerStyle을 가장 바깥에 적용
        <div style={containerStyle}> 
            
            {/* ❗ 2. 배경 이미지를 더 어둡게 만드는 오버레이 레이어 */}
            <div style={overlayStyle}></div> 

            {/* ❗ 3. 실제 콘텐츠 박스는 오버레이 위에 오도록 zIndex: 2 적용 */}
            <div style={styles.contentBox}> 
                <div style={styles.content}>
                    <div style={styles.profileHeader}>
                        <h2 style={styles.title}>내 프로필</h2>
                        <button style={styles.editButton} onClick={handleProfileEdit}>
                            ✏️ 프로필 수정
                        </button>
                    </div>

                    <ProfileIcon />

                    {/* 계정 Section */}
                    <h3 style={{fontSize:'18px'}}>계정</h3>
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
                        <h3 style={{fontSize:'18px'}}>장르</h3>
                        {/* 장르 수정 버튼은 프로필 편집 버튼과 동일 경로로 연결 */}
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
                    <h3 style={{fontSize:'18px'}} >리뷰 관리 / 작성한 리뷰 : {userData.reviewCount}개</h3>
                    <div style={styles.sectionBox}>
                        <SettingItem label="작성한 리뷰" value={`${userData.reviewCount}개`} isLink={true} linkText="보기" routePath="/mypage/reviews" />
                    </div>

                    {/* 회원 탈퇴 Section */}
                    <h3 style={{fontSize:'18px'}}>회원 탈퇴</h3>
                    <div style={styles.sectionBox}>
                        {/* ❗ 탈퇴하기 링크 대신, 모달을 여는 onClick 이벤트 연결 */}
                        <SettingItem
                            label="탈퇴하기"
                            value=""
                            isLink={true}
                            linkText="탈퇴하기"
                            onClick={() => setIsWithdrawModalOpen(true)} // 모달 열기 함수 연결
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
        </div>
    );
}

// 4. 인라인 스타일 정의 (MyPage 전용)
const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#1c1c1c", // 이미지가 로드되기 전 대체 색상
    color: "white",
    display: "flex",
    justifyContent: "center",
    padding: '0px',
    margin: '0px',
    position: 'relative', // ❗ 오버레이를 위한 relative 설정
    
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // ❗ 검은색 60% 투명도 (더 어둡게 설정)
    zIndex: 1, // 컨테이너(배경) 위에 위치
};

const styles = {
    // ❗ 콘텐츠를 담는 최상위 박스: 오버레이 위에 오도록 z-index 설정
    contentBox: {
        zIndex: 2, 
        width: '100%', // 너비를 100%로 설정
        // 이 컨테이너는 오버레이 위에 올라와서 스크롤을 담당합니다.
    },
    container: { // 기존 container 스타일은 사용하지 않거나, styles.contentBox로 통합
        backgroundColor: '#1c1c1c',
        minHeight: '100vh',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
    },
    // ... (Header 관련 스타일은 생략) ...
    
    // ❗ 폼 너비 원상 복구: maxWidth 설정을 제거 (혹은 충분히 넓게)하고 중앙 정렬
    content: {
        // 기존 width: '40%' 대신, 넓게 보이도록 최대 너비 설정
        width: 'calc(100% - 40px)', // 좌우 패딩을 제외한 너비
        maxWidth: '800px', // ❗ 콘텐츠 영역의 최대 너비를 800px로 다시 설정
        margin: '0 auto', // 중앙 정렬
        padding: '40px 20px',
        
        backgroundColor: 'rgba(28, 28, 28, 0.9)', // 내용 박스 배경을 불투명하게 하여 가독성 확보
        borderRadius: '8px',
        marginTop: '50px',
        marginBottom: '50px',
        
        // 🚀 boxShadow 추가: 부드러운 검은색 그림자
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)', 
        // 0: X축 오프셋, 4px: Y축 오프셋, 12px: 블러 반경, 
        // rgba(0, 0, 0, 0.5): 검은색 50% 투명도
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
    editButton: {
        backgroundColor: 'transparent',
        color: '#aaa',
        border: '1px solid #777',
        padding: '5px 10px',
        cursor: 'pointer'
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