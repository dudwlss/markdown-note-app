// src/components/NoteEditor.js
import React from "react";

function NoteEditor({ content, onContentChange }) {
  // 사용자 입력 시 호출될 핸들러 함수
  const handleChange = (e) => {
    // 부모 컴포넌트에서 받은 onContentChange 함수를 호출하여 상태 업데이트
    onContentChange(e.target.value);
  };

  return (
    <div className="editor-panel">
      <h2>📝 편집기</h2>
      <textarea
        value={content} // Props로 받은 현재 내용을 표시
        onChange={handleChange} // 입력 변화 감지
        placeholder="여기에 마크다운 문법을 입력하세요..."
      />
    </div>
  );
}

export default NoteEditor;
