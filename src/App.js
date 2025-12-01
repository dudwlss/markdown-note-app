import React, { useState, useEffect } from "react";
import NoteEditor from "./components/NoteEditor";
import NotePreview from "./components/NotePreview";
import NoteListSidebar from "./components/NoteListSidebar";
import "./App.css";

// --- LocalStorage에서 데이터를 불러오는 유틸리티 함수 ---
const loadNotesFromLocalStorage = () => {
  const storedNotes = localStorage.getItem("notes");
  if (storedNotes) {
    try {
      // JSON 문자열을 객체 배열로 변환
      return JSON.parse(storedNotes);
    } catch (error) {
      console.error("Error parsing stored notes:", error);
      // 파싱 오류 시 기본 초기 노트 반환
      return [
        {
          id: 1,
          title: "첫 번째 노트",
          content: "# 시작!\n\n여기에 내용을 수정해보세요.",
        },
      ];
    }
  }
  // 저장된 데이터가 없으면 기본 초기 노트 배열 반환
  return [
    {
      id: 1,
      title: "첫 번째 노트",
      content: "# 시작!\n\n여기에 내용을 수정해보세요.",
    },
  ];
};

function App() {
  // 1. 노트 목록 상태 (초기값은 localStorage 또는 기본 노트)
  const [noteList, setNoteList] = useState(loadNotesFromLocalStorage);

  // 2. 현재 선택된 노트 ID 상태
  const initialSelectedId = noteList.length > 0 ? noteList[0].id : null;
  const [selectedNoteId, setSelectedNoteId] = useState(initialSelectedId);

  // 3. 현재 에디터에 표시될 내용
  const selectedNote = noteList.find((note) => note.id === selectedNoteId);
  const [currentNoteContent, setCurrentNoteContent] = useState(
    selectedNote ? selectedNote.content : "# 새 노트"
  );

  // ----------------------------------------------------
  // LocalStorage 동기화 로직
  // noteList 상태가 변경될 때마다 데이터를 저장합니다.
  // ----------------------------------------------------
  useEffect(() => {
    try {
      localStorage.setItem("notes", JSON.stringify(noteList));
    } catch (error) {
      console.error("Error saving to localStorage", error);
    }
  }, [noteList]);

  // ----------------------------------------------------
  // 노트 선택/변경 시 에디터 내용 동기화 로직
  // selectedNoteId가 변경될 때마다 에디터 내용을 업데이트합니다.
  // ----------------------------------------------------
  useEffect(() => {
    const noteToLoad = noteList.find((note) => note.id === selectedNoteId);
    if (noteToLoad) {
      setCurrentNoteContent(noteToLoad.content);
    } else if (noteList.length === 0) {
      // 모든 노트 삭제 시 초기화
      setCurrentNoteContent("# 새 노트");
    }
  }, [selectedNoteId, noteList]);

  // --- CRUD 함수 정의 ---

  // A. 새 노트 추가 (Create)
  const handleAddNote = () => {
    const newId = Date.now();
    const newNote = {
      id: newId,
      title: "제목 없음",
      content: "# 새 노트",
    };
    setNoteList((prevList) => [newNote, ...prevList]);
    setSelectedNoteId(newId);
    // currentNoteContent는 useEffect에 의해 자동으로 업데이트됨
  };

  // B. 노트 선택/로드 (Read)
  const handleSelectNote = (id) => {
    if (id !== selectedNoteId) {
      setSelectedNoteId(id);
    }
    // currentNoteContent는 useEffect에 의해 자동으로 업데이트됨
  };

  // C. 노트 저장/수정 (Update)
  const handleSaveNote = () => {
    if (!selectedNoteId)
      return alert("선택된 노트가 없습니다. 새 노트를 추가해주세요.");

    const updatedNoteList = noteList.map((note) => {
      if (note.id === selectedNoteId) {
        // 첫 번째 줄을 제목으로 사용하고, # 기호 제거
        const newTitle =
          currentNoteContent.split("\n")[0].replace(/#/g, "").trim() ||
          "제목 없음";
        return {
          ...note,
          title: newTitle,
          content: currentNoteContent, // 에디터의 최신 내용을 저장
        };
      }
      return note;
    });

    setNoteList(updatedNoteList);
    // 저장 후 alert 대신 간단한 콘솔 로그나 UI 피드백을 사용하는 것이 더 좋습니다.
    console.log(
      `노트 "${
        updatedNoteList.find((n) => n.id === selectedNoteId)?.title
      }"가 저장되었습니다.`
    );
  };

  // D. 노트 삭제 (Delete)
  const handleDeleteNote = () => {
    if (!selectedNoteId) return;

    const confirmed = window.confirm("정말로 이 노트를 삭제하시겠습니까?");
    if (confirmed) {
      const filteredList = noteList.filter(
        (note) => note.id !== selectedNoteId
      );
      setNoteList(filteredList);

      if (filteredList.length > 0) {
        // 남은 노트 중 첫 번째 노트를 선택
        setSelectedNoteId(filteredList[0].id);
      } else {
        // 남은 노트가 없으면 선택 상태 초기화
        setSelectedNoteId(null);
      }
      // currentNoteContent는 useEffect에 의해 자동으로 업데이트됨
    }
  };

  return (
    <div className="app-container">
      <h1>React Markdown Note App</h1>
      <div className="content-main">
        {/* 사이드바 컴포넌트 */}
        <NoteListSidebar
          noteList={noteList}
          selectedNoteId={selectedNoteId}
          onSelectNote={handleSelectNote}
          onAddNote={handleAddNote}
        />

        <div className="editor-area">
          {/* 저장 및 삭제 버튼 */}
          <div className="action-buttons">
            <button onClick={handleSaveNote} disabled={!selectedNoteId}>
              💾 저장
            </button>
            <button
              onClick={handleDeleteNote}
              disabled={!selectedNoteId}
              className="delete-button"
            >
              🗑️ 삭제
            </button>
          </div>

          <div className="content-panel">
            {/* 에디터와 미리보기 패널 */}
            <NoteEditor
              content={currentNoteContent}
              onContentChange={setCurrentNoteContent}
            />
            <NotePreview content={currentNoteContent} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
