import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/useLanguage';
import { useAuth } from '../context/useAuth';

export default function LoginPage() {
  const { t } = useLanguage();
  const { user, isAuthenticated, isLoading: isAuthLoading, error: authError, clearError, loginWithGoogle, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isDemoSubmitted, setIsDemoSubmitted] = useState(false);
  const [isGoogleProcessing, setIsGoogleProcessing] = useState(false);

  const googleButtonRef = useRef(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const isClientIdConfigured = Boolean(
    googleClientId && !googleClientId.includes('your_google_client_id_here')
  );

  // Initialize official Google Identity Services button
  useEffect(() => {
    let isMounted = true;

    function renderGoogleButton() {
      if (typeof window === 'undefined' || !window.google?.accounts?.id || !googleButtonRef.current) {
        return false;
      }

      if (!isClientIdConfigured) {
        return true; // Script loaded, but developer needs to add actual client ID
      }

      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (credentialResponse) => {
            if (credentialResponse?.credential && isMounted) {
              setIsGoogleProcessing(true);
              clearError();
              try {
                await loginWithGoogle(credentialResponse.credential);
                const returnUrl = location.state?.from?.pathname || '/';
                navigate(returnUrl, { replace: true });
              } catch (err) {
                console.error('Google Sign-In failed:', err);
              } finally {
                if (isMounted) {
                  setIsGoogleProcessing(false);
                }
              }
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Clear container to avoid duplicate button renders
        if (googleButtonRef.current) {
          googleButtonRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: 320,
          });
        }
        return true;
      } catch (err) {
        console.warn('Google Identity initialization error:', err);
        return false;
      }
    }

    // Try rendering immediately or poll briefly until the async script is ready
    if (!renderGoogleButton()) {
      const pollTimer = setInterval(() => {
        if (renderGoogleButton()) {
          clearInterval(pollTimer);
        }
      }, 150);

      return () => {
        isMounted = false;
        clearInterval(pollTimer);
      };
    }

    return () => {
      isMounted = false;
    };
  }, [googleClientId, isClientIdConfigured, loginWithGoogle, navigate, location, clearError]);

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
                  border: '1.5px solid #86efac',
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

            {/* If user is already authenticated */}
            {isAuthenticated && user ? (
              <div className="text-center py-2" id="authenticated-user-panel">
                <div className="mb-3">
                  {user.pictureUrl ? (
                    <img
                      src={user.pictureUrl}
                      alt={user.name}
                      className="rounded-circle shadow-xs border"
                      style={{ width: '72px', height: '72px', objectFit: 'cover' }}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div
                      className="rounded-circle d-inline-flex align-items-center justify-content-center bg-success-subtle text-success fs-1"
                      style={{ width: '72px', height: '72px' }}
                    >
                      <i className="bi bi-person-check-fill"></i>
                    </div>
                  )}
                </div>

                <div className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1.5 rounded-pill mb-2">
                  <i className="bi bi-shield-check me-1"></i>
                  {user.role === 'ADMIN' ? 'Administrator' : 'Authenticated Farmer / Customer'}
                </div>

                <h4 className="fw-bold text-dark mb-1">{user.name}</h4>
                <p className="text-muted small mb-3">{user.email}</p>

                <div className="alert bg-light border small text-secondary py-2 px-3 rounded-3 mb-4">
                  <i className="bi bi-check-circle-fill text-success me-1.5"></i>
                  {t('activeSessionNotice', 'Your session is active with valid Vinay Agri Inputs JWT.')}
                </div>

                <div className="d-grid gap-2">
                  <Link to="/" className="btn btn-emerald py-2 fw-semibold">
                    <i className="bi bi-shop me-1.5"></i> {t('returnToCatalog', 'Return to Agri Catalog')}
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link to="/admin" className="btn btn-outline-success py-2 fw-semibold">
                      <i className="bi bi-speedometer2 me-1.5"></i> {t('adminPortal', 'Admin Portal')}
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={logout}
                    className="btn btn-outline-danger py-2 fw-semibold"
                    id="login-signout-btn"
                  >
                    <i className="bi bi-box-arrow-right me-1.5"></i> {t('logout', 'Sign Out')}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Authentication Error Banner */}
                {authError && (
                  <div className="alert alert-danger alert-dismissible fade show small py-2.5 px-3 mb-3 rounded-3" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-1.5"></i>
                    <strong>Sign In Error:</strong> {authError}
                    <button
                      type="button"
                      className="btn-close small p-2"
                      onClick={clearError}
                      aria-label="Close"
                    ></button>
                  </div>
                )}

                {/* SECTION 1: GOOGLE ONE-CLICK SIGN IN */}
                <div className="mb-4 text-center">
                  <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider d-block mb-2">
                    {t('fastGoogleAuth', 'Fast & Secure Sign In')}
                  </label>

                  {isGoogleProcessing || isAuthLoading ? (
                    <div className="py-3 text-center">
                      <div className="spinner-border spinner-border-sm text-success me-2" role="status"></div>
                      <span className="small text-secondary fw-medium">
                        Verifying with Vinay Agri Inputs server...
                      </span>
                    </div>
                  ) : isClientIdConfigured ? (
                    <div
                      ref={googleButtonRef}
                      id="google-signin-btn-wrapper"
                      className="d-flex justify-content-center"
                    ></div>
                  ) : (
                    <div className="alert alert-warning text-start small py-2 px-3 rounded-3 mb-2">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <i className="bi bi-info-circle-fill text-warning fs-5"></i>
                        <strong className="text-dark">Google Sign-In Ready</strong>
                      </div>
                      <p className="mb-0 text-secondary" style={{ fontSize: '0.78rem' }}>
                        Set <code>VITE_GOOGLE_CLIENT_ID</code> in <code>.env</code> with your Google Cloud Web Client ID to enable one-click sign-in.
                      </p>
                    </div>
                  )}
                </div>

                {/* DIVIDER */}
                <div className="d-flex align-items-center my-3">
                  <hr className="flex-grow-1 my-0 text-muted" />
                  <span className="px-3 text-muted small fw-medium" style={{ fontSize: '0.78rem' }}>
                    {t('orManualCredentials', 'or continue with demo / manual credentials')}
                  </span>
                  <hr className="flex-grow-1 my-0 text-muted" />
                </div>

                {/* SECTION 2: FALLBACK / DEMO FORM */}
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
                        <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: '0.70rem' }}>
                          {t('demoMode', 'Demo Mode')}
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
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
