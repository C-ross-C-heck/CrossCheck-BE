// src/Chatbot/components/Chatbot.jsx

// 챗봇 Page의 Container
import React, { useState } from 'react';
import ChatRoomCreate from './ChatRoomCreate';
import ChatRoom from './ChatRoom';
import '../css/chatbot.css';

const Chatbot = () => {
  const [roomCreated, setRoomCreated] = useState(false);
  const [roomTitle, setRoomTitle] = useState('');

  const handleCreateRoom = (title) => {
    setRoomTitle(title);
    setRoomCreated(true);
  };

  return (
    <div className="chatbot-container">
      {!roomCreated ? (
        <ChatRoomCreate onCreateRoom={handleCreateRoom} />
      ) : (
        <ChatRoom title={roomTitle} />
      )}
    </div>
  );
};

export default Chatbot;