// src/Chatbot/components/Chatbot.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ChatRoomCreate from './ChatRoomCreate';
import ChatRoom from './ChatRoom';
import '../css/chatbot.css';

const Chatbot = () => {
  const [roomCreated, setRoomCreated] = useState(false);
  const [roomTitle, setRoomTitle] = useState('');
  const location = useLocation();

  // location.key가 변경될 때마다 상태를 리셋
  useEffect(() => {
    setRoomCreated(false);
    setRoomTitle('');
  }, [location.key]);

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
