// src/Community/components/CommunityBoard.jsx
import React from 'react';
import PostItem from './PostItem';
import arrowLeft from '../assets/arrow-left.svg';
import arrowRight from '../assets/arrow-right.svg';

const posts = [
  { id: 1, number: "01", title: "집 계약할 때 뭐 먼저 봐야하나요?", writer: "집돌이", date: "2024.11.02", views: 112, likes: 30, comments: 5 },
  { id: 2, number: "02", title: "자취생 저녁 메뉴 추천", writer: "자취생", date: "2024.10.28", views: 329, likes: 54, comments: 10 },
  { id: 3, number: "03", title: "첫 전세 계약할 때 챙겨야할 서류", writer: "법사", date: "2024.10.25", views: 219, likes: 27, comments: 16 },
  { id: 4, number: "04", title: "부동산 중개수수료 협의 가능한가요?", writer: "도미야", date: "2024.10.23", views: 498, likes: 38, comments: 16 },
  { id: 5, number: "05", title: "전세자금대출 심사 얼마나 걸리나요?", writer: "하우스", date: "2024.10.20", views: 284, likes: 13, comments: 16 },
  { id: 6, number: "06", title: "보증금 올려주면 월세 낮춰준다는데 괜찮을까요?", writer: "부동산 초보", date: "2024.10.19", views: 351, likes: 32, comments: 16 },
  { id: 7, number: "07", title: "신축 아파트 하자보수 기간이 어떻게 되나요?", writer: "내 집", date: "2024.10.16", views: 257, likes: 14, comments: 16 },
  { id: 8, number: "08", title: "집주인이 갑자기 계약 취소하자고 하네요ㅠㅠ", writer: "집순이", date: "2024.10.02", views: 184, likes: 40, comments: 16 },
];

const CommunityBoard = () => {
  return (
    <div className="board-wrapper">
      <div className="board-header">
        <div className="header-item">No.</div>
        <div className="header-item flex-grow">Title</div>
        <div className="header-item">Writer</div>
        <div className="header-item">Date</div>
        <div className="header-item">Views</div>
        <div className="header-item">Likes</div>
        <div className="header-item">Comments</div>
      </div>
      
      <div className="board-contents">
        {posts.map((post) => (
          <PostItem key={post.id} {...post} />
        ))}
      </div>

      <div className="pagination">
        <img src={arrowLeft} alt="Previous" />
        <span>1</span>
        <img src={arrowRight} alt="Next" />
      </div>
    </div>
  );
};

export default CommunityBoard;