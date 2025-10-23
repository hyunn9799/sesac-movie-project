// src/app/mypage/profile-edit/ProfileEditPage.js

"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 🚀 프로젝트 구조에 맞게 경로를 수정했습니다.
import { useGenreStore } from '../_component/GenreStoreContext';
import { useAuth } from '@/app/auth/AuthContext';

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

    const {user,updateUser} = useAuth();
    const [name, setName] = useState(user?.name);

    // useEffect(() => {
    //     const data = JSON.parse(localStorage.getItem("loggedInUser"));
    //     console.log(data)
    //     setName(data?.name)
    // }, [])
    const router = useRouter();

    // 🚀 실제 useGenreStore Hook 사용
    const { favGenres: initialFav, unfavGenres: initialUnfav, updateGenres } = useGenreStore();

    // 1. 프로필 상태


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

        const updatedUser = {
            ...user,
            name: name,
        }

        updateUser(updatedUser);
        
        
        // 장르 상태 업데이트
        updateGenres(favGenres, unfavGenres);

        console.log("Saving data:", { name, favGenres, unfavGenres });
        alert(`프로필 및 장르가 저장되었습니다: 이름(${name}), 선호(${favGenres.join(', ')})`);

        // 마이페이지로 이동
        // 🚀 router.push(`/mypage`);
        window.history.back(); // Next.js 환경이 아니므로 뒤로가기 시뮬레이션
    };

    const handleCancel = () => {
        // 🚀 router.back();
        window.history.back(); // Next.js 환경이 아니므로 뒤로가기 시뮬레이션
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

                                {/* 아이콘 및 텍스트 표시 */}
                                {isSelected && <span style={{ color: 'white', fontSize: '1em', marginLeft: '5px', fontWeight: 'bold' }}>✓</span>}
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
        <div style={CONTAINER_STYLE}>
            <div style={OVERLAY_STYLE}></div>

            <div style={styles.container}>
                <div style={styles.content}>
                    <h1 style={styles.title}>✏️ 프로필 수정</h1>

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
                        <h3 style={styles.genreTitle}>🎬 장르 설정 (선호/비선호)</h3>
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
                            💾 변경 저장
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 💡 배경 이미지를 위한 최상위 컨테이너 스타일
const CONTAINER_STYLE = {
    minHeight: '100vh',
    position: 'relative',
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

// 💡 배경 이미지를 더 어둡게 만들 오버레이 스타일
const OVERLAY_STYLE = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at top right, rgba(102, 126, 234, 0.1), transparent 50%), radial-gradient(circle at bottom left, rgba(118, 75, 162, 0.1), transparent 50%)',
    zIndex: 1,
};


// 💡 메인 섹션 스타일
const styles = {
    container: {
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '50px',
        paddingBottom: '50px',
        width: '100%',
        zIndex: 2,
        position: 'relative',
    },
    content: {
        maxWidth: '650px',
        width: '100%',
        padding: '40px 50px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    title: {
        fontSize: '28px',
        marginBottom: '30px',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    profileSection: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '30px',
        textAlign: 'left',
        padding: '20px 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '30px',
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
        flexShrink: 0,
        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
        border: '3px solid rgba(255, 255, 255, 0.2)',
    },
    formGroup: {
        flexGrow: 1,
        width: '100%',
    },
    label: {
        display: 'block',
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: '600',
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        background: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        color: 'white',
        borderRadius: '12px',
        fontSize: '16px',
        boxSizing: 'border-box',
        transition: 'all 0.3s ease',
        outline: 'none',
    },
    hint: {
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.5)',
        marginTop: '8px',
        marginBottom: '0',
        fontWeight: '400',
    },
    errorMessage: {
        fontSize: '12px',
        color: '#ff6b6b',
        marginTop: '8px',
        fontWeight: '500',
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-start',
        gap: '12px',
        marginTop: '40px',
        paddingTop: '30px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    },
    buttonPrimary: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        padding: '12px 32px',
        fontSize: '15px',
        cursor: 'pointer',
        borderRadius: '25px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    },
    buttonSecondary: {
        background: 'rgba(255, 255, 255, 0.1)',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '12px 32px',
        fontSize: '15px',
        cursor: 'pointer',
        borderRadius: '25px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
    },
    genreSection: {
        padding: '0 0 30px 0',
        marginBottom: '0',
        textAlign: 'left',
    },
    genreTitle: {
        fontSize: '18px',
        color: 'rgba(255, 255, 255, 0.95)',
        marginBottom: '20px',
        fontWeight: '700',
    },
    genreRow: {
        display: 'flex',
        alignItems: 'flex-start',
        padding: '20px 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    },
    genreLabel: {
        width: '120px',
        color: 'rgba(255, 255, 255, 0.7)',
        flexShrink: 0,
        paddingTop: '8px',
        fontSize: '14px',
        fontWeight: '600',
    },
    genreValueContainer: {
        flexGrow: 1,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        position: 'relative',
    },
    tagList: {
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        marginTop: '5px',
    },
    tag: {
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '13px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontWeight: '600',
        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
    },
    emptyTag: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: '13px',
        marginTop: '8px',
        fontStyle: 'italic',
    },
    editButton: {
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        color: 'white',
        border: 'none',
        padding: '8px 18px',
        cursor: 'pointer',
        borderRadius: '20px',
        marginLeft: '15px',
        flexShrink: 0,
        fontSize: '13px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(245, 87, 108, 0.3)',
    },
    genreMessage: {
        color: '#ff6b6b',
        background: 'rgba(255, 107, 107, 0.1)',
        padding: '12px 16px',
        borderRadius: '12px',
        marginBottom: '20px',
        fontSize: '13px',
        fontWeight: '500',
        border: '1px solid rgba(255, 107, 107, 0.3)',
    }
};

// 💡 드롭다운 UI 스타일
const dropdownStyles = {
    container: {
        position: 'absolute',
        top: '100%',
        right: '0',
        zIndex: 50,
        width: '300px',
        marginTop: '12px',
        padding: '16px',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
    },
    select: {
        maxHeight: '240px',
        overflowY: 'auto',
        padding: '0',
    },
    option: {
        padding: '10px 12px',
        cursor: 'pointer',
        fontSize: '14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        marginBottom: '4px',
        color: 'rgba(255, 255, 255, 0.8)',
    },
    selectedOption: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontWeight: '600',
        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.4)',
    },
    disabledOption: {
        color: 'rgba(255, 255, 255, 0.3)',
        background: 'rgba(255, 255, 255, 0.03)',
        cursor: 'not-allowed',
        opacity: 0.6,
    },
    message: {
        color: '#667eea',
        fontSize: '12px',
        marginBottom: '12px',
        fontWeight: '600',
        textAlign: 'center',
        padding: '8px',
        background: 'rgba(102, 126, 234, 0.1)',
        borderRadius: '8px',
    }
};