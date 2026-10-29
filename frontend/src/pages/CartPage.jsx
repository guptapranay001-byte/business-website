import React from 'react';
import { Link } from 'react-router-dom';
import { useEcommerce } from '../context/useEcommerce';
import { useLanguage } from '../context/useLanguage';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useEcommerce();
  const { t } = useLanguage();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.product.price || 0) * item.quantity,
    0
  );
  const estimatedTax = subtotal * 0.05; // 5% standard agricultural input benchmark
  const total = subtotal + estimatedTax;

  return (
    <div className="container py-4 py-lg-5" id="cart-page">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-2">
        <div>
          <h2 className="fw-bold brand-font text-dark mb-1">{t('yourShoppingCart', 'Your Shopping Cart')}</h2>
          <p className="text-secondary small mb-0">
            {t('cartSubtitle', 'Items will be billed and fulfilled by the respective authorized family firm in Tonk, Rajasthan.')}
          </p>
        </div>
        {cartItems.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="btn btn-sm btn-outline-danger"
            id="clear-cart-btn"
          >
            <i className="bi bi-trash3 me-1"></i> {t('clearCart', 'Clear Cart')}
          </button>
        )}
      </div>

      {cartItems.length > 0 ? (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" className="border-0">{t('productAndFirm', 'Product & Distributing Firm')}</th>
                      <th scope="col" className="border-0 text-center">{t('unitPrice', 'Unit Price')}</th>
                      <th scope="col" className="border-0 text-center">{t('quantity', 'Quantity')}</th>
                      <th scope="col" className="border-0 text-end">{t('subtotal', 'Subtotal')}</th>
                      <th scope="col" className="border-0 text-center">{t('action', 'Action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map(({ product, quantity }) => (
                      <tr key={product.id} id={`cart-row-${product.id}`}>
                        <td>
                          <div className="fw-bold text-dark">{product.name}</div>
                          <div className="small text-secondary d-flex flex-wrap align-items-center gap-2 mt-1">
                            <span className="badge bg-light text-dark border">
                              {product.firmCode}
                            </span>
                            <span className="text-muted">{t('packLabel', 'Pack:')} {product.packSize}</span>
                            <span>•</span>
                            <span className="text-muted">{product.firmName}</span>
                          </div>
                        </td>
                        <td className="text-center">
                          {product.price ? (
                            <span className="text-dark">₹{product.price.toFixed(2)}</span>
                          ) : (
                            <span className="badge bg-warning-subtle text-warning">{t('quoteOnly', 'Quote')}</span>
                          )}
                        </td>
                        <td className="text-center">
                          <div className="btn-group btn-group-sm" role="group">
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => updateQuantity(product.id, -1)}
                              id={`qty-minus-${product.id}`}
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="btn btn-light disabled text-dark fw-bold px-3">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => updateQuantity(product.id, 1)}
                              id={`qty-plus-${product.id}`}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="text-end fw-bold text-success">
                          ₹{((product.price || 0) * quantity).toFixed(2)}
                        </td>
                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-sm text-danger border-0"
                            onClick={() => removeFromCart(product.id)}
                            title={t('remove', 'Remove')}
                            aria-label={`Remove ${product.name} from cart`}
                            id={`remove-item-${product.id}`}
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
              <Link to="/products" className="btn btn-outline-secondary btn-sm">
                &larr; {t('continueShopping', 'Continue Exploring Catalog')}
              </Link>
              <Link to="/enquiries" className="btn btn-outline-success btn-sm">
                {t('wholesalePrompt', 'Need Wholesale Truckloads? Request Bulk Quotation')}
              </Link>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-3 p-4 bg-white" id="order-summary-card">
              <h5 className="fw-bold text-dark mb-3">{t('orderSummary', 'Order Summary')}</h5>

              <div className="d-flex justify-content-between mb-2 small text-secondary">
                <span>{t('itemsSubtotal', 'Items Subtotal')}</span>
                <span className="text-dark fw-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 small text-secondary">
                <span>{t('estimatedGst', 'Estimated Input GST (5%)')}</span>
                <span className="text-dark fw-semibold">₹{estimatedTax.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 small text-secondary">
                <span>{t('pickupAvailable', 'Tonk Yard / Mandi Pickup')}</span>
                <span className="text-success fw-semibold">{t('available', 'Available')}</span>
              </div>

              <hr className="my-3" />

              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold fs-5 text-dark">{t('estimatedTotal', 'Estimated Total')}</span>
                <span className="fw-bold fs-5 text-success">₹{total.toFixed(2)}</span>
              </div>

              <div className="alert bg-light border small text-muted mb-3 py-2 px-3">
                <i className="bi bi-info-circle me-1 text-primary"></i>
                <em>{t('demoCheckoutNote', 'Demo Checkout Note:')}</em> {t('demoCheckoutMsg', 'Live payment processing and automated invoicing will be activated upon merchant gateway integration.')}
              </div>

              <button
                type="button"
                className="btn btn-emerald w-100 py-2.5 mb-2 fw-semibold"
                onClick={() => alert('Checkout flow: Ready for Spring Boot Order API integration in next backend phase.')}
                id="btn-checkout"
              >
                <i className="bi bi-shield-check me-1"></i> {t('checkoutReview', 'Review Order Requisition')}
              </button>

              <div className="text-center mt-2">
                <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                  <i className="bi bi-check2-circle text-success me-1"></i>
                  {t('gstCompliantNotice', 'Multi-Firm Billing & GST Invoice Compliant')}
                </small>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <div
            className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: '80px', height: '80px' }}
          >
            <i className="bi bi-cart-x text-muted fs-1"></i>
          </div>
          <h4 className="fw-bold text-dark mb-2">{t('emptyCartMessage', 'Your Shopping Cart is Empty')}</h4>
          <p className="text-secondary small mb-4 mx-auto" style={{ maxWidth: '440px' }}>
            {t('emptyCartSubtext', 'Explore certified crop seeds, fertilizers, tractor implements, and plant protection products from our 4 Tonk firms.')}
          </p>
          <div>
            <Link to="/products" className="btn btn-emerald px-4 py-2">
              {t('exploreProducts', 'Browse Agri Catalog')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
