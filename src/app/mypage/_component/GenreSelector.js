// src/components/GenreSelector.js
"use client";

import React, { useState } from 'react';

// 예시 전체 장르 목록
const ALL_GENRES = [
    '액션', '모험', '코미디', '드라마', '판타지', '공포',
    'SF', '로맨스', '스릴러', '범죄','미스터리','애니메이션','다큐멘터리'
];

// 스타일 정의 (page.js의 styles 객체와 충돌하지 않도록 별도 정의)
const selectorStyles = {
    dropdown: {
        marginTop: '10px',
        padding: '15px',
        backgroundColor: '#333',
        borderRadius: '5px',
        border: '1px solid #444',
        position: 'relative'
    },
    genreTag: {
        display: 'inline-block',
        padding: '8px 12px',
        margin: '5px',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'background-color 0.2s'
    },
    selected: {
        backgroundColor: '#3498db', // 선택됨 #3498db
        color: 'white',
        border: '1px solid #3498db'
    },
    unselected: {
        backgroundColor: '#444', // 선택 안 됨
        color: '#ccc',
        border: '1px solid #555'
    },
    disabled: {
        backgroundColor: '#222', // 비활성화 (선택 불가능)
        color: '#666',
        cursor: 'not-allowed',
        opacity: 0.5
    },
    button: {
        marginTop: '15px',
        padding: '10px 15px',
        backgroundColor: '#c0392b',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginLeft: 'auto'
    }
};

/**
 * 장르 선택 드롭다운 UI 컴포넌트
 * @param {string[]} initialGenres - 초기 선택된 장르 배열 (예: ['모험', '공포'])
 * @param {function} onSave - 저장 버튼 클릭 시 호출될 함수 (선택된 장르 배열을 인수로 받음)
 */
export default function GenreSelector({ initialGenres, onSave, isVisible }) {
    // 내부에서 관리되는 현재 선택 상태
    const [selectedGenres, setSelectedGenres] = useState(initialGenres || []);
    const MAX_SELECTION = 3;

    if (!isVisible) return null;

    const handleTagClick = (genre) => {
        if (selectedGenres.includes(genre)) {
            // 이미 선택된 경우: 선택 해제
            setSelectedGenres(selectedGenres.filter(g => g !== genre));
        } else if (selectedGenres.length < MAX_SELECTION) {
            // 선택되지 않았고, 최대 개수 미만인 경우: 선택 추가
            setSelectedGenres([...selectedGenres, genre]);
        } else {
            // 최대 개수 초과 시
            alert(`장르는 최대 ${MAX_SELECTION}개까지만 선택할 수 있습니다.`);
        }
    };

    const handleSave = () => {
        onSave(selectedGenres);
        // 저장 후 드롭다운 UI를 닫는 로직은 상위 컴포넌트(MyPage)에서 처리됩니다.
    };

    return (
        <div style={selectorStyles.dropdown}>
            <h4 style={{ color: 'white' }}>장르 선택 (최대 {MAX_SELECTION}개)</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {ALL_GENRES.map(genre => {
                    const isSelected = selectedGenres.includes(genre);
                    const isDisabled = !isSelected && selectedGenres.length >= MAX_SELECTION;

                    return (
                        <span
                            key={genre}
                            style={{
                                ...selectorStyles.genreTag,
                                ...(isSelected ? selectorStyles.selected : selectorStyles.unselected),
                                ...(isDisabled ? selectorStyles.disabled : {})
                            }}
                            onClick={() => !isDisabled && handleTagClick(genre)}
                        >
                            {genre}
                        </span>
                    );
                })}
            </div>
            <div style={{display:'flex', justifyContent:'right'}}>
                <button style={selectorStyles.button} onClick={handleSave}>
                    저장 ({selectedGenres.length}/{MAX_SELECTION})
                </button>
            </div>
        </div>
    );
}