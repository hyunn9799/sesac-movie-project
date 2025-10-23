// src/app/mypage/profile-edit/

"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// ❗ useGenreStore 경로를 프로젝트 구조에 맞게 수정해주세요.
import { useGenreStore } from '../_component/GenreStoreContext'; 

// 장르 목록 및 상수
const ALL_GENRES = [
    '키즈', '모험', '액션', '로맨스', '공포',
    'SF', '코미디', '애니메이션', '다큐멘터리', '드라마', '판타지', '스릴러', '범죄'
];
const MAX_LENGTH = 6;
const MIN_LENGTH = 2;
const MAX_GENRE_SELECTION = 3;

// 💡 useOutsideClick 훅 (내부 정의)
function useOutsideClick(refs, handler) {
    useEffect(() => {
        const listener = (e) => {
            // refs가 배열이든 단일 useRef든 처리
            const refArray = Array.isArray(refs) ? refs : [refs];
            for (const r of refArray) {
                if (r.current && r.current.contains(e.target)) return;
            }
            handler(e);
        };
        document.addEventListener("mousedown", listener);
        return () => document.removeEventListener("mousedown", listener);
    }, [refs, handler]);
}


export default function ProfileEditPage() {
    const router = useRouter();

    const { favGenres: initialFav, unfavGenres: initialUnfav, updateGenres } = useGenreStore();

    // 1. 프로필 상태
    const [name, setName] = useState("새싹");

    // 2. 장르 상태
    const [favGenres, setFavGenres] = useState(initialFav); // 초기값 설정
    const [unfavGenres, setUnfavGenres] = useState(initialUnfav); // 초기값 설정
    const [activeGenreEdit, setActiveGenreEdit] = useState(null); // 'fav', 'unfav', or null

    // 3. UI/메시지 상태
    const [nameMessage, setNameMessage] = useState('');
    const [genreMessage, setGenreMessage] = useState('');

    // 4. useRef for Outside Click
    const favRef = useRef(null);
    const unfavRef = useRef(null);

    // 5. 외부 클릭 훅 적용
    useOutsideClick([favRef, unfavRef], () => {
        // 드롭다운 닫기
        setActiveGenreEdit(null);
    });

    /* --- 프로필 이름 핸들러 --- */
    const handleNameChange = (e) => {
        setName(e.target.value);
        setNameMessage('');
    };

    /* --- 장르 선택 핸들러 --- */
    const toggleGenre = (genre, type) => {
        const targetList = type === 'fav' ? favGenres : unfavGenres;
        const setTarget = type === 'fav' ? setFavGenres : setUnfavGenres;
        const otherList = type === 'fav' ? unfavGenres : favGenres;

        // 다른 리스트에 이미 있으면 차단
        if (!targetList.includes(genre) && otherList.includes(genre)) {
            setGenreMessage(`"${genre}" 은(는) 이미 ${type === "fav" ? "비선호" : "선호"}에 선택되어 있습니다.`);
            setTimeout(() => setGenreMessage(""), 2500);
            return;
        }

        if (targetList.includes(genre)) {
            // 제거
            setTarget(targetList.filter((g) => g !== genre));
        } else if (targetList.length < MAX_GENRE_SELECTION) {
            // 추가
            setTarget([...targetList, genre]);
        } else {
            // 3개 제한
            setGenreMessage(`장르는 최대 ${MAX_GENRE_SELECTION}개까지 선택할 수 있습니다.`);
            setTimeout(() => setGenreMessage(""), 1800);
        }
    };

    /* --- 최종 저장 핸들러 --- */
    const handleSave = () => {
        if (name.length < MIN_LENGTH || name.length > MAX_LENGTH) {
            setNameMessage(`이름은 최소 ${MIN_LENGTH}자, 최대 ${MAX_LENGTH}자까지 입력해야 합니다.`);
            return;
        }

        // 장르 상태 업데이트
        updateGenres(favGenres, unfavGenres);

        console.log("Saving data:", { name, favGenres, unfavGenres });
        alert(`프로필 및 장르가 저장되었습니다: 이름(${name}), 선호(${favGenres.join(', ')})`);

        // 마이페이지로 이동
        router.push(`/mypage`);
    };

    const handleCancel = () => {
        router.back();
    };


    /* --- 서브 컴포넌트: 장르 드롭다운 UI --- */
    const GenreDropdownUI = ({ type, listRef }) => {
        const isFav = type === 'fav';
        const targetList = isFav ? favGenres : unfavGenres;
        const otherList = isFav ? unfavGenres : favGenres;
        const isOpen = activeGenreEdit === type;

        if (!isOpen) return null;

        return (
            <div style={dropdownStyles.container} ref={listRef}>
                <div style={dropdownStyles.message}>
                    최대 {MAX_GENRE_SELECTION}개까지 선택 가능
                </div>

                <div style={dropdownStyles.select}>
                    {ALL_GENRES.map(genre => {
                        const isSelected = targetList.includes(genre);
                        const isDisabled = otherList.includes(genre);

                        return (
                            <div
                                key={genre}
                                style={{
                                    ...dropdownStyles.option,
                                    ...(isSelected ? dropdownStyles.selectedOption : {}),
                                    ...(isDisabled ? dropdownStyles.disabledOption : {})
                                }}
                                onClick={() => !isDisabled && toggleGenre(genre, type)}
                            >
                                <span style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>
                                    {genre}
                                </span>
                                
                                {/* 🚀 변경된 부분: 아이콘 및 텍스트 표시 */}
                                {isSelected && <span style={{ color: '#ecf0f1', fontSize: '1em', marginLeft: '5px', fontWeight: 'bold' }}>✓</span>}
                                {isDisabled && <span style={{ color: '#aaaaaa', fontSize: '12px' }}> (다른 항목에 있음)</span>}
                                
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    /* --- 메인 렌더링 --- */
    return (
        // ❗ 1. 가장 바깥 컨테이너에 배경 이미지와 오버레이를 위한 스타일 적용
        <div style={CONTAINER_STYLE}>
            {/* ❗ 2. 어둡게 만드는 오버레이 레이어 */}
            <div style={OVERLAY_STYLE}></div>

            {/* ❗ 3. 실제 콘텐츠는 z-index를 높여 오버레이 위에 표시 */}
            <div style={styles.container}>
                <div style={styles.content}>
                    <h1 style={styles.title}>프로필 수정</h1>

                    {/* 1. 프로필 이름 섹션 */}
                    <div style={styles.profileSection}>
                        <div style={styles.profileIcon}>🌱</div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>이름</label>
                            <input
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                style={styles.input}
                                maxLength={MAX_LENGTH}
                            />
                            <p style={styles.hint}>
                                이름은 최소 {MIN_LENGTH}자, 최대 {MAX_LENGTH}자까지 입력이 가능합니다
                            </p>
                            {nameMessage && <p style={styles.errorMessage}>{nameMessage}</p>}
                        </div>
                    </div>

                    {/* 2. 장르 선택 섹션 */}
                    <div style={styles.genreSection}>
                        <h3 style={styles.genreTitle}>장르 설정 (선호/비선호)</h3>
                        {genreMessage && <div style={styles.genreMessage}>{genreMessage}</div>}

                        {/* 선호 장르 */}
                        <div style={styles.genreRow}>
                            <div style={styles.genreLabel}>선호 장르:</div>
                            <div style={styles.genreValueContainer}>
                                <div style={styles.tagList}>
                                    {favGenres.length === 0 ? <span style={styles.emptyTag}>선택 없음</span> :
                                        favGenres.map(g => <span key={g} style={styles.tag}>{g}</span>)}
                                </div>
                                <button
                                    style={styles.editButton}
                                    onClick={() => setActiveGenreEdit(activeGenreEdit === 'fav' ? null : 'fav')}
                                >
                                    {activeGenreEdit === 'fav' ? '닫기' : '수정'}
                                </button>
                                <GenreDropdownUI type="fav" listRef={favRef} />
                            </div>
                        </div>

                        {/* 비선호 장르 */}
                        <div style={styles.genreRow}>
                            <div style={styles.genreLabel}>비선호 장르:</div>
                            <div style={styles.genreValueContainer}>
                                <div style={styles.tagList}>
                                    {unfavGenres.length === 0 ? <span style={styles.emptyTag}>선택 없음</span> :
                                        unfavGenres.map(g => <span key={g} style={styles.tag}>{g}</span>)}
                                </div>
                                <button
                                    style={styles.editButton}
                                    onClick={() => setActiveGenreEdit(activeGenreEdit === 'unfav' ? null : 'unfav')}
                                >
                                    {activeGenreEdit === 'unfav' ? '닫기' : '수정'}
                                </button>
                                <GenreDropdownUI type="unfav" listRef={unfavRef} />
                            </div>
                        </div>
                    </div>


                    {/* 3. 액션 버튼 */}
                    <div style={styles.actions}>
                        <button style={styles.buttonSecondary} onClick={handleCancel}>
                            취소
                        </button>
                        <button style={styles.buttonPrimary} onClick={handleSave}>
                            변경 저장
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 💡 배경 이미지를 위한 최상위 컨테이너 스타일 (새로 추가)
const CONTAINER_STYLE = {
    minHeight: '100vh',
    position: 'relative', // 오버레이의 기준점
    backgroundColor: '#1c1c1c', // 이미지가 로드되지 않을 때의 색상
    fontFamily: 'Arial, sans-serif',
    
    // 🚀 배경 이미지 설정 (public 폴더의 'movie-edit-bg.jpg'를 가정)
    backgroundImage: `url('/black_building.jpg')`, 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
};

// 💡 배경 이미지를 더 어둡게 만들 오버레이 스타일
const OVERLAY_STYLE = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.65)', // 65% 투명도의 검정색 (더 어둡게 설정)
    zIndex: 1, // 배경 위에 위치
};


// 💡 메인 섹션 스타일
const styles = {
    // ❗ 컨테이너 스타일: 오버레이 위에 올라오도록 zIndex 설정
    container: {
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '50px',
        width: '100%',
        zIndex: 2, // ❗ 오버레이 위에 위치
        position: 'relative', // z-index가 제대로 작동하도록 설정
    },
    content: {
        maxWidth: '650px', // 너비 확장
        width: '100%',
        padding: '20px',
        textAlign: 'center',
        
        // ❗ 내용 영역 배경: 불투명한 배경을 추가하여 가독성 확보
        // backgroundColor: 'rgba(28, 28, 28, 0.9)', 
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.4)', // 그림자 추가
        marginBottom: '80px', // 하단 간격 추가
        border : '1px solid black'
    },
    title: {
        fontSize: '30px',
        marginBottom: '50px',
        color: 'white',
    },
    profileSection: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '40px',
        textAlign: 'left',
        padding: '50px',
        // backgroundColor: '#383838', // 배경이 겹치지 않도록 살짝 밝은 색으로 조정
        // borderRadius: '8px',
        marginBottom: '30px',
        // boxShadow: '0 8px 16px rgba(0,0,0,0.4)', // 그림자 추가
        // border: '1px solid #b69d71'
        // borderBottom : '1px solid white'
    },
    profileIcon: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#444',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '36px',
        flexShrink: 0,
    },
    formGroup: {
        flexGrow: 1,
        width: '100%',
    },
    label: {
        display: 'block',
        color: 'white',
        marginBottom: '5px',
        fontSize: '14px',
    },
    input: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#3c3c3c',
        border: '1px solid #555',
        color: 'white',
        borderRadius: '4px',
        fontSize: '16px',
    },
    hint: {
        fontSize: '12px',
        color: 'white',
        marginTop: '8px',
        marginBottom: '0',
    },
    errorMessage: {
        fontSize: '12px',
        color: '#e74c3c',
        marginTop: '8px',
    },
    actions: {
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        marginTop: '50px',
    },
    buttonPrimary: {
        backgroundColor: '#ff6b6b', // 붉은색 강조
        color: 'white',
        border: 'none',
        padding: '12px 30px',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '4px',
    },
    buttonSecondary: {
        backgroundColor: '#555',
        color: 'white',
        border: 'none',
        padding: '12px 30px',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '4px',
    },
    // 💡 장르 섹션 스타일
    genreSection: {
        padding: '30px',
        // backgroundColor: '#383838', // 배경이 겹치지 않도록 살짝 밝은 색으로 조정
        borderRadius: '8px',
        marginBottom: '30px',
        textAlign: 'left',
        // border: '1px solid #b69d71',
        // boxShadow : '0 8px 16px rgba(0, 0, 0, 0.4)',
    },
    genreTitle: {
        fontSize: '20px',
        color: 'white',
        marginBottom: '20px',
        // borderBottom: '1px solid #b69d71',
        paddingBottom: '10px',
    },
    genreRow: {
        display: 'flex',
        alignItems: 'center',
        padding: '15px 0',
        borderBottom: '1px solid #3c3c3c',
    },
    genreLabel: {
        width: '100px',
        color: 'white',
        flexShrink: 0,
    },
    genreValueContainer: {
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative', // 💡 드롭다운의 기준점
    },
    tagList: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
    },
    tag: {
        // backgroundColor: '#b69d71',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '3px',
        fontSize: '14px',
        border: '1px solid #b69d71'
    },
    emptyTag: {
        color: '#777',
        fontSize: '14px',
    },
    editButton: {
        backgroundColor: 'transparent',
        color: 'white',
        border: '1px solid #b69d71',
        padding: '5px 10px',
        cursor: 'pointer',
        borderRadius: '4px',
        marginLeft: '15px',
        flexShrink: 0,
    },
    genreMessage: {
        color: '#e74c3c',
        backgroundColor: '#3e2e2e',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '20px',
        fontSize: '14px',
    }
};

// 💡 드롭다운 UI 스타일
const dropdownStyles = {
    container: {
        position: 'absolute',
        top: '100%', // 버튼 아래로 내려오게
        right: '0',
        zIndex: 50,
        width: '240px', // 드롭다운 너비 확장 (텍스트 수용)
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#444', 
        borderRadius: '5px',
        border: '1px solid #555',
        boxShadow: '0 4px 8px rgba(0,0,0,0.7)'
    },
    select: {
        maxHeight: '180px',
        overflowY: 'auto',
        backgroundColor: 'transparent',
        padding: '0',
    },
    option: {
        padding: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '3px',
    },
    selectedOption: {
        backgroundColor: '#b69d71', // 짙은 파란색으로 선택됨 강조
        color: 'white',
    },
    disabledOption: {
        color: '#aaaaaa', // 비활성화된 항목은 밝은 회색으로
        backgroundColor: '#383838', // 배경도 살짝 다르게
        cursor: 'not-allowed',
        opacity: 0.8,
    },
    message: {
        color: '#ccc',
        fontSize: '12px',
        marginBottom: '5px'
    }
};