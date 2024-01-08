import React from 'react';
import PropTypes from 'prop-types';
import '../../../asset/sass/etc/tabBar/tabBar.scss';

function TabBar(props) {
  return (
    <div className="tab-bar">
      <button
        className={`tab-btn ${props.activeTab === 0 ? 'active' : ''}`}
        onClick={() => props.changeTab(0)}
      >
        마이페이지
      </button>
      <button
        className={`tab-btn ${props.activeTab === 1 ? 'active' : ''}`}
        onClick={() => props.changeTab(1)}
      >
        알림
      </button>
    </div>
  );
}

TabBar.propTypes = {
  activeTab: PropTypes.number.isRequired,
  changeTab: PropTypes.func.isRequired,
};

export default TabBar;
