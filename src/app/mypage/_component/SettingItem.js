"use client";

import React from 'react';
import { useRouter } from 'next/navigation'; 

const styles = {
    settingItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '15px 20px',
        borderBottom: '1px solid #3c3c3c'
    },
    settingLabel: { color: '#aaa' },
    settingValue: { color: 'white',position: 'relative' },
    linkText: {
        color: '#3498db',
        cursor: 'pointer',
        marginLeft: '10px'
    }
};

export default function SettingItem({ label, value, isLink = false, linkText = '', routePath, customAction }) {
    const router = useRouter(); 

    const handleClick = () => {
        if (routePath) {
            // 1. 페이지 이동 (라우팅)
            router.push(routePath);
        } else if (customAction) {
            // 2. 모달 열기 등 사용자 정의 동작
            customAction();
        }
        // 기본적으로는 아무것도 하지 않음
    };

    return (
        <div style={styles.settingItem}>
            <div style={styles.settingLabel}>{label}</div>
            <div style={styles.settingValue}>
                {value}
                {isLink && (
                    // routePath나 customAction이 있을 때만 handleClick을 연결
                    <span style={styles.linkText} onClick={routePath || customAction ? handleClick : undefined}>
                        {linkText}
                    </span>
                )}
            </div>
        </div>
    )
}