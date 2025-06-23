import { useState } from 'react';

function EditableComment({ comment, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);

  const handleConfirmDelete = () => {
    const confirm = window.confirm("정말로 삭제하시겠습니까?");
    if (confirm) {
      onDelete();
    }
  };

  const handleSave = () => {
    if (editText.trim() === "") {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    onEdit(editText);
    setIsEditing(false);
  };

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      {isEditing ? (
        <>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            style={{ width: "100%", fontSize: "14px" }}
          />
          <button onClick={handleSave}>저장</button>
          <button onClick={() => setIsEditing(false)}>취소</button>
        </>
      ) : (
        <>
          <span>{comment.content}</span>
          <button onClick={() => setIsEditing(true)}>수정</button>
          <button onClick={handleConfirmDelete}>삭제</button>
        </>
      )}
    </div>
  );
}

export default EditableComment;