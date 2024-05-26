import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import '../../../asset/sass/pages/postPage/questionDetailPage.scss';
import { StyledPage, StyledHeader } from '../../../styledComponent';
import TitleHeader from '../../ui/header/titleHeader';
import Answer from '../../ui/question/answer.tsx';
import TabBar from '../../ui/tabBar/tabBar';
import { BASE_URL } from '../../global/constants';
import Tree from '../../../asset/image/nature-ecology-tree-3--tree-plant-cloud-shape-park.svg';
import Leaf from '../../../asset/image/leaf.svg';
import Reward from '../../../asset/image/reward.svg';
import Dot from '../../../asset/image/dots-vertical.svg';
import '../../../asset/sass/etc/header/userInfoHeader.scss';

import { showErrorToast, showSuccessToast } from '../../ui/toast/toast.tsx';
import { fetchAPI } from '../../global/utils/apiUtil.js';
import Pagination from '../../ui/Pagination.tsx';
import { useSelector } from 'react-redux';
import axios from 'axios';

const LoginButton = styled.button`
  letter-spacing: -0.7px;
  background-color: #ff8d1d !important;
  border-radius: 3px;
  font-weight: 600;
  font-size: 12px;
  margin: 2% 10% 0% 48%;

  padding: 5px 5px;
  width: 15%;
  cursor: pointer;
  margin: 0;
  z-index: 1;
`;

const IsNotLoggedIn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  top: 17%;
  gap: 5px;
  span {
    font-family: 'Pretendard-Semibold';
  }
`;

const ContentBlur = styled.span<{ $isLoggedIn: boolean }>`
  ${({ $isLoggedIn }) =>
    !$isLoggedIn &&
    css`
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      filter: blur(5px);
      text-overflow: ellipsis;
    `}
`;

const Questioner = styled.div`
  letter-spacing: -1px;
  margin: 2rem 0 2rem 4.5%;
  span:first-child {
    font-family: 'Pretendard-Medium';
  }
`;

const QuestionTitle = styled.div`
  span {
    font-family: 'Pretendard-Bold';
    letter-spacing: -1.5px;
    font-size: 3rem;
    /* padding: 10px; */
    text-align: start;
    padding: 1% 0 1% 1.5%;
    color: #000000;
    margin: 2% 0 -1.5% 3%;
    overflow: visible;
    white-space: normal;
    width: 500px;
  }
  display: flex;
  /* padding: 1% 2.5% 1% 2.5%; */
  align-items: flex-start;
  img {
    cursor: pointer;
    margin: 3.7% 0 0 2%;
  }
`;

const QuestionContent = styled.div`
  margin: 3% 0% 7% 4.5%;
  letter-spacing: -1.5px;
  font-size: 2rem;
  color: #000000;
  font-family: 'Pretendard-Regular';
  line-height: 1.5;
`;

const FirstLine = styled.div`
  height: 5px;
  background-color: #fff9f4;
  width: 700px;
  margin: 8% 0% 0% -7.5rem;
`;

const AnswerList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin: 0px 0px 2rem 7.8rem;
`;

export interface AnswerProps {
  answerId: string;
  answererTag: string;
  createAt: string;
  answerContent: string;
  answererNickname: string;
  answerTag?: string;
}

export interface CommentProps {
  answerCount?: number;
  isAdopted: boolean;
  answerId: string;
  answererTag: string;
  createAt: string;
  answerContent: string;
  answererNickname: string;
}

interface AppState {
  user: {
    isLoggedIn: boolean;
  };
}

