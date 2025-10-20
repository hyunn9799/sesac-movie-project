// src/app/withdraw/page.js

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 탈퇴 사유 목록
const REASONS = [
    "추천 결과가 마음에 들지 않음",
    "사용이 불편함",
    "더 이상 사용할 일이 없음",
];

export default function WithdrawPage() {
    const router = useRouter();

    // 1. 상태 관리
    const [selectedReasons, setSelectedReasons] = useState([]);
    const [otherReason, setOtherReason] = useState('');
    const [password, setPassword] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    
    // 2. 유효성 검사 (버튼 활성화)
    useEffect(() => {
        // 비밀번호가 입력되었는지 확인
        const isPwdEntered = password.length > 0;
        
        // 사유가 선택되었는지 (체크박스 또는 기타 필드) 확인
        const isReasonSelected = selectedReasons.length > 0 || otherReason.trim().length > 0;

        // 모든 조건 만족 시 버튼 활성화
        setIsFormValid(isPwdEntered && isReasonSelected);
    }, [selectedReasons, otherReason, password]);

    // 3. 핸들러
    const handleCheckboxChange = (reason) => {
        setSelectedReasons(prev => 
            prev.includes(reason) 
            ? prev.filter(r => r !== reason) 
            : [...prev, reason]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!isFormValid) {
            alert("탈퇴 사유(최소 1개)와 비밀번호를 입력해 주세요.");
            return;
        }

        const finalReasons = selectedReasons.slice();
        if (otherReason.trim()) {
            finalReasons.push(`(기타 사유): ${otherReason.trim()}`);
        }

        // 💡 실제 회원 탈퇴 API 호출 로직
        console.log("Withdrawal initiated. Reasons:", finalReasons, "Password entered.");
        alert("회원 탈퇴가 완료되었습니다. 이용해주셔서 감사합니다.");
        
        // 탈퇴 후 메인/로그인 페이지로 이동
        router.push('/'); 
    };

    const handleBack = () => {
        router.back(); // 이전 페이지(마이페이지)로 돌아가기
    };

    // 4. 렌더링
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.logo}>MovieHub</h1>
                <div style={styles.headerRight}>
                    <button style={styles.buttonSecondary} onClick={() => router.push('/')}>메인으로</button>
                    <button style={styles.buttonPrimary} onClick={() => console.log('로그아웃')}>로그아웃</button>
                </div>
            </header>
            
            <div style={styles.content}>
                <h1 style={styles.title}>탈퇴하기</h1>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* 체크박스 목록 */}
                    {REASONS.map((reason) => (
                        <div key={reason} style={styles.checkboxContainer}>
                            <label style={styles.checkboxLabel}>
                                <input 
                                    type="checkbox" 
                                    checked={selectedReasons.includes(reason)}
                                    onChange={() => handleCheckboxChange(reason)}
                                    style={styles.checkboxInput}
                                />
                                {reason}
                            </label>
                        </div>
                    ))}

                    {/* 기타 사유 및 비밀번호 */}
                    <h3 style={styles.subtitle}>기타</h3>
                    <div style={styles.formGroup}>
                        <input
                            type="text"
                            value={otherReason}
                            onChange={(e) => setOtherReason(e.target.value)}
                            style={styles.input}
                            placeholder="탈퇴 사유를 입력해주세요"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            placeholder="비밀번호를 입력해주세요"
                        />
                    </div>
                    
                    {/* 액션 버튼 */}
                    <div style={styles.actions}>
                        <button 
                            type="submit"
                            style={isFormValid ? styles.buttonPrimary : styles.buttonDisabled}
                            disabled={!isFormValid}
                        >
                            탈퇴하기
                        </button>
                        <button 
                            type="button" 
                            style={styles.buttonBack}
                            onClick={handleBack}
                        >
                            뒤로
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* --- 스타일 정의 --- */
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
        color: '#c0392b',
        fontSize: '24px'
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    content: {
        maxWidth: '500px',
        margin: '0 auto',
        padding: '40px 20px',
        textAlign: 'center',
    },
    title: {
        fontSize: '36px',
        marginBottom: '40px',
        color: 'white',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        textAlign: 'left',
    },
    checkboxContainer: {
        backgroundColor: '#2c2c2c',
        borderRadius: '4px',
        padding: '15px',
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        fontSize: '16px',
    },
    checkboxInput: {
        marginRight: '15px',
        width: '20px',
        height: '20px',
        cursor: 'pointer',
        // Next.js에서 기본 input 스타일 오버라이딩을 위한 추가 CSS 필요 (브라우저별 상이)
    },
    subtitle: {
        fontSize: '18px',
        color: '#aaa',
        marginTop: '20px',
        marginBottom: '10px',
    },
    formGroup: {
        marginBottom: '10px',
    },
    input: {
        width: '100%',
        padding: '15px',
        backgroundColor: '#2c2c2c',
        border: '1px solid #444',
        color: 'white',
        borderRadius: '4px',
        fontSize: '16px',
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-start',
        gap: '15px',
        marginTop: '30px',
    },
    // 버튼 스타일 (이전 페이지에서 사용한 것 재사용)
    buttonPrimary: {
        backgroundColor: '#c0392b', // 활성화 시 빨간색
        color: 'white',
        border: 'none',
        padding: '12px 30px',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '4px',
    },
    buttonDisabled: {
        backgroundColor: '#555', // 비활성화 시 회색
        color: '#ccc',
        border: 'none',
        padding: '12px 30px',
        fontSize: '16px',
        cursor: 'not-allowed',
        borderRadius: '4px',
    },
    buttonBack: {
        backgroundColor: '#444', 
        color: 'white',
        border: 'none',
        padding: '12px 30px',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '4px',
    },
    buttonSecondary: {
        backgroundColor: 'transparent',
        color: 'white',
        border: '1px solid #777',
        padding: '8px 15px',
        cursor: 'pointer',
        borderRadius: '4px',
    },
};