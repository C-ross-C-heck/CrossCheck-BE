import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      loginId: formData.id,
      password: formData.password
    };

    try {
      const response = await fetch('https://qrwrsukdh4.execute-api.ap-northeast-2.amazonaws.com/signIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      console.log('Result:', result);

      if (response.ok) {
        // 로그인 성공 시 userId를 세션에 저장
        sessionStorage.setItem('userId', formData.id); // 서버 응답에서 userId를 가져옴
        alert("로그인에 성공했습니다!");
        navigate('/Chatbot'); // 성공적으로 로그인 후 Chatbot 페이지로 이동
      } else {
        alert(result.message || "로그인 실패");
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
        <h1 className="auth-title">Login.</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="아이디"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <div className="button-group">
            <button type="submit">Login</button>
            <button type="button" onClick={() => navigate('/Register')} className="secondary">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
