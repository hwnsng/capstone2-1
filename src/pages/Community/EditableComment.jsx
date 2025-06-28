import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';

function EditableComment({ comment, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSave = () => {
    if (editText.trim() === "") {
      toast.warning("댓글 내용을 입력해주세요.");
      return;
    }
    onEdit(editText);
    setIsEditing(false);
  };

  const confirmCommentDelete = () => {
    toast.info(
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ marginBottom: '10px' }}>정말로 댓글을 삭제하시겠습니까?</span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              toast.dismiss();
              onDelete();
            }}
            style={{
              backgroundColor: '#538572',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              cursor: 'pointer',
            }}
          >
            확인
          </button>
          <button
            onClick={() => toast.dismiss()}
            style={{
              backgroundColor: '#ccc',
              color: '#333',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              cursor: 'pointer',
            }}
          >
            취소
          </button>
        </div>
      </div>,
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
        closeButton: false,
      }
    );
  };

  return (
    <EditableWrapper>
      {isEditing ? (
        <>
          <EditTextarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <ButtonGroup>
            <SaveButton onClick={handleSave}>저장</SaveButton>
            <CancelButton onClick={() => setIsEditing(false)}>취소</CancelButton>
          </ButtonGroup>
        </>
      ) : (
        <>
          <CommentRow>
            <CommentContent>{comment.content}</CommentContent>
            <DropdownWrapper ref={menuRef}>
              <MoreButton onClick={() => setShowMenu(!showMenu)}>⋯</MoreButton>
              {showMenu && (
                <DropdownMenu>
                  <DropdownItem onClick={() => { setIsEditing(true); setShowMenu(false); }}>수정</DropdownItem>
                  <DropdownItem onClick={confirmCommentDelete}>삭제</DropdownItem>
                </DropdownMenu>
              )}
            </DropdownWrapper>
          </CommentRow>
        </>
      )}
    </EditableWrapper>
  );
}

export default EditableComment;

const EditableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CommentRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const CommentContent = styled.div`
  font-size: 16px;
  color: #2f2f2f;
  white-space: pre-wrap;
  word-break: break-word;
  flex: 1;
`;

const EditTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 10px;
  font-size: 14px;
  border: 2px solid #ccc;
  border-radius: 10px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #999;
    box-shadow: 0 0 4px rgba(150, 150, 150, 0.3);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const BaseButton = styled.button`
  padding: 6px 14px;
  font-size: 13px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
`;

const SaveButton = styled(BaseButton)`
  background-color: #4b6f52;
  color: #fff;

  &:hover {
    background-color: #3e5944;
  }
`;

const CancelButton = styled(BaseButton)`
  background-color: #aaa;
  color: white;

  &:hover {
    background-color: #888;
  }
`;

const DropdownWrapper = styled.div`
  position: relative;
  margin-left: 8px;
`;

const MoreButton = styled.button`
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  color: #555;

  &:hover {
    color: #333;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  top: 24px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  z-index: 10;
`;

const DropdownItem = styled.div`
  width: 55px;
  padding: 8px 12px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  &:hover {
    background-color: #f2f2f2;
  }
`;
