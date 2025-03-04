import React, { useState } from 'react';

function LanguageDropdown({ lang, onChangeLanguage }) {
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => setOpen(!open);

  const selectLanguage = (value) => {
    onChangeLanguage({ target: { value } });
    setOpen(false);
  };

  return (
    <div className="language-dropdown">
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        {lang === 'en' ? '🇺🇸 English' : '🇧🇷 Português'}
        <span className="arrow">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <ul className="dropdown-menu">
          <li onClick={() => selectLanguage('en')}>
            <span className="flag">🇺🇸</span> English
          </li>
          <li onClick={() => selectLanguage('pt')}>
            <span className="flag">🇧🇷</span> Português
          </li>
        </ul>
      )}
    </div>
  );
}

export default LanguageDropdown;
