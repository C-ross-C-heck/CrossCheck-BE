// src/LegalService/components/LegalService.jsx
import React from 'react';
import '../css/legalService.css';
import calendarIcon from '../assets/calendar-icon.svg';
import callIcon from '../assets/call-icon.svg';
import goodIcon from '../assets/good-icon.svg';
import writeIcon from '../assets/write-icon.svg';
import arrowLeft from '../assets/arrow-left.svg';
import arrowRight from '../assets/arrow-right.svg';
import profile1 from '../assets/profile1.png';
import profile2 from '../assets/profile2.png';
import profile3 from '../assets/profile3.png';
import profile4 from '../assets/profile4.png';

const LegalService = () => {
  const lawyers = [
    { name: '김아름 변호사', company: '법무법인 김앤장', profile: profile1 },
    { name: '송한주 변호사', company: '법무법인 광장', profile: profile2 },
    { name: '이권우 변호사', company: '법무법인 세종', profile: profile3 },
    { name: '김진욱 변호사', company: '법무법인 태평양', profile: profile4 }
  ];

  return (
    <div className="legal-service-container">
      <div className="service-content">
        {/* Pink Header Section */}
        <div className="header-banner">
          <div className="banner-content">
            <h1>빠르고 정확한 법률 중개 서비스</h1>
            <h2>Cross Check</h2>
            <p>
              혹시 전세사기를 당하셨나요?<br />
              저희 서비스를 통해 전세사기 피해를 최소화하세요!
            </p>
          </div>
        </div>

        {/* Service Options Grid */}
        <div className="service-options">
          <div className="service-card">
            <h3>법률중개 예약</h3>
            <img src={calendarIcon} alt="Calendar" />
          </div>
          <div className="service-card">
            <h3>법률중개 기사작성</h3>
            <img src={writeIcon} alt="Write" />
          </div>
          <div className="service-card">
            <h3>빠른 법률중개 연락</h3>
            <img src={callIcon} alt="Call" />
          </div>
          <div className="service-card">
            <h3>리뷰 남기기</h3>
            <img src={goodIcon} alt="Review" />
          </div>
        </div>

        {/* Lawyers Section */}
        <div className="lawyers-section">
          <h2>원하는 변호사에게 상담을 요청하세요!</h2>
          <div className="lawyers-slider">
            <button className="arrow-btn left">
              <img src={arrowLeft} alt="Previous" />
            </button>
            <div className="lawyers-grid">
              {lawyers.map((lawyer, index) => (
                <div key={index} className="lawyer-card">
                  <img src={lawyer.profile} alt={lawyer.name} className="lawyer-profile" />
                  <div className="lawyer-info">
                    <h3>{lawyer.name}</h3>
                    <p>{lawyer.company}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="arrow-btn right">
              <img src={arrowRight} alt="Next" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalService;