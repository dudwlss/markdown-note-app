// src/components/NotePreview.js
import React from "react";
import ReactMarkdown from "react-markdown";

function NotePreview({ content }) {
  return (
    <div className="preview-panel">
      <h2>👀 미리보기</h2>
      <div className="markdown-output">
        {/* react-markdown 컴포넌트를 사용하여 마크다운 텍스트를 HTML로 렌더링 */}
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

export default NotePreview;
