// src/app/mypage/profile-edit/page.js

"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 장르 목록 및 상수
const ALL_GENRES = [
    '키즈', '모험', '액션', '로맨스', '공포',
    'SF', '코미디', '애니메이션', '다큐멘터리', '드라마', '판타지', '스릴러', '범죄'
];
const MAX_LENGTH = 20;
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
    
    // 1. 프로필 상태
    const [name, setName] = useState("새싹"); 
    
    // 2. 장르 상태
    const [favGenres, setFavGenres] = useState(['모험', '공포', '코미디']); // 초기값 설정
    const [unfavGenres, setUnfavGenres] = useState(['액션', '애니메이션', '다큐멘터리']); // 초기값 설정
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
        
        // 💡 실제 저장 로직: API 호출 (이름, 선호/비선호 장르 동시 전송)
        console.log("Saving data:", { name, favGenres, unfavGenres });
        alert(`프로필 및 장르가 저장되었습니다: 이름(${name}), 선호(${favGenres.join(', ')})`);
        router.push('/mypage'); 
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
                                {genre} {isSelected ? '✅' : ''} {isDisabled ? '🚫' : ''}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    /* --- 메인 렌더링 --- */
    return (
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
    );
}

// 💡 메인 섹션 스타일
const styles = {
    // ... (기존 styles 유지)
    container: {
        backgroundColor: '#1c1c1c',
        minHeight: '100vh',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '80px',
    },
    content: {
        maxWidth: '750px', // 너비 확장
        width: '100%',
        padding: '20px',
        textAlign: 'center',
    },
    title: {
        fontSize: '36px',
        marginBottom: '50px',
        color: 'white',
    },
    profileSection: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '40px',
        textAlign: 'left',
        padding: '30px',
        backgroundColor: '#2c2c2c',
        borderRadius: '8px',
        marginBottom: '30px',
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
        color: '#aaa',
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
        color: '#aaa',
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
        backgroundColor: '#c0392b',
        color: 'white',
        border: 'none',
        padding: '12px 30px',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '4px',
    },
    buttonSecondary: {
        backgroundColor: '#444',
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
        backgroundColor: '#2c2c2c',
        borderRadius: '8px',
        marginBottom: '30px',
        textAlign: 'left',
    },
    genreTitle: {
        fontSize: '20px',
        color: 'white',
        marginBottom: '20px',
        borderBottom: '1px solid #444',
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
        color: '#aaa',
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
        backgroundColor: '#34495e',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '3px',
        fontSize: '14px',
    },
    emptyTag: {
        color: '#777',
        fontSize: '14px',
    },
    editButton: {
        backgroundColor: 'transparent',
        color: '#3498db',
        border: '1px solid #3498db',
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
        
        width: '180px', 
        marginTop: '10px', 
        padding: '10px', 
        backgroundColor: '#333',
        borderRadius: '5px',
        border: '1px solid #444',
        boxShadow: '0 4px 8px rgba(0,0,0,0.5)'
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
    },
    selectedOption: {
        backgroundColor: '#555', 
        color: 'white',
    },
    disabledOption: {
        color: '#777',
        cursor: 'not-allowed',
        opacity: 0.7,
    },
    message: {
        color: '#ccc',
        fontSize: '12px',
        marginBottom: '5px'
    }
};