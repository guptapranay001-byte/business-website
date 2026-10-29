import React from 'react';
import { Link } from 'react-router-dom';
import { useEcommerce } from '../context/useEcommerce';
import { useLanguage } from '../context/useLanguage';

export default function FavouritesDrawer({ isOpen, onClose }) {
  const { favouriteProducts, toggleFavourite, addToCart } = useEcommerce();
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="offcanvas-backdrop fade show"
        style={{ zIndex: 1050 }}
        onClick={onClose}
      ></div>

      {/* Slide-over Drawer */}
      <div
        className="offcanvas offcanvas-end show shadow-lg"
        tabIndex="-1"
        style={{
          visibility: 'visible',
          zIndex: 1055,
          maxWidth: '460px',
          width: '100%'
        }}
        id="favourites-drawer"
        role="dialog"
        aria-labelledby="favourites-drawer-title"
      >
        <div className="offcanvas-header bg-light border-bottom py-3">
          <div className="d-flex align-items-center gap-2">
            <span className="p-2 rounded bg-danger-subtle text-danger">
              <i className="bi bi-heart-fill"></i>
            </span>
            <h5 className="offcanvas-title fw-bold text-dark mb-0" id="favourites-drawer-title">
              {t('savedFavourites', 'Saved Favourites')} ({favouriteProducts.length})
            </h5>
          </div>
          <button
            type="button"
            className="btn-close text-reset"
            onClick={onClose}
            aria-label={t('close', 'Close')}
          ></button>
        </div>

        <div className="offcanvas-body p-3 d-flex flex-column">
          {favouriteProducts.length > 0 ? (
            <div className="d-flex flex-column gap-3 flex-grow-1 overflow-auto">
              {favouriteProducts.map((product) => (
                <div
                  key={product.id}
                  className="card border rounded-3 p-3 shadow-sm bg-white"
                  id={`fav-item-${product.id}`}
                >
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <span className="badge bg-light text-secondary border small">
                      {t(product.category, product.category)}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleFavourite(product.id, product.name)}
                      className="btn btn-sm btn-outline-danger border-0 p-1"
                      title={t('removeFromFavourites', 'Remove from favourites')}
                      aria-label={`${t('removeFromFavourites', 'Remove')} ${product.name}`}
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>

                  <h6 className="fw-bold text-dark mb-1">{product.name}</h6>
                  <div className="small text-muted mb-2">
                    {t('packLabel', 'Pack:')} {product.packSize} • {t('firmLabel', 'Firm:')} {product.firmCode}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                    <div>
                      {product.price ? (
                        <span className="fw-bold text-success">₹{product.price.toFixed(2)}</span>
                      ) : (
                        <span className="badge bg-warning-subtle text-warning-emphasis">{t('quoteOnly', 'Quote Only')}</span>
                      )}
                    </div>
                    <div>
                      {product.price ? (
                        <button
                          type="button"
                          onClick={() => addToCart(product, 1)}
                          className="btn btn-sm btn-emerald py-1 px-3"
                        >
                          <i className="bi bi-cart-plus me-1"></i> {t('addToCart', 'Add to Cart')}
                        </button>
                      ) : (
                        <Link
                          to={`/enquiries?product=${product.sku}&firm=${product.firmCode}`}
                          onClick={onClose}
                          className="btn btn-sm btn-outline-success py-1 px-3"
                        >
                          {t('enquireNow', 'Enquire Now')}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5 my-auto">
              <div
                className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '80px', height: '80px' }}
              >
                <i className="bi bi-heart text-muted fs-1"></i>
              </div>
              <h5 className="fw-bold text-dark mb-2">{t('emptyFavourites', 'No Favourites Saved Yet')}</h5>
              <p className="text-secondary small mb-4 px-3">
                {t('emptyFavouritesSubtext', 'Click the heart icon on any product card in the catalog to save it to your wishlist for quick review.')}
              </p>
              <Link
                to="/products"
                onClick={onClose}
                className="btn btn-emerald px-4 py-2"
              >
                {t('exploreProducts', 'Browse Agri Catalog')}
              </Link>
            </div>
          )}

          {favouriteProducts.length > 0 && (
            <div className="pt-3 border-top mt-auto">
              <Link
                to="/products"
                onClick={onClose}
                className="btn btn-outline-secondary w-100 py-2 small"
              >
                {t('continueShopping', 'Continue Exploring Catalog')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
