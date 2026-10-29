import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/useLanguage';

export default function LoginPage() {
  const { t } = useLanguage();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isDemoSubmitted, setIsDemoSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsDemoSubmitted(true);
  };

  return (
    <div className="container py-5" id="login-page">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-sm-5 bg-white">
            {/* Header */}
            <div className="text-center mb-4">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#f0fdf4',
                  border: '1.5px solid #86efac'
                }}
              >
                <i className="bi bi-person-fill text-success fs-2"></i>
              </div>
              <h3 className="fw-bold brand-font text-dark mb-1">
                {t('loginTitle', 'Customer & Dealer Login')}
              </h3>
              <p className="text-secondary small mb-0">
                {t('loginSubtitle', 'Sign in to review saved orders, quotation history, and firm billing in Tonk.')}
              </p>
            </div>

            {/* Technical Notice */}
            <div className="alert bg-light border small text-secondary py-2.5 px-3 mb-4 rounded-3 d-flex align-items-start gap-2">
              <i className="bi bi-info-circle-fill text-success fs-5 mt-0.5"></i>
              <div>
                <strong>{t('authNotice', 'Authentication Notice: Spring Security JWT credentials and SMS OTP dispatch are scheduled for the next backend release. You can test customer browsing, cart operations, and saved favourites freely.')}</strong>
              </div>
            </div>

            {isDemoSubmitted ? (
              <div className="text-center py-3">
                <div className="text-success fs-1 mb-2">
                  <i className="bi bi-check2-circle"></i>
                </div>
                <h5 className="fw-bold text-dark mb-1">{t('demoCredentialsReceived', 'Demo Credentials Received')}</h5>
                <p className="text-secondary small mb-3">
                  {t('signedInAs', 'Signed in as demo customer for')} <strong>{identifier}</strong>.
                </p>
                <div className="d-flex flex-column gap-2">
                  <Link to="/" className="btn btn-emerald btn-sm py-2">
                    {t('returnToCatalog', 'Return to Agri Catalog')}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsDemoSubmitted(false)}
                    className="btn btn-outline-secondary btn-sm py-2"
                  >
                    {t('switchAccount', 'Switch Account')}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} id="login-form">
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">
                    {t('mobileOrEmail', 'Mobile Number or Email')}
                  </label>
                  <input
                    type="text"
                    className="form-control py-2"
                    placeholder={t('mobilePlaceholder', 'e.g. 9829000001 or farmer@example.com')}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    id="login-identifier-input"
                  />
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-bold text-secondary mb-0">
                      {t('passwordOtp', 'Password / OTP')}
                    </label>
                    <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                      {t('demoData', 'Demo Mode')}
                    </span>
                  </div>
                  <input
                    type="password"
                    className="form-control py-2"
                    placeholder={t('password', 'Password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    id="login-password-input"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-emerald w-100 py-2.5 fw-semibold mb-3 shadow-sm"
                  id="login-submit-btn"
                >
                  <i className="bi bi-box-arrow-in-right me-1.5"></i> {t('signIn', 'Sign In')}
                </button>

                <div className="text-center pt-2 border-top">
                  <small className="text-secondary">
                    {t('adminPortalNotice', 'Looking for family enterprise management?')}{' '}
                    <Link to="/admin" className="text-success fw-semibold text-decoration-none">
                      {t('goToAdminPortal', 'Go to Admin Portal →')}
                    </Link>
                  </small>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
