import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../genderSelection/genderSelection.scss';

const GenderSelection = ({ onSelectGender }) => {
  const [selectedGender, setSelectedGender] = useState('');

  const handleGenderButtonClick = (gender) => {
    setSelectedGender((prevSelectedGender) =>
      prevSelectedGender === gender ? '' : gender,
    );

    onSelectGender(gender);
  };

  return (
    <div className="gender-button-container">
      <button
        className={`gender-button ${selectedGender === '여성' ? 'selected' : ''}`}
        onClick={() => handleGenderButtonClick('여성')}
      >
        여성
      </button>
      <button
        className={`gender-button ${selectedGender === '남성' ? 'selected' : ''}`}
        onClick={() => handleGenderButtonClick('남성')}
      >
        남성
      </button>
      <button
        className={`gender-button ${selectedGender === '밝히고싶지않음' ? 'selected' : ''}`}
        onClick={() => handleGenderButtonClick('밝히고싶지않음')}
      >
        밝히고 싶지 않음
      </button>
    </div>
  );
};

GenderSelection.propTypes = {
  onSelectGender: PropTypes.func.isRequired,
};

export default GenderSelection;
