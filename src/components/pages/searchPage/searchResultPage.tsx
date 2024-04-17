import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { StyledPage, StyledHeader } from '../../../styledComponent.ts';
import TitleHeader from '../../ui/header/titleHeader.tsx';
import styled from 'styled-components';
import TabBar from '../../ui/tabBar/tabBar.tsx';

import { BASE_URL } from '../../global/constants/index.ts';
import '../../../asset/sass/pages/searchPage/searchResultPage.scss';
import Plus from '../../../asset/image/plus.svg';
import Warning from '../../../asset/image/warning-triangle.svg';
import '../../../asset/sass/pages/notificationPage/notificationPage.scss';
import SearchInput from '../../ui/searchInput/searchInput.tsx';
import { showErrorToast } from '../../ui/toast/toast.tsx';
import Pagination from '../../ui/Pagination.tsx';

const ResultsContainer = styled.div`
  position: relative;
  background-color: #ffffff;
`;

const ResultItem = styled.li`
  font-size: 18px;
  letter-spacing: -1px;
  list-style: none;
  padding: 1.2rem;
  border-bottom: 1px solid #d0d0d0;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin-bottom: 15px;

  &:hover {
    background-color: #f9f9f9;
    border-color: #d1d1d1;
    border: 2px solid cecece;
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.08),
      0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &::after {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    background-color: #007bff;
    border-radius: 50%;
  }
`;

const IndustryTagContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const IndustryTag = styled.span`
  color: #9b9898;
  font-size: 12px;
  margin: 10% 0% 0% -1%;
`;

const ResultsList = styled.ul`
  padding: 0.6rem;
  margin-top: 8%;
  width: 80%;
  margin-left: 10%;
  display: flex;
  flex-direction: column;
`;

const ResultCount = styled.div`
  letter-spacing: -1px;
  margin: 9% 0% -3% 11%;
  color: #333;
  font-size: 14px;
  font-weight: 600;
`;

const QuestionCount = styled.div`
  font-size: 16px;
  text-align: center;
  flex-shrink: 0;
  color: #428238;
  font-weight: 600;
  background-color: #ffffff;
  border: 1.5px solid #eaeaea;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.05),
    0 1px 2px rgba(0, 0, 0, 0.1);
  padding: 0.6rem 1.2rem;
  border-radius: 0.6rem;
  border-bottom: #d9d9d9;
  &::before {
    content: '질문 수';
    display: block;
    font-size: 0.8em;
    color: #6c757d;
    margin-bottom: 10%;
    font-weight: 400;
  }

  &::after {
    content: '';
    display: block;
    height: 1px;
  }
`;

interface SearchResultProps {
  state: {
    searchResults: {
      companyId: number;
      companyName: string;
      companyType: string;
      questionCount: number;
    }[];
  };
}

interface SearchDataProps {
  companyAddress: string;
  companyId: number;
  companyName: string;
  companyStatus: 'EXAMINATION' | 'REGISTRATION' | 'DELETION';
  companyType: string;
  questionCount: number;
}

export type PageProps = 'prev' | 'next';

function SearchResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');

  const {
    state: { searchResults },
  } = useLocation() as SearchResultProps;
  const [searchData, setSearchData] = useState<SearchDataProps[]>([]);
  const [totalCompanyPages, setTotalCompanyPages] = useState(0);
  const companyList = searchResults?.map((result) => result);
  const companyName = companyList?.map((list) => list.companyName);

  const [currentPage, setCurrentPage] = useState(1);

  const handleGoBack = () => {
    navigate('/search-company');
  };

  useEffect(() => {
    const fetchCompany = async (pageNo: number) => {
      if (!keyword) return;
      try {
        const response = await fetch(
          `${BASE_URL}/api/company?pageNo=${pageNo}&name=${keyword}`,
          {
            method: 'GET',
          },
        );
        const data = await response.json();
        const totalPages = data.data.totalPages;

        setSearchData(data.data.companyList);
        setTotalCompanyPages(totalPages);
        console.log('페이지 내 결과', data.data.companyList);
      } catch (error) {
        showErrorToast(`오류가 여기서발생: ${error}`);
        setSearchData([]);
      }
    };
    fetchCompany(currentPage);
  }, [keyword, currentPage]);

  const goToResultDetailPage = (companyId: number) => {
    navigate(`/company-info/${companyId}`);
  };

  const handlePagination = (type) => {
    if (type === 'prev' && currentPage >= 1) {
      setCurrentPage(currentPage - 1);
    } else if (type === 'next' && currentPage < totalCompanyPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <StyledPage className="main-page-container">
      <StyledHeader>
        <ResultsContainer>
          <TitleHeader pageTitle="검색 결과" handleGoBack={handleGoBack} />
          <SearchInput />
          <ResultCount>
            기업 검색 결과
            <span className="result-count">{companyName.length}</span>
          </ResultCount>
          <ResultsList>
            {searchData ? (
              searchData.map((item) => (
                <ResultItem
                  key={item.companyId}
                  onClick={() => goToResultDetailPage(item.companyId)}
                >
                  <IndustryTagContainer>
                    <span>{item.companyName}</span>
                    <IndustryTag>업종 : {item.companyType}</IndustryTag>
                  </IndustryTagContainer>
                  <QuestionCount>{item.questionCount}</QuestionCount>
                </ResultItem>
              ))
            ) : (
              <span className="result-data-failed">
                <img
                  className="warning-icon"
                  src={Warning}
                  alt="Warning Icon"
                />
                <div className="failed-text">검색 결과가 없습니다.</div>
                <div className="failed-text2">
                  코버플로우에 원하는 기업을 등록해 주세요
                </div>

                <div className="registContainer">
                  <img className="plus-icon" src={Plus} alt="Plus Icon" />
                  <a href="/company-regist" className="company-registration">
                    기업 등록하기
                  </a>
                </div>
              </span>
            )}

            <Pagination
              totalPages={totalCompanyPages}
              currentPage={currentPage}
              handlePagination={handlePagination}
            />
          </ResultsList>
        </ResultsContainer>
        <TabBar />
      </StyledHeader>
    </StyledPage>
  );
}

export default SearchResultPage;