function QuestionDetailPage() {
  const navigate = useNavigate();
  const handleClickLogin = () => {
    navigate('/login');
  };

  const { questionId } = useParams();

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [questionerNickname, setQuestionerNickname] = useState('');
  // const [answererNickname, setAnswererNickname] = useState('');

  const [questionerTag, setQuestionerTag] = useState('');
  // const [questionTag,setQuestiontag] = useState('');
  const [answerCount, setAnswerCount] = useState(0);
  const [questionTitle, setQuestionTitle] = useState('');
  const [createAt, setCreateAt] = useState('');
  const [reward, setReward] = useState(0);
  const [companyName, setCompanyName] = useState('');
  const [questionContent, setQuestionContent] = useState('');
  const [answers, setAnswers] = useState<CommentProps[]>([]);

  const answerRef = useRef<HTMLTextAreaElement>(null);
  const reportMenuRef = useRef<HTMLDivElement>(null);
  const [postAnswer, setPostAnswer] = useState('');

  const { isLoggedIn } = useSelector((state: AppState) => state.user);

  const [isShowEdit, setIsShowEdit] = useState(false);

  const [isShowReport, setIsShowReport] = useState(false);
  const [isShowReportModal, setIsShowReportModal] = useState(false);
  const [isAdopted, setIsAdopted] = useState(false);
  const [anyAdopted, setAnyAdopted] = useState(false);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleAnswerSubmit = async () => {
    const requestData = {
      content: answerRef.current ? answerRef.current.value : '',
      questionId: Number(questionId),
    };

    try {
      // 답변 내용이 비어있을 경우 에러 던지기
      if (answerRef.current?.value === '') {
        throw new Error('크기가 1에서 500 사이여야 합니다');
      }

      const answerResponse = await fetchAPI('/api/answer', 'POST', requestData);

      if (!answerResponse.ok) {
        if (answerResponse.status === 400) {
          showErrorToast('질문 작성자는 답변 작성이 불가능합니다.');
        }
      }
      if (answerResponse.statusCode === 'CREATED' && answerRef.current) {
        setPostAnswer(answerRef.current?.value);
        showSuccessToast('답변이 등록되었습니다.');

        if (answerRef.current) {
          answerRef.current.value = '';
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        showErrorToast('질문 작성자는 답변 작성이 불가능합니다.');
        if (error.message === '크기가 1에서 500 사이여야 합니다') {
          showErrorToast(error.message);
        }
      }
    }
  };

  const handleEnterKey = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && event.shiftKey === false) {
      handleAnswerSubmit();
    }
  };

  const handlePagination = (direction: string | number) => {
    if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else if (typeof direction === 'number') {
      setCurrentPage(direction);
    }
  };

  const toggleReportPopup = () => {
    setIsShowReport((showReport) => !showReport);
    setIsShowReportModal((showReportModal) => !showReportModal);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        reportMenuRef.current &&
        !reportMenuRef.current.contains(event.target)
      ) {
        setIsShowReport(false);
      }
    };

    if (isShowReport) {
      window.addEventListener('click', handleOutsideClick);
    } else {
      window.removeEventListener('click', handleOutsideClick);
    }

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [isShowReport]);

  const handleEdit = async () => {
    const res = await axios.get(`${BASE_URL}/api/member/me`);

    if (res.data.nickname === questionerNickname) {
      setIsShowEdit((isShow) => !isShow);
    } else if (res.data.nickname !== questionerNickname) {
      setIsShowReport((showReport) => !showReport);
    }
  };

  const handleClickEdit = async () => {
    try {
      const pathSegments = window.location.pathname.split('/');
      const companyId = pathSegments[2];

      const response = await axios.get(
        `${BASE_URL}/api/question/${questionId}?pageNo=${currentPage}&criterion=createdAt`,
      );

      const {
        data: { data },
      } = response;

      setQuestionContent(data.questionContent);
      setQuestionTitle(data.questionTitle);
      setReward(data.reward);

      navigate(`/company-info/${companyId}/question-write`, {
        state: {
          questionTitle,
          questionContent,
          reward,
          companyName,
          questionId,
        },
      });

      // setQuestiontag(questionData.questionTag);
    } catch (error) {
      if (error instanceof Error) showErrorToast(error.message);
    }
  };
  const handleClickDelete = async () => {
    try {
      const response = await fetchAPI(`/api/question/${questionId}`, 'DELETE');

      if (response.error) {
        if (response.status === 409) {
          showErrorToast('답변이 달린 게시물은 삭제할 수 없습니다. ');
          return;
        }
        throw new Error('요청 처리 중 오류가 발생했습니다.');
      } else if (confirm('삭제하시겠습니까?')) {
        showSuccessToast('질문이 삭제되었습니다.');
        const pathSegments = window.location.pathname.split('/');
        const companyId = pathSegments[2];
        navigate(`/company-info/${companyId}`);
      }
    } catch (error) {
      if (error instanceof Error) showErrorToast(error.message);
    }
  };

  const handleReportSubmit = async () => {
    toggleReportPopup();
    await fetchAPI(`/api/report`, 'POST', {
      content: questionContent,
      type: 'QUESTION',
      id: questionId,
    });

    showSuccessToast('신고 접수가 되었습니다.');
  };

  const handleCloseReportPopup = () => {
    setIsShowReportModal(false);
  };

  const fetchData = async () => {
    const response = await axios.get(
      `${BASE_URL}/api/question/${questionId}?pageNo=${currentPage}&criterion=createdAt`,
    );

    const { data } = response.data;

    const adoptedExists = data.answers.some(
      (answer) => answer.selection === true,
    );

    setAnyAdopted(adoptedExists);
    setIsAdopted(adoptedExists);

    setAnswers(
      data.answers.map((answer) => ({
        ...answer,
        isAdopted: answer.selection,
      })),
    );

    setQuestionerNickname(data.questionerNickname);
    setQuestionerTag(data.questionerTag);
    setAnswerCount(data.answerCount);
    setQuestionTitle(data.questionTitle);
    setCreateAt(data.createAt);
    setReward(data.reward);
    setCompanyName(data.companyName);
    setQuestionContent(data.questionContent);
    setTotalPages(data.totalPages);
  };
  useEffect(() => {
    fetchData();
  }, [questionId, postAnswer, currentPage, navigate]);

  const reportReasons = [
    '욕설 혹은 비방표현이 있어요',
    '개인정보 노출 게시물이에요',
    '불법 정보를 포함하고 있어요',
    '스팸 혹은 홍보성 도배글이에요',
    '특정 이용자가 질문, 답변, 채택을 반복해요',
  ];

  const handleOutSideClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event?.target === event?.currentTarget) {
      setIsShowReportModal(false);
    }
  };
  return (
    <StyledPage className="main-page-container">
      <StyledHeader>
        <TitleHeader pageTitle="상세보기" handleGoBack={handleGoBack} />
      </StyledHeader>
      <div className="question-detail-container">
        <div className="job-info">
          <img src={questionerTag === '취준생' ? Leaf : Tree} alt="" />
          <span className={questionerTag === '취준생' ? `leaf` : ''}>
            {questionerTag === '취준생'
              ? `${questionerTag}이 남긴 질문이에요`
              : `${questionerTag}가 남긴 질문이에요`}
          </span>
        </div>
        <QuestionTitle>
          <span>{questionTitle}</span>
          <img onClick={handleEdit} src={Dot} alt="dot" />
        </QuestionTitle>
        {isShowEdit && (
          <div
            onClick={handleOutSideClick}
            className="dropdown-question-detail-menu"
          >
            <ul>
              <li onClick={handleClickEdit} className="dropdown-item-edit">
                수정
              </li>
              <li onClick={handleClickDelete} className="dropdown-item-delete">
                삭제
              </li>
            </ul>
          </div>
        )}
        {isShowReport ? (
          <div
            ref={reportMenuRef}
            onClick={toggleReportPopup}
            className="dropdown-question-detail-report-menu"
          >
            <ul>
              <li className="dropdown-item-report">신고</li>
            </ul>
          </div>
        ) : null}
        <div className="questioner-info">
          <Questioner>
            <span>{questionerNickname || 'Anonymous'}</span>
            <span className="middle">•</span>
            <span className="question-date">{createAt}</span>
          </Questioner>
        </div>

        <QuestionContent>{questionContent}</QuestionContent>
        <div className="company-fish-tag">
          <div className="detailpage-company">{companyName}</div>
          <div className="detailpage-fishbuncount">
            <img src={Reward} alt="reward" />
            {reward}
          </div>
        </div>
        <FirstLine />

        {isShowReportModal && (
          <div onClick={handleOutSideClick} className="report-popup-overlay">
            <div className="report-popup">
              <div className="report-title">사용자 신고</div>
              <div className="report-sub-title">사유 선택</div>

              {reportReasons.map((reason, index) => (
                <label key={index}>
                  <input
                    type="checkbox"
                    name="reason"
                    value={`reason${index + 1}`}
                  />
                  {reason}
                </label>
              ))}

              <div className="reportBtn">
                <button
                  className="close-report-popup"
                  onClick={handleCloseReportPopup}
                >
                  닫기
                </button>
                <button className="submit-report" onClick={handleReportSubmit}>
                  신고하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {!isAdopted ? (
        <div className="comment-section">
          <textarea
            placeholder="남긴 답변은 수정 및 삭제가 불가능하니 신중하게 작성해주세요."
            className="comment-input"
            ref={answerRef}
            maxLength={500}
            onKeyDown={handleEnterKey}
          ></textarea>
          <button className="submit-comment" onClick={handleAnswerSubmit}>
            등록
          </button>
        </div>
      ) : null}
      {!isLoggedIn && (
        <IsNotLoggedIn>
          <span>이 질문의 답변이 궁금하신가요?</span>
          <span>로그인 하시고 답변을 확인해보세요</span>
          <LoginButton onClick={handleClickLogin}>로그인 하러가기</LoginButton>
        </IsNotLoggedIn>
      )}
      <ContentBlur $isLoggedIn={isLoggedIn}>
        <AnswerList>
          <div className="answer-title">
            <span className="question-detail-answer-tag">답변</span>
            <span className="question-detail-answer-cnt"> {answerCount}</span>
          </div>

          {answers.map((answer) => (
            <Answer
              questionerNickname={questionerNickname}
              key={answer.answerId}
              createAt={answer.createAt}
              answerContent={answer.answerContent}
              answererNickname={answer.answererNickname}
              answererTag={answer.answererTag}
              answerId={answer.answerId}
              isAdopted={answer.isAdopted}
              setIsAdopted={setIsAdopted}
              fetchData={fetchData}
              anyAdopted={anyAdopted}
            />
          ))}
        </AnswerList>
      </ContentBlur>

      <TabBar />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePagination={handlePagination}
        className={answers.length === 0 ? 'hidden' : ''}
      />
    </StyledPage>
  );
}

export default QuestionDetailPage;
