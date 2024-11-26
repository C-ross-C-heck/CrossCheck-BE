import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    password: '',
    birthday: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      name: formData.name,
      loginId: formData.id,
      password: formData.password,
      birth: formData.birthday
    };

    try {
      const response = await fetch('https://qrwrsukdh4.execute-api.ap-northeast-2.amazonaws.com/signUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      if (response.ok) {
        // 성공 응답 처리
        console.log("회원가입에 성공했습니다:", result.message);
        navigate('/chatbot'); // 성공 시 '/chatbot' 경로로 이동
      } else {
        // 상태 코드에 따라 오류 메시지 분기 처리
        if (response.status === 400) {
          // 400 Bad Request 처리
          if (result.message === "생년월일을 입력해주세요.") {
            alert("생년월일을 입력해주세요.");
          } else {
            alert("잘못된 요청입니다.");
          }
        } else if (response.status === 409) {
          // 409 Conflict 처리
          alert("이미 존재하는 아이디입니다.");
        } else {
          // 기타 오류
          alert("회원가입에 실패했습니다.");
        }
      }
    } catch (error) {
      console.error("요청 실패:", error);
      alert("서버와 통신에 실패했습니다.");
    }
  };

  return (
    <div className="auth-container">
      <div className="logo">Cross Check</div>
      <div className="auth-content">
        <h1 className="auth-title">Register.</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="이름"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input
            type="text"
            placeholder="아이디"
            value={formData.id}
            onChange={(e) => setFormData({...formData, id: e.target.value})}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <input
            type="text"
            placeholder="생년월일 (예: 2001-08-08)"
            value={formData.birthday}
            onChange={(e) => setFormData({...formData, birthday: e.target.value})}
          />
          <button type="submit" className="register-button">회원가입</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
