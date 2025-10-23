"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./write.module.css";

export default function WriteQna() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    alert("Q&A가 등록되었습니다!");
    router.push("/qna"); // 등록 후 목록으로 이동
  };

  return (
    <div className={styles.container}>
      <div className={styles.writeBox}>
        <h2>Q&A 등록</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className={styles.btns}>
            <button type="submit">등록</button>
            <button type="button" onClick={() => router.push("/qna")}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
