import React from 'react';
import '../../../asset/sass/etc/header/header.scss';

function Header() {
  return (
    <header>
      <a href="/" className="header-logo">
        COVERFLOW
      </a>
      <button className="login-btn">로그인 / 가입</button>
    </header>
  );
}

export default Header;
