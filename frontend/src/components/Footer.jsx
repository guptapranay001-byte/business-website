import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/useLanguage';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  const { t } = useLanguage();
  const [modalType, setModalType] = useState(null); // 'privacy' | 'terms' | null

  return (
    <>
      <footer className="enterprise-footer py-5 mt-auto" id="main-footer">
        <div className="container">
          <div className="row g-4">
            {/* 1. About the Business */}
            <div className="col-lg-4 col-md-6">
              <h5 className="text-white fw-bold mb-3 brand-font d-flex align-items-center gap-2">
                <i className="bi bi-flower1 text-leaf-light"></i>
                {t('brandName', 'Vinay Agri Inputs')}
              </h5>
              <p className="small text-secondary mb-3">
                {t('aboutUsDesc', 'A regional agricultural commerce and distribution platform powering the multi-firm family enterprise in Tonk, Rajasthan. Supplying crop nutrition, certified seeds, plant protection products, and implement spares across Rajasthan.')}
              </p>
              <div className="d-flex flex-wrap gap-2">
                <span className="badge bg-dark border border-secondary text-light px-2.5 py-1">
                  <i className="bi bi-geo-alt me-1 text-danger"></i> {t('locationBadge', 'Tonk, Rajasthan 304001')}
                </span>
                <span className="badge bg-dark border border-secondary text-light px-2.5 py-1">
                  <i className="bi bi-shield-check me-1 text-success"></i> {t('governanceBadge', '4-Firm Governance')}
                </span>
              </div>
            </div>

            {/* 2. Product Categories */}
            <div className="col-lg-2 col-md-6 col-6">
              <h6 className="text-white fw-bold mb-3 small text-uppercase tracking-wider">{t('browseCategories', 'Product Categories')}</h6>
              <ul className="list-unstyled small text-secondary d-flex flex-column gap-1.5 mb-0">
                <li><Link to="/category/seeds" className="text-decoration-none text-secondary hover-text-white">{t('Seeds', 'Seeds')}</Link></li>
                <li><Link to="/category/fertilizers" className="text-decoration-none text-secondary hover-text-white">{t('Fertilizers', 'Fertilizers')}</Link></li>
                <li><Link to="/category/insecticides" className="text-decoration-none text-secondary hover-text-white">{t('Insecticides', 'Insecticides')}</Link></li>
                <li><Link to="/category/fungicides" className="text-decoration-none text-secondary hover-text-white">{t('Fungicides', 'Fungicides')}</Link></li>
                <li><Link to="/category/herbicides" className="text-decoration-none text-secondary hover-text-white">{t('Herbicides', 'Herbicides')}</Link></li>
                <li><Link to="/category/plant-growth-regulators" className="text-decoration-none text-secondary hover-text-white">{t('Plant Growth Regulators', 'Plant Growth Regulators')}</Link></li>
                <li><Link to="/category/micronutrients" className="text-decoration-none text-secondary hover-text-white">{t('Micronutrients', 'Micronutrients')}</Link></li>
                <li><Link to="/category/plant-nutrition" className="text-decoration-none text-secondary hover-text-white">{t('Plant Nutrition', 'Plant Nutrition')}</Link></li>
                <li><Link to="/category/other-agricultural-inputs" className="text-decoration-none text-secondary hover-text-white">{t('Other Agricultural Inputs', 'Other Agricultural Inputs')}</Link></li>
              </ul>
            </div>

            {/* 3. The 4 Operating Family Firms */}
            <div className="col-lg-3 col-md-6 col-6">
              <h6 className="text-white fw-bold mb-3 small text-uppercase tracking-wider">{t('ourFamilyBusinesses', 'Family Sister Firms')}</h6>
              <ul className="list-unstyled small text-secondary d-flex flex-column gap-2 mb-0">
                <li>
                  <Link to="/products?firm=VAI" className="text-decoration-none text-light fw-medium hover-text-white d-block">
                    Vinay Agri Inputs
                  </Link>
                  <span className="text-muted" style={{ fontSize: '0.74rem' }}>{t('vaiSubtitle', 'Crop Protection & Bio-Inputs (Tonk)')}</span>
                </li>
                <li>
                  <Link to="/products?firm=GTAA" className="text-decoration-none text-light fw-medium hover-text-white d-block">
                    Gupta Traders & Auto Agencies
                  </Link>
                  <span className="text-muted" style={{ fontSize: '0.74rem' }}>{t('gtaaSubtitle', 'Tractor Spares & Implements (Tonk)')}</span>
                </li>
                <li>
                  <Link to="/products?firm=VKBB" className="text-decoration-none text-light fw-medium hover-text-white d-block">
                    Vinay Khad Beej Bhandaar
                  </Link>
                  <span className="text-muted" style={{ fontSize: '0.74rem' }}>{t('vkbbSubtitle', 'Seeds & Regulated Fertilizers (Tonk)')}</span>
                </li>
                <li>
                  <Link to="/products?firm=GTT" className="text-decoration-none text-light fw-medium hover-text-white d-block">
                    Gupta Traders, Tonk
                  </Link>
                  <span className="text-muted" style={{ fontSize: '0.74rem' }}>{t('gttSubtitle', 'Commodities & Bulk Trade (Tonk)')}</span>
                </li>
              </ul>
            </div>

            {/* 4. Contact Placeholders & Governance */}
            <div className="col-lg-3 col-md-6">
              <h6 className="text-white fw-bold mb-3 small text-uppercase tracking-wider">{t('contactUs', 'Contact Details')}</h6>
              <div className="small text-secondary mb-3">
                <div className="mb-1.5 text-light">
                  <i className="bi bi-geo-alt me-1.5 text-leaf-light"></i>
                  <strong>{t('mainOffice', 'Main Operational Office:')}</strong>
                  <div className="text-secondary ps-3.5">{t('mainOfficeAddress', 'Station Road, Near Krishi Upaj Mandi, Tonk, Rajasthan 304001')}</div>
                </div>
                <div className="mb-1.5 text-light">
                  <i className="bi bi-telephone me-1.5 text-leaf-light"></i>
                  <strong>{t('billingDesk', 'Billing & Inquiry Desk:')}</strong>
                  <div className="text-secondary ps-3.5">{t('billingDeskValue', '[Contact details placeholder — To be supplied]')}</div>
                </div>
                <div className="text-light">
                  <i className="bi bi-envelope me-1.5 text-leaf-light"></i>
                  <strong>{t('enterpriseEmail', 'Enterprise Email:')}</strong>
                  <div className="text-secondary ps-3.5">{t('enterpriseEmailValue', '[Official email placeholder — To be supplied]')}</div>
                </div>
              </div>

              <div className="d-flex gap-2">
                <Link to="/admin" className="btn btn-sm btn-outline-secondary text-white py-1 px-2.5 small">
                  <i className="bi bi-shield-lock me-1"></i> {t('adminPortal', 'Admin Portal')}
                </Link>
                <Link to="/enquiries" className="btn btn-sm btn-outline-success text-white py-1 px-2.5 small">
                  <i className="bi bi-chat-quote me-1"></i> {t('bulkQuotes', 'Bulk Quotes')}
                </Link>
              </div>
            </div>
          </div>

          <hr className="border-secondary border-opacity-25 my-4" />

          {/* Bottom Bar: Copyright, Legal Links (Privacy Policy & Terms) */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center small text-secondary gap-2">
            <div>
              &copy; {CURRENT_YEAR} {t('copyrightNotice', 'Vinay Agri Inputs and Sister Enterprises. All rights reserved.')}
            </div>
            <div className="d-flex align-items-center gap-3">
              <button
                type="button"
                onClick={() => setModalType('privacy')}
                className="btn btn-link text-secondary p-0 text-decoration-none small hover-text-white"
                id="footer-privacy-btn"
              >
                {t('privacyPolicy', 'Privacy Policy')}
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setModalType('terms')}
                className="btn btn-link text-secondary p-0 text-decoration-none small hover-text-white"
                id="footer-terms-btn"
              >
                {t('termsAndConditions', 'Terms and Conditions')}
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy & Terms Modal */}
      {modalType && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-forest-green text-white">
                <h5 className="modal-title fw-bold">
                  {modalType === 'privacy' ? t('privacyPolicy', 'Privacy Policy') : t('termsAndConditions', 'Terms and Conditions')}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setModalType(null)}
                  aria-label={t('close', 'Close')}
                ></button>
              </div>
              <div className="modal-body p-4 text-dark small" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {modalType === 'privacy' ? (
                  <div>
                    <h6 className="fw-bold">{t('privacySection1Title', '1. Information Collection & Use')}</h6>
                    <p className="text-secondary">
                      {t('privacySection1Body', 'Vinay Agri Inputs collects customer details (name, contact number, delivery town) strictly for processing agricultural inputs, inquiries, and bulk freight logistics across Tonk, Rajasthan.')}
                    </p>
                    <h6 className="fw-bold">{t('privacySection2Title', '2. Data Security & Storage')}</h6>
                    <p className="text-secondary">
                      {t('privacySection2Body', 'Customer records and quotations are retained in enterprise repositories and are not sold or redistributed to third-party marketing entities.')}
                    </p>
                    <h6 className="fw-bold">{t('privacySection3Title', '3. Multi-Firm Invoicing')}</h6>
                    <p className="text-secondary">
                      {t('privacySection3Body', 'Invoices for goods are issued by the specific distributing entity (Vinay Agri Inputs, Gupta Traders & Auto Agencies, Vinay Khad Beej Bhandaar, or Gupta Traders, Tonk) in adherence with Rajasthan commercial tax guidelines.')}
                    </p>
                  </div>
                ) : (
                  <div>
                    <h6 className="fw-bold">{t('termsSection1Title', '1. Demonstration & Catalog Notice')}</h6>
                    <p className="text-secondary">
                      {t('termsSection1Body', 'Product specifications, technical chemical formulations, and indicative rates published on this platform represent initial catalog offerings. Bulk quantities and commercial fertilizers are subject to prevailing Krishi Mandi prices in Tonk.')}
                    </p>
                    <h6 className="fw-bold">{t('termsSection2Title', '2. Agricultural Product Usage')}</h6>
                    <p className="text-secondary">
                      {t('termsSection2Body', 'Pesticides, insecticides, and fungicides must be applied in accordance with official manufacturer label guidelines and authorized agricultural dosage rates.')}
                    </p>
                    <h6 className="fw-bold">{t('termsSection3Title', '3. Firm Distribution Scope')}</h6>
                    <p className="text-secondary">
                      {t('termsSection3Body', 'Tractor spares and implements are fulfilled through Gupta Traders & Auto Agencies; certified seeds and fertilizers are handled via Vinay Khad Beej Bhandaar and Vinay Agri Inputs.')}
                    </p>
                  </div>
                )}
              </div>
              <div className="modal-footer bg-light py-2">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => setModalType(null)}
                >
                  {t('close', 'Close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
