// src/components/NoteListSidebar.js
import React from "react";

function NoteListSidebar({
  noteList,
  selectedNoteId,
  onSelectNote,
  onAddNote,
}) {
  return (
    <div className="sidebar-panel">
      <button onClick={onAddNote} className="add-note-button">
        + 새 노트 추가
      </button>

      <h3>노트 목록</h3>
      <ul className="note-list">
        {noteList.map((note) => (
          <li
            key={note.id}
            // 현재 선택된 노트에만 'active' 클래스를 적용하여 시각적으로 표시
            className={`note-item ${
              note.id === selectedNoteId ? "active" : ""
            }`}
            onClick={() => onSelectNote(note.id)} // 클릭 시 해당 노트 로드
          >
            {/* 노트 제목을 표시 (제목이 없으면 "제목 없음") */}
            {note.title || "제목 없음"}
          </li>
        ))}
        {noteList.length === 0 && (
          <li className="no-notes">노트가 없습니다.</li>
        )}
      </ul>
    </div>
  );
}

export default NoteListSidebar;
