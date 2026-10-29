import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEcommerce } from '../context/useEcommerce';
import { useLanguage } from '../context/useLanguage';

export default function Navbar() {
  const navigate = useNavigate();
  const { cartCount } = useEcommerce();
  const { language, setLanguage, t, languages } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);

  // Close language dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setIsLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const currentLanguageLabel = languages.find((l) => l.code === language)?.label || 'English';

  return (
    <header className="sticky-top bg-white border-bottom shadow-xs" id="main-header" style={{ zIndex: 1030 }}>
      {/* DESKTOP LAYOUT: ONE HORIZONTAL ROW WITH FOUR MAIN AREAS
          1. Brand Logo - Left
          2. Large Search Bar - Center (widest element, expands horizontally)
          3. Language Selector - Dropdown with English & हिन्दी
          4. Account and Cart - Right */}
      <div className="container py-2.5 py-lg-3">
        <div className="d-flex align-items-center justify-content-between gap-3 gap-xl-4">
          
          {/* AREA 1: BRAND LOGO — LEFT */}
          <Link
            to="/"
            className="d-flex align-items-center text-decoration-none flex-shrink-0 brand-logo-link"
            id="header-brand-logo"
            title="Vinay Agri Inputs — Home"
          >
            {/* Custom Agricultural Sprout / Leaf Symbol */}
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0 logo-sprout-wrapper"
              style={{
                width: '38px',
                height: '38px',
                minWidth: '38px',
                backgroundColor: '#f0fdf4',
                border: '1.5px solid #86efac',
                marginRight: '11px' // Refined 11px horizontal space between icon and brand text
              }}
              aria-hidden="true"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 21V11M12 11C12 7.5 14.5 4 19.5 3C19.5 8 16 11 12 11ZM12 11C12 8.5 9.8 5.5 4.5 5.5C4.5 9.5 7.5 12 12 11Z"
                  stroke="#15803d"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="d-flex flex-column justify-content-center">
              <span
                className="fw-extrabold brand-font tracking-tight d-block lh-1 text-forest-green"
                style={{
                  fontSize: '1.25rem',
                  letterSpacing: '0.02em',
                  color: '#0b2e1e'
                }}
              >
                {t('brandName', 'VINAY AGRI INPUTS')}
              </span>
              <span
                className="text-muted d-none d-sm-block lh-sm"
                style={{ fontSize: '0.70rem', letterSpacing: '0.01em', marginTop: '2px' }}
              >
                {t('brandTagline', 'Tonk, Rajasthan • Agri-Commerce Hub')}
              </span>
            </div>
          </Link>

          {/* AREA 2: LARGE SEARCH BAR — CENTER (Widest Element) */}
          <div className="d-none d-lg-block flex-grow-1 mx-2 mx-xl-4 header-search-container" style={{ maxWidth: '680px' }}>
            <form onSubmit={handleSearchSubmit} className="position-relative w-100" id="desktop-search-form">
              <div
                className="input-group search-input-group rounded-pill overflow-hidden border"
                style={{
                  backgroundColor: '#f8faf9',
                  borderColor: '#e2e8f0',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease'
                }}
              >
                <span className="input-group-text bg-transparent border-0 text-secondary ps-3 pe-2">
                  <i className="bi bi-search fs-6"></i>
                </span>
                <input
                  type="search"
                  className="form-control bg-transparent border-0 py-2 ps-1 pe-3 shadow-none text-dark search-field-custom"
                  placeholder={t('searchPlaceholder', 'Search seeds, fertilizers, brands and more…')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label={t('searchAriaLabel', 'Search agricultural inputs catalog')}
                  id="desktop-search-input"
                />
                <button
                  type="submit"
                  className="btn btn-emerald px-4 rounded-pill fw-semibold text-white my-1 me-1 d-flex align-items-center gap-1.5"
                  id="desktop-search-submit"
                >
                  <span>{t('searchAction', 'Search')}</span>
                </button>
              </div>
            </form>
          </div>

          {/* AREA 3 & 4: RIGHT-ALIGNED ACTIONS (Language Selector, Login, Cart) */}
          <div className="d-flex align-items-center gap-2 gap-sm-2.5 gap-xl-3 flex-shrink-0">
            
            {/* AREA 3: LANGUAGE SELECTOR DROPDOWN */}
            <div className="position-relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="btn btn-sm btn-light border bg-white d-flex align-items-center px-2.5 py-1.5 rounded-3 text-dark language-selector-btn"
                id="language-selector-btn"
                aria-expanded={isLangDropdownOpen}
                aria-haspopup="true"
                title="Select Language / भाषा चुनें"
              >
                <i className="bi bi-translate text-success fs-6"></i>
                <span className="small fw-semibold">{currentLanguageLabel}</span>
                <i className="bi bi-chevron-down text-muted" style={{ fontSize: '0.68rem' }}></i>
              </button>

              {isLangDropdownOpen && (
                <ul
                  className="dropdown-menu dropdown-menu-end show shadow-sm border py-1 mt-1 rounded-3 position-absolute end-0"
                  style={{ minWidth: '135px', zIndex: 1060 }}
                  role="menu"
                  aria-labelledby="language-selector-btn"
                >
                  {languages.map((lang) => (
                    <li key={lang.code}>
                      <button
                        type="button"
                        className={`dropdown-item small py-1.5 px-3 d-flex align-items-center justify-content-between ${
                          language === lang.code ? 'active bg-success text-white fw-bold' : 'text-dark'
                        }`}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangDropdownOpen(false);
                        }}
                      >
                        <span>{lang.label}</span>
                        {language === lang.code && <i className="bi bi-check2"></i>}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* AREA 4: ACCOUNT / LOGIN */}
            <Link
              to="/login"
              className="btn btn-sm btn-light border bg-white d-flex align-items-center px-2.5 py-1.5 rounded-3 text-dark header-action-item text-decoration-none"
              id="header-login-btn"
              title="Customer & Dealer Login"
            >
              <i className="bi bi-person-circle fs-5" style={{ color: '#0b2e1e' }}></i>
              <span className="small fw-semibold d-none d-sm-inline">
                {t('login', 'Login')}
              </span>
            </Link>

            {/* AREA 4: SHOPPING CART */}
            <Link
              to="/cart"
              className="btn btn-sm btn-emerald position-relative d-flex align-items-center px-3 py-1.5 rounded-3 text-white text-decoration-none shadow-xs header-cart-btn"
              title="View Shopping Cart"
              aria-label={`Shopping cart with ${cartCount} items`}
              id="header-cart-btn"
            >
              <i className="bi bi-cart3 fs-6"></i>
              <span className="small fw-bold d-none d-sm-inline">
                {t('cart', 'Cart')}
              </span>
              {cartCount > 0 && (
                <span
                  className="badge rounded-pill bg-white text-dark fw-bold header-cart-badge"
                  style={{ fontSize: '0.72rem' }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

          </div>
        </div>
      </div>

      {/* MOBILE ROW 2: FULL-WIDTH SEARCH BAR BENEATH FIRST ROW */}
      <div className="d-lg-none bg-light border-top px-3 py-2" id="mobile-search-row">
        <form onSubmit={handleSearchSubmit} id="mobile-search-form">
          <div className="input-group input-group-sm rounded-pill overflow-hidden border bg-white">
            <span className="input-group-text bg-white border-0 text-secondary ps-3 pe-1">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="search"
              className="form-control border-0 py-1.5 ps-1 pe-2 shadow-none"
              placeholder={t('searchPlaceholder', 'Search seeds, fertilizers, brands and more…')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label={t('searchAriaLabel', 'Search agricultural inputs catalog')}
              id="mobile-search-input"
            />
            <button type="submit" className="btn btn-emerald px-3 fw-semibold" id="mobile-search-submit">
              {t('searchAction', 'Search')}
            </button>
          </div>
        </form>
      </div>
    </header>
  );
}
