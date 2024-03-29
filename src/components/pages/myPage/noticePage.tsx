import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../asset/sass/pages/myPage/noticePage.scss';
import { StyledHeader, StyledPage } from '../../../styledComponent';
import TitleHeader from '../../ui/header/titleHeader';
import TabBar from '../../ui/tabBar/tabBar';
import Pagination from '../../ui/Pagination';

interface NoticeListProps {
  date: string;
  title: string;
  content: string;
}

function NoticePage() {
  const [activePanelIndex, setActivePanelIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [startNoticeIndex, setStartNoticeIndex] = useState(0);

  const itemsPerPage = 10;

  const navigate = useNavigate();

  const handlePanelToggle = (index) => {
    setActivePanelIndex(activePanelIndex === index ? null : index);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // const handlePageClick = (page) => {
  //   setCurrentPage(page);
  //   setStartNoticeIndex((page - 1) * itemsPerPage);
  // };

  // const handlePreviousGroup = () => {
  //   const previousGroupStart = Math.max(0, startNoticeIndex - itemsPerPage);
  //   const previousGroupPage = Math.ceil(previousGroupStart / itemsPerPage) + 1;
  //   setStartNoticeIndex(previousGroupStart);
  //   setCurrentPage(previousGroupPage);
  // };

  // const handleNextGroup = () => {
  //   const nextGroupStart = Math.min(
  //     totalNotice - itemsPerPage,
  //     startNoticeIndex + itemsPerPage,
  //   );
  //   const nextGroupPage = Math.ceil(nextGroupStart / itemsPerPage) + 1;
  //   setStartNoticeIndex(nextGroupStart);
  //   setCurrentPage(nextGroupPage);
  // };
  const handlePagination = (type) => {
    if (type === 'prev') {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
        setStartNoticeIndex((currentPage - 2) * itemsPerPage);
      }
    } else if (type === 'next') {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
        setStartNoticeIndex(currentPage * itemsPerPage);
      }
    }
  };

  const noticeList: NoticeListProps[] = [...Array(itemsPerPage * 5)].map(
    (_, index) => ({
      date: `2024-01-0${index}`,
      title: `[공지] 개인정보 처리방침 변경 사전 안내`,
      content: `안녕하세요,
기업 정보 QNA 서비스 코버플로우 입니다.
코버플로우를 이용해주시는 회원님께 더 나은 서비스를 제공할 수 있도록
개인정보 처리방침 문서를 변경할 예정임을 알려드립니다.
변경 내용 (v.2.4.1)
고객 지원을 위한 개인정보 수탁사가 변경됩니다.
개인정보 파기 절차와 파기 예외 대상에 대한 내용을 보강했습니다.
개인정보 보호 책임자가 변경됩니다.
변경 시기
변경된 개인정보 처리방침은 시행일인 2024년 3월 30일부터
효력이 발생합니다.`,
    }),
  );

  // const totalNotice = noticeList.length;

  const getPaginatedList = (
    list: NoticeListProps[],
    page: number,
    startIndex: number,
  ) => {
    const endIndex = startIndex + itemsPerPage;
    return list.slice(startIndex, endIndex);
  };

  const paginatedList = getPaginatedList(
    noticeList,
    currentPage,
    startNoticeIndex,
  );

  const totalPages = Math.ceil(noticeList.length / itemsPerPage);

  return (
    <StyledPage className="main-page-container">
      <StyledHeader>
        <TitleHeader pageTitle="공지사항" handleGoBack={handleGoBack} />

        {paginatedList.map((item, index) => (
          <div
            className={`notice-list ${activePanelIndex === index ? 'active' : ''} `}
            key={index}
            onClick={() => handlePanelToggle(index)}
          >
            <h3>{item.date}</h3>
            <h2>{item.title}</h2>
            <div className="panel">
              <div>
                <span>안녕하세요.</span>
                <span>기업 정보 QNA 서비스 코버플로우입니다.</span>
              </div>
              <div>
                <span>
                  코버 플로우를 이용해주시는 회원님께 더 나은 서비스를 제공할 수
                  있도록
                </span>
                <span>
                  개인정보 처리 방침 문서를 변경할 예정임을 알려드립니다.
                </span>
              </div>
              <h3>변경 내용(v.2.4.1)</h3>
              <div>
                <span>고객 지원을 위한 개인정보 수탁사가 변경됩니다.</span>
                <span>
                  개인정보 파기 절차와 파기 예외 대상에 대한 내용을
                  보강하였습니다.
                </span>
                <span>개인정보 보호 책임자가 변경됩니다.</span>
              </div>
              <h3>변경 시기</h3>
              <span>
                변경된 개인정보 처리방침은 시행일인 2024년 3월 30일부터
              </span>
              <span>효력이 발생합니다.</span>
            </div>
          </div>
        ))}

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          handlePagination={handlePagination}
        />
      </StyledHeader>
      <TabBar />
    </StyledPage>
  );
}

export default NoticePage;
