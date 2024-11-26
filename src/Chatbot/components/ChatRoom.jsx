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
      const [inputStep, setInputStep] = useState(0);
      const [areOptionsDisabled, setAreOptionsDisabled] = useState(false); // 옵션 버튼 활성화 여부
      const [rentalInfo, setRentalInfo] = useState({
            address: '',
            landlordName: '',
            landlordIdNumber: '',
            landlordResidence: '',
        });
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
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                  });

                  if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Server Error:', errorData);
                        throw new Error('Server Error');
                  }

                  return await response.json();
            } catch (error) {
                  console.error('Communication error:', error);
                  throw error;
            }
      };

      const handleSendMessage = async () => {
            if (!input.trim() && !selectedFile) return;
        
            const newMessage = { type: 'user', content: input.trim(), align: 'right' };
            setMessages((prev) => [...prev, newMessage]);
            setInput('');
            setSelectedFile(null);
        
            // 단계별 챗봇 응답 처리
            if (inputStep === 1) {
                  setRentalInfo((prev) => ({ ...prev, address: input.trim() })); // 주소 저장
                  setMessages(prev => [...prev, {
                        type: 'bot',
                        content: '집주인의 성함과 주민등록번호를 ,로 구분하여 입력해주세요.',
                        align: 'left'
                  }]);
                  setInputStep(2);
            } else if (inputStep === 2) {
                  const [name, idNumber] = input.trim().split(',').map(item => item.trim()); // ,로 나누고 양쪽 공백 제거
                  setRentalInfo((prev) => ({ 
                        ...prev, 
                        landlordName: name || '', // 이름 저장
                        landlordIdNumber: idNumber || '' // 주민등록번호 저장
                  }));
                  setMessages(prev => [...prev, {
                        type: 'bot',
                        content: '집주인의 실거주지를 입력해주세요.',
                        align: 'left'
                  }]);
                  setInputStep(3);
            } else if (inputStep === 3) {
                  setRentalInfo((prev) => ({ ...prev, landlordResidence: input.trim() })); // 실거주지 저장
                  setMessages(prev => [...prev,
                  {
                        type: 'bot',
                        content: 'Document Verification',
                        align: 'left'
                  },
                  {
                        type: 'bot',
                        content: '아래 링크로 이동하여 평가를 위해 PDF 형식의 문서를 다운로드하여 주택 임대 사기의 위험이 있는지 확인하시기 바랍니다.',
                        align: 'left'
                  },
                  {
                        type: 'bot',
                        options: [
                           '건물 등기사항전부증명서',
                            '부동산 등기부등본',
                            '납세 증명서',
                            '지방세 납부 증명서'
                        ]
                  },
                  {
                        type: 'bot',
                        content: '지금부터 다운로드한 PDF 파일을 업로드 하거나 자유롭게 질문해주세요!',
                        align: 'left'
                  }
                  ]);
                  setInputStep(4);
            }
        
            // LLM API 호출 조건
            else if (inputStep === 4) {
                const payload = {
                    chatRoomId: sessionStorage.getItem('currentChatRoomId'),
                    content: input.trim(),
                    type: selectedFile ? 'file' : 'text',
                    file: selectedFile ? await convertFileToBase64(selectedFile) : null,
                    fileName: selectedFile?.name,
                    rentalInfo,
                };
        
                try {
                    const apiResponse = await sendToApiGateway(payload);
                    setMessages((prev) => [...prev, { type: 'bot', content: apiResponse.claudeResponse, align: 'left' }]);
                } catch (error) {
                    setMessages((prev) => [...prev, { type: 'bot', content: '응답을 처리하는 중 오류가 발생했습니다.', align: 'left' }]);
                }
                setInputStep(5);
            }

            else if(inputStep >= 5) {
                  const payload = {
                        chatRoomId: sessionStorage.getItem('currentChatRoomId'),
                        content: input.trim(),
                        type: selectedFile ? 'file' : 'text',
                        file: selectedFile ? await convertFileToBase64(selectedFile) : null,
                        fileName: selectedFile?.name,
                  };
            
                  try {
                        const apiResponse = await sendToApiGateway(payload);
                        setMessages((prev) => [...prev, { type: 'bot', content: apiResponse.claudeResponse, align: 'left' }]);
                  } catch (error) {
                        setMessages((prev) => [...prev, { type: 'bot', content: '응답을 처리하는 중 오류가 발생했습니다.', align: 'left' }]);
                  }
            }
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
            if (areOptionsDisabled) return;

            const userMessage = { type: 'user', content: option, align: 'right' };
            setMessages(prev => [...prev, userMessage]);
            setAreOptionsDisabled(true);

            if (option === '전세상담') {       
                  setMessages(prev => [...prev, {
                        type: 'bot',
                        content: '전세상담을 시작하겠습니다.\n전체 과정을 안내하고 전세 사기의 위험에 함께 접근할 수 있도록 도와드리겠습니다.\n문서에 있는 정보가 이미 알고 있는 내용과 일치하는지 확인하는 것부터 시작하겠습니다.\n임대하려는 부동산의 실제 주소를 입력해주세요.',
                        align: 'left'
                  }]);
                  setInputStep(1);
            } else if (option === '바로 질문하기') {
                  setMessages(prev => [...prev, {
                        type: 'bot',
                        content: '무엇이든 편하게 질문해주세요!',
                        align: 'left'
                  }]);
                  setInputStep(5);
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
                                                      {/* 일반 옵션 버튼인 경우 */}
                                                      {message.options.length === 2 ? (
                                                            message.options.map((option, idx) => (
                                                                  <button
                                                                        key={idx}
                                                                        className="option-button"
                                                                        onClick={() => handleOptionClick(option)}
                                                                  >
                                                                        {option}
                                                                  </button>
                                                            ))
                                                      ) : (
                                                            // Document Verification 버튼들인 경우
                                                            <div className="document-buttons-grid">
                                                                  {message.options.map((document, idx) => (
                                                                        <button
                                                                              key={idx}
                                                                              className="document-button"
                                                                              onClick={() => handleDocumentClick(document)}
                                                                        >
                                                                              {document}
                                                                              <p className="document-description">
                                                                                    {getDocumentDescription(document)}
                                                                              </p>
                                                                        </button>
                                                                  ))}
                                                            </div>
                                                      )}
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
