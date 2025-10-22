"use client";
import React, { useState } from "react";
import styles from "./qna.module.css";
import { initialQna } from "@/lib/data/qna";

export default function QnaPage() {
  const [qnaList] = useState(initialQna);
  const [openId, setOpenId] = useState(null);

  const toggleQna = (id) => setOpenId(openId === id ? null : id);

  return (
    <div className={styles.container}>
      <div className={styles.qnaBox}>
        <h2 className={styles.title}>Q&amp;A</h2>
        <p className={styles.subtitle}>
          <em>MovieHub</em> 이용 시 궁금한 점을 확인할 수 있습니다.
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
              <th>조회수</th>
            </tr>
          </thead>

          <tbody>
            {qnaList.map((qna) => (
              <React.Fragment key={qna.id}>
                <tr
                  className={styles.row}
                  onClick={() => toggleQna(qna.id)}
                >
                  <td>{qna.id}</td>
                  <td>{qna.title}</td>
                  <td>{qna.date}</td>
                  <td>{qna.views}</td>
                </tr>
                {openId === qna.id && (
                  <tr className={styles.dropdownRow}>
                    <td colSpan="4">{qna.content}</td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        <div className={styles.footerBtns}>
          <button>아이디 / 패스워드 분실</button>
          <button>사용문의</button>
          <button>회원탈퇴</button>
          <button>고객센터</button>
        </div>
      </div>
    </div>
  );
}
