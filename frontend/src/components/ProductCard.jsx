import React from 'react';
import { Link } from 'react-router-dom';
import { useEcommerce } from '../context/useEcommerce';
import { useLanguage } from '../context/useLanguage';

export default function ProductCard({ product }) {
  const { isFavourite, toggleFavourite, addToCart } = useEcommerce();
  const { t } = useLanguage();
  const favourited = isFavourite(product.id);

  // Icon mapping according to category for consistent visual presentation
  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Seeds':
        return 'bi-flower2';
      case 'Fertilizers':
        return 'bi-moisture';
      case 'Insecticides':
        return 'bi-shield-check';
      case 'Fungicides':
        return 'bi-shield-shaded';
      case 'Plant Growth Regulators':
        return 'bi-graph-up-arrow';
      case 'Micronutrients':
        return 'bi-droplet-half';
      default:
        return 'bi-box-seam';
    }
  };

  return (
    <div className="card h-100 product-card border-0 shadow-sm rounded-3 overflow-hidden bg-white d-flex flex-column" id={`product-card-${product.id}`}>
      {/* Product Image / Visual Badge Container */}
      <div
        className="product-card-image-wrap position-relative p-4 d-flex align-items-center justify-content-center text-center"
        style={{
          backgroundColor: product.imagePlaceholderBg || '#f8faf9',
          minHeight: '190px',
          borderBottom: '1px solid rgba(0,0,0,0.04)'
        }}
      >
        {/* Availability Badge */}
        <span
          className={`badge product-stock-badge rounded-pill ${
            product.isAvailable
              ? 'bg-success-subtle text-success border border-success-subtle'
              : 'bg-secondary-subtle text-secondary border border-secondary-subtle'
          }`}
          id={`stock-badge-${product.id}`}
          title={t(product.availability, product.availability)}
        >
          <span className="stock-dot" aria-hidden="true"></span>
          <span className="stock-label">{t(product.availability, product.availability)}</span>
        </span>

        {/* Favourite Button */}
        <button
          type="button"
          onClick={() => toggleFavourite(product.id, product.name)}
          className={`btn product-favourite-btn ${
            favourited ? 'btn-danger text-white' : 'btn-light text-secondary shadow-sm'
          }`}
          aria-label={favourited ? t('removeFromFavourites', 'Remove from favourites') : t('saveToFavourites', 'Save to favourites')}
          title={favourited ? t('removeFromFavourites', 'Remove from favourites') : t('saveToFavourites', 'Save to favourites')}
          id={`fav-btn-${product.id}`}
        >
          <i className={`bi ${favourited ? 'bi-heart-fill' : 'bi-heart'}`}></i>
        </button>

        {/* Thematic Product Illustration Container */}
        <div className="product-visual-icon-box text-center">
          <div
            className="rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm mb-2"
            style={{
              width: '74px',
              height: '74px',
              backgroundColor: '#ffffff',
              border: '2px solid rgba(19, 93, 61, 0.15)'
            }}
          >
            <i className={`bi ${getCategoryIcon(product.category)} fs-1 text-success`}></i>
          </div>
          <div className="text-secondary small font-monospace fw-semibold" style={{ fontSize: '0.75rem' }}>
            {product.sku}
          </div>
        </div>

        {/* Demo Data Watermark */}
        <span
          className="badge bg-white text-muted border position-absolute bottom-0 end-0 m-2 px-1.5 py-0.5"
          style={{ fontSize: '0.62rem', letterSpacing: '0.02em' }}
        >
          {t('demoData', 'DEMO DATA')}
        </span>
      </div>

      {/* Card Content Body */}
      <div className="card-body p-3 d-flex flex-column flex-grow-1">
        {/* Brand & Category row */}
        <div className="d-flex justify-content-between align-items-center text-muted small mb-1.5">
          <span className="text-truncate pe-1 fw-medium" style={{ fontSize: '0.75rem' }} title={product.brand}>
            {product.brand}
          </span>
          <span className="badge bg-light text-secondary border px-1.5 py-0.5" style={{ fontSize: '0.68rem' }}>
            {t(product.category, product.category)}
          </span>
        </div>

        {/* Product Title */}
        <h6 className="card-title fw-bold text-dark mb-1 line-clamp-2" title={product.name} style={{ minHeight: '2.5rem' }}>
          {product.name}
        </h6>

        {/* Pack Size & Distributing Firm */}
        <div className="d-flex flex-wrap gap-2 align-items-center small text-secondary mb-2" style={{ fontSize: '0.78rem' }}>
          <span>
            <i className="bi bi-box me-1 text-success"></i> {t('packLabel', 'Pack:')} <strong className="text-dark">{product.packSize}</strong>
          </span>
          <span>•</span>
          <span className="text-truncate" title={product.firmName}>
            {t('firmLabel', 'Firm:')} <strong className="text-dark">{product.firmCode}</strong>
          </span>
        </div>

        {/* Brief Description */}
        <p className="card-text text-secondary small mb-3 flex-grow-1 line-clamp-2" style={{ fontSize: '0.8rem' }}>
          {product.description}
        </p>

        {/* Pricing & Call-To-Action Row */}
        <div className="pt-2 border-top mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              {product.priceType === 'configured' && product.price ? (
                <>
                  <span className="fs-5 fw-bold text-success">₹{product.price.toFixed(2)}</span>
                  <small className="text-muted d-block" style={{ fontSize: '0.68rem' }}>
                    {t('demoPriceNotice', '*Indicative Demo Price')}
                  </small>
                </>
              ) : (
                <div>
                  <span className="badge bg-amber-subtle text-amber-emphasis border px-2 py-1 fw-bold" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
                    <i className="bi bi-chat-quote-fill me-1"></i> {t('requestAQuote', 'Request a Quote')}
                  </span>
                  <small className="text-muted d-block mt-0.5" style={{ fontSize: '0.68rem' }}>
                    {t('mandiWholesale', 'Mandi / Bulk Wholesale')}
                  </small>
                </div>
              )}
            </div>
          </div>

          <div className="d-flex gap-2">
            {product.priceType === 'configured' ? (
              <button
                type="button"
                onClick={() => addToCart(product, 1)}
                className="btn btn-sm btn-emerald flex-grow-1 py-1.5"
                id={`add-cart-btn-${product.id}`}
              >
                <i className="bi bi-cart-plus me-1.5"></i> {t('addToCart', 'Add to Cart')}
              </button>
            ) : (
              <Link
                to={`/enquiries?product=${product.sku}&firm=${product.firmCode}`}
                className="btn btn-sm btn-outline-success flex-grow-1 py-1.5 fw-semibold"
                id={`enquire-btn-${product.id}`}
              >
                <i className="bi bi-envelope-paper me-1.5"></i> {t('enquireNow', 'Enquire Now')}
              </Link>
            )}

            <Link
              to={`/enquiries?product=${product.sku}&firm=${product.firmCode}`}
              className="btn btn-sm btn-outline-secondary px-2.5 py-1.5"
              title={t('enquireNow', 'Enquire Now')}
              aria-label={t('enquireNow', 'Enquire about this product')}
            >
              <i className="bi bi-chat-dots"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
