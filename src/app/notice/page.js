"use client";
import React, { useState } from "react";
import styles from "./notice.module.css";
import { initialNotices } from "@/lib/data/notice";

export default function NoticePage() {
  const [notices] = useState(initialNotices);

  const [openId, setOpenId] = useState(null);
  const toggleNotice = (id) => setOpenId(openId === id ? null : id);

  return (
    <div className={styles.container}>
      <div className={styles.noticeBox}>
        <h2 className={styles.title}>공지사항</h2>
        <p className={styles.subtitle}>
          <em>MovieHub</em>의 각종 공지사항(공지, 행사 등)을 제공합니다.
        </p>

        <div className={styles.searchBox}>
          <input type="text" placeholder="검색어를 입력하세요" />
          <button>검색</button>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성일자</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((notice) => (
              <React.Fragment key={notice.id}>
                <tr
                  className={styles.row}
                  onClick={() => toggleNotice(notice.id)}
                >
                  <td>{notice.id}</td>
                  <td>
                    <em>MovieHub</em> {notice.title.replace("MovieHub", "")}
                  </td>
                  <td>{notice.date}</td>
                </tr>
                {openId === notice.id && (
                  <tr className={styles.dropdownRow}>
                    <td colSpan="3">{notice.content}</td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        <div className={styles.footerBtns}>
          <button>아이디/패스워드 분실</button>
          <button>사용문의</button>
          <button>회원탈퇴</button>
          <button>고객센터</button>
        </div>
      </div>
    </div>
  );
}
