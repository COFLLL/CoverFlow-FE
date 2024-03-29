import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StyledPage, StyledHeader } from '../../../styledComponent.js';

import TabBar from '../../ui/tabBar/tabBar.jsx';
import '../../../asset/sass/pages/myPage/eventPage.scss';
import TitleHeader from '../../ui/header/titleHeader.tsx';

function EventPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <StyledPage className="main-page-container">
      <StyledHeader>
        <TitleHeader pageTitle="이벤트" handleGoBack={handleGoBack} />
      </StyledHeader>
      <TabBar />
    </StyledPage>
  );
}

export default EventPage;
