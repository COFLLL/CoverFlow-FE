import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StatusBar = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid gray;
  margin-top: 10%;
  font-family: pretendard-semibold;
`;

const StatusTab = styled.div`
  width: 50%;
  letter-spacing: -1px;
  text-align: center;
  padding: 10px 0;
  cursor: pointer;
  color: gray;
  border-bottom: 2px solid transparent;
  transition:
    border-bottom 0.3s ease-in-out,
    color 0.3s ease-in-out;
  ${(props) => props.current && 'color: black; border-bottom: 2px solid black;'}
`;
// ======================= 스타일드 컴포넌트

// 서비스 내 공동으로 사용되는 탭 슬라이더 입니다.
// props는section A, sectionB, children을 받습니다.
// section A, sectionB는 각 탭의 제목오로, string을 전달 받습니다.
// children은 section A, sectionB 순서대로 내부에 들어갈 내용을 순차적으로 작성합니다.

export default function SelectSlider({ sectionA, sectionB, children }) {
  const [currentSection, setCurrentSection] = useState('A');

  return (
    <div className="slider-container">
      <StatusBar>
        <StatusTab
          current={currentSection === 'A'}
          onClick={() => setCurrentSection('A')}
        >
          {sectionA}
        </StatusTab>
        <StatusTab
          current={currentSection === 'B'}
          onClick={() => setCurrentSection('B')}
        >
          {sectionB}
        </StatusTab>
      </StatusBar>
      {currentSection === 'A' && children[0]}
      {currentSection === 'B' && children[1]}
    </div>
  );
}

SelectSlider.propTypes = {
  sectionA: PropTypes.string.isRequired,
  sectionB: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};