import React, { useState, useEffect } from 'react';
import '../css/chatRoomCreate.css';
import Sidebar from '../../Sidebar/components/Sidebar';

const ChatRoomCreate = ({ onCreateRoom }) => {
  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 컴포넌트 마운트 시 로컬 스토리지에서 userId 불러오기
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId'); // 로컬스토리지에서 userId 가져옴
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      alert('로그인이 필요합니다.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("채팅방 제목을 입력해주세요.");
      return;
    }
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    const requestData = {
      userId, // 로컬스토리지에서 가져온 userId 사용
      title: title.trim(),
    };

    try {
      setIsLoading(true); // 로딩 상태 활성화

      const response = await fetch('https://qrwrsukdh4.execute-api.ap-northeast-2.amazonaws.com/create_chat_room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      console.log('응답 데이터:', result);

      if (response.ok) {
        localStorage.setItem('currentChatRoomId', result.chatRoomId);

        alert("채팅방이 성공적으로 생성되었습니다!");
        onCreateRoom(result); // 부모 컴포넌트에 생성된 채팅방 데이터 전달
      } else {
        console.error('채팅방 생성 실패:', result.message || response.statusText);
        alert(result.message || '채팅방 생성 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error("요청 실패:", error);
      alert("서버와 통신 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false); // 로딩 상태 비활성화
    }
  };

  return (
    <div className="chat-room-create">
      <Sidebar />
      <h1 className="create-title">새로운 채팅방의 제목을 입력해주세요.</h1>
      <form className="input-wrapper" onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목 입력하기..."
            disabled={isLoading} // 로딩 중에는 입력 비활성화
          />
        </div>
        <button
          type="submit"
          className={`create-button ${title.trim() ? 'active' : ''}`}
          disabled={!title.trim() || isLoading} // 제목이 없거나 로딩 중이면 버튼 비활성화
        >
          {isLoading ? '생성 중...' : '채팅방 생성'}
        </button>
      </form>
    </div>
  );
};

export default ChatRoomCreate;
