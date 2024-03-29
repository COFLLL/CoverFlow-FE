import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../asset/sass/pages/myPage/feedbackPage.scss';
import { StyledPage, StyledHeader } from '../../../styledComponent.js';
import TitleHeader from '../../ui/header/titleHeader.tsx';
import TabBar from '../../ui/tabBar/tabBar.jsx';
import Button from '../../ui/button/Button/Button.jsx';
import TextArea from '../../ui/inputbox/TextArea.jsx';
import { showErrorToast, showSuccessToast } from '../../ui/toast/toast.tsx';
import { fetchAPI } from '../../global/utils/apiUtil.js';
function FeedbackPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };
  const [contact, setcontact] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setcontact(value);
  };

  const submitFeedback = async () => {
    try {
      if (contact.length < 11) {
        showErrorToast('피드백을 10자 이상 작성해주세요.');
        return;
      }

      const body = { content: contact };
      const data = await fetchAPI('/api/feedback', 'POST', body);

      if (data.statusCode === 'CREATED') {
        showSuccessToast('피드백 등록이 완료되었습니다!');
        navigate('/');
      }
    } catch (error) {
      console.error('피드백 등록 실패:', error);
      showErrorToast('피드백 등록에 실패했습니다.');
    }
  };
  return (
    <StyledPage className="main-page-container">
      <StyledHeader>
        <TitleHeader pageTitle="피드백 남기기" handleGoBack={handleGoBack} />
      </StyledHeader>
      <div className="feedback-container">
        <div className="feedback-title-wrapper">
          <span className="feedback-title">서비스에 대한</span>
          <span className="feedback-title">소중한 후기를 남겨주세요.</span>
          <span className="feedback-content">
            피드백을 적극 반영하여 더 나은 서비스가 되겠습니다.
          </span>
        </div>
        <TextArea
          placeholder="내용을 입력해주세요."
          name="content"
          value={contact}
          handleChange={handleChange}
          variant={'round'}
        />

        <Button
          variant={'round'}
          disabled={contact === ''}
          onClick={submitFeedback}
        >
          제출하기
        </Button>
      </div>
      <TabBar />
    </StyledPage>
  );
}

export default FeedbackPage;
