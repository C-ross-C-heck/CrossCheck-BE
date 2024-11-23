import React, { useState, useRef, useEffect } from 'react';
import '../css/chatRoom.css';
import Sidebar from '../../Sidebar/components/Sidebar';

const ChatRoom = () => {
      <Sidebar />
      const [messages, setMessages] = useState([
            {
                  type: 'bot',
                  content: '안녕하세요. 저는 크로스 체크의 챗봇입니다.'
            },
            {
                  type: 'bot',
                  options: ['전세상담', '바로 질문하기']
            }
      ]);

      const [input, setInput] = useState('');
      const [selectedFile, setSelectedFile] = useState(null);
      const [inputStep, setInputStep] = useState(1);
      const [isTextareaEnabled, setIsTextareaEnabled] = useState(false); // 텍스트 입력 활성화 여부
      const [areOptionsDisabled, setAreOptionsDisabled] = useState(false); // 옵션 버튼 활성화 여부
      const messagesEndRef = useRef(null);
      const fileInputRef = useRef(null);

      const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      };

      useEffect(() => {
            scrollToBottom();
      }, [messages]);

      const convertFileToBase64 = (file) => {
            return new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => resolve(reader.result);
                  reader.onerror = (error) => reject(error);
            });
      };

      const sendToApiGateway = async (payload) => {
            const url = 'https://qrwrsukdh4.execute-api.ap-northeast-2.amazonaws.com/send_message';
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
        
                if (!response.ok) {
                    const errorData = await response.json();  // 서버에서 반환된 에러 메시지 확인
                    console.error('Server Error Response:', errorData);
                    throw new Error('Network response was not ok');
                }
        
                return await response.json();  // 서버의 성공 응답 반환
            } catch (error) {
                console.error('API Gateway communication error:', error);
                throw error;
            }
      };

      const handleSendMessage = async () => {
            if (!input.trim() && !selectedFile) return;
        
            let newMessage = {
                type: 'user',
                content: input.trim(),  // 반드시 필요
                align: 'right',
            };
        
            if (selectedFile) {
                try {
                    const base64File = await convertFileToBase64(selectedFile);
                    newMessage.file = {
                        name: selectedFile.name,
                        data: base64File,
                        type: selectedFile.type
                    };
                } catch (error) {
                    console.error('File conversion failed:', error);
                }
            }
        
            setMessages(prev => [...prev, newMessage]);  // 로컬 상태 업데이트
        
            // 서버로 보낼 데이터 구성
            const payload = {
                chatRoomId: localStorage.getItem('currentChatRoomId'),  // 반드시 포함
                content: input.trim(),
                type: selectedFile ? 'file' : 'text',
                file: selectedFile ? newMessage.file.data : null,
                fileName: selectedFile ? selectedFile.name : null
            };
        
            // API Gateway로 메시지 전송
            try {
                const apiResponse = await sendToApiGateway(payload);
                setMessages(prev => [...prev, {
                    type: 'bot',
                    content: apiResponse.reply,  // 응답 메시지
                    align: 'left',
                }]);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        
            setInput('');
            setSelectedFile(null);
      };

      const handleDocumentClick = (document) => {
            window.open('http://www.iros.go.kr/', '_blank');

            setMessages(prev => [...prev, {
                  type: 'user',
                  content: `${document} 확인하기`,
                  align: 'right'
            }]);
      };

      const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                  if (!e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                  }
            }
      };

      const handleSubmit = (e) => {
            e.preventDefault();
            handleSendMessage();
      };

      const handleFileSelect = (e) => {
            const file = e.target.files[0];
            if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                        alert('File size should not exceed 5MB');
                        return;
                  }
                  setSelectedFile(file);
                  setInput(prev => prev + ` [File: ${file.name}]`);
            }
      };

      const handleOptionClick = async (option) => {
            if (areOptionsDisabled) return; // 이미 비활성화 상태면 실행 금지

            const userMessage = { type: 'user', content: option, align: 'right' };
            setMessages(prev => [...prev, userMessage]);

            setIsTextareaEnabled(true); // 텍스트 입력 활성화
            setAreOptionsDisabled(true); // 옵션 버튼 비활성화

            if (option === '전세상담') {
                  setTimeout(() => {
                        setMessages(prev => [...prev, {
                              type: 'bot',
                              content: '집주인의 성함과 주민등록번호를 입력해주세요.',
                              align: 'left'
                        }]);
                        setInputStep(2);
                  }, 1000);
            }
            else if (option === '바로 질문하기') {
                  setTimeout(() => {
                        setMessages(prev => [...prev, {
                              type: 'bot',
                              content: '편하게 질문해주세요.',
                              align: 'left'
                        }]);
                        setInputStep(4); // API Gateway 단계로 이동
                  }, 1000);
            }
      };

      const getDocumentDescription = (document) => {
            const descriptions = {
                  '건물 등기사항전부증명서': '건물에 관한 등기기록 사항의 전부 또는 일부를 증명하는 서면',
                  '부동산 등기부등본': '부동산에 관한 권리 관계를 적어 두는 등기부를 복사한 증명 문서',
                  '납세 증명서': '임대인에게 미지급 국세 납부액이 있는지 평가',
                  '지방세 납부 증명서': '임대인에게 미납 지방세 납부액이 있는지 평가'
            };
            return descriptions[document] || '';
      };

      return (
            <div className="chat-room">
                  <div className="chat-messages">
                        {messages.map((message, index) => (
                              <div key={index} className={`message ${message.type}`}>
                                    {message.type === 'bot' && (
                                          <div className="bot-icon">
                                                <img src="../chatbot-icon.png" alt="Bot" width="22" height="19" />
                                          </div>
                                    )}
                                    <div className="message-content">
                                          {message.content ? (
                                                <>
                                                      {typeof message.content === 'string' ? (
                                                            message.content.split('\n').map((line, i) => (
                                                                  <p key={i}>{line}</p>
                                                            ))
                                                      ) : (
                                                            <p>{message.content}</p>
                                                      )}
                                                </>
                                          ) : message.options ? (
                                                <div className="options-container">
                                                      {message.options.map((option, idx) => (
                                                            <button
                                                                  key={idx}
                                                                  className="option-button"
                                                                  onClick={() => handleOptionClick(option)}
                                                                  disabled={areOptionsDisabled} // 버튼 비활성화
                                                            >
                                                                  {option}
                                                            </button>
                                                      ))}
                                                </div>
                                          ) : null}
                                    </div>
                              </div>
                        ))}
                        <div ref={messagesEndRef} />
                  </div>
                  <form onSubmit={handleSubmit} className="chat-input-wrapper">
                        <div className="chat-input-container">
                              <label className="file-upload-button">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="#FF69B4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <input
                                          type="file"
                                          onChange={handleFileSelect}
                                          ref={fileInputRef}
                                          style={{ display: 'none' }}
                                    />
                              </label>
                              <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Type the words..."
                                    className="chat-input"
                                    rows={1}
                                    style={{
                                          resize: 'none',
                                          minHeight: '40px',
                                          maxHeight: '120px',
                                          overflowY: 'auto'
                                    }}
                                    disabled={!isTextareaEnabled} // 비활성화 처리
                              />
                        </div>
                        <button
                              type="submit"
                              className={`send-button ${!input.trim() && !selectedFile ? 'disabled' : ''}`}
                              disabled={!input.trim() && !selectedFile}
                        >
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 20L4 12L12 4L13.425 5.425L7.825 11H20V13H7.825L13.425 18.575L12 20Z" fill="white" transform="rotate(180 12 12)" />
                              </svg>
                        </button>
                  </form>
            </div>
      );
};

export default ChatRoom;
