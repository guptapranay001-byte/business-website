import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/useLanguage';
import {
  CATEGORIES,
  SEED_SUBCATEGORIES,
  FERTILIZER_SUBCATEGORIES,
  CROPS,
  DEMO_PRODUCTS,
  FAMILY_FIRMS,
  BRAND_PLACEHOLDERS
} from '../data/catalogData';

export default function HomePage() {
  const { t, language } = useLanguage();
  // Subcategory interactive filter tab
  const [activeSubTab, setActiveSubTab] = useState('seeds'); // 'seeds' | 'fertilizers'

  // Helper for availability badge styling
  const getSubcategoryBadgeClass = (sampleCount) => {
    if (!sampleCount) return 'subcat-badge-demo';
    const sc = sampleCount.toLowerCase();
    if (sc.includes('inquiry') || sc.includes('inquire')) {
      return 'subcat-badge-inquiry';
    }
    if (sc.includes('regulated') || sc.includes('government')) {
      return 'subcat-badge-regulated';
    }
    return 'subcat-badge-demo';
  };
  
  // Bulk Enquiry Form State (Preview Mode)
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    phone: '',
    firmCode: 'VAI',
    requirementType: 'Bulk Fertilizer / Seed Order',
    notes: ''
  });
  const [enquirySubmittedPreview, setEnquirySubmittedPreview] = useState(false);

  const handleEnquiryChange = (e) => {
    const { name, value } = e.target;
    setEnquiryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    // Transparent preview behavior: Do NOT claim live server transmission
    setEnquirySubmittedPreview(true);
  };

  // Seasonal items filter: Rabi / current agro-season focus
  const seasonalProducts = DEMO_PRODUCTS.filter((p) => p.seasonal);
  const featuredProducts = DEMO_PRODUCTS.slice(0, 4);

  return (
    <div id="customer-homepage" className="bg-warm-offwhite">
      {/* =========================================================================
          1. BRANDS AND AGENCIES (Immediately Above Shop by Category)
          ========================================================================= */}
      <section className="py-4 py-lg-5 bg-white border-bottom" id="brands-agencies-section">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <span className="text-leaf-green fw-bold text-uppercase small tracking-wide">
                {t('brandSectionSubtitle', 'Direct Manufacturer Sourcing')}
              </span>
              <h2 className="fw-bold brand-font text-dark mb-1">{t('brandsAgencies', 'Brands & Agencies')}</h2>
              <p className="text-secondary small mb-0">
                {t('brandSectionDesc', 'Our Tonk distribution firms operate authorized dealer counters for leading seed, fertilizer, and crop protection manufacturers.')}
              </p>
            </div>
          </div>

          <div className="row g-3">
            {BRAND_PLACEHOLDERS.map((brand) => (
              <div className="col-12 col-sm-6 col-lg-4 col-xl" key={brand.id}>
                <div className="card h-100 border rounded-3 p-3 text-center bg-white shadow-sm">
                  <div
                    className="p-3 rounded-2 bg-light border border-dashed mb-2 d-flex align-items-center justify-content-center"
                    style={{ minHeight: '64px' }}
                  >
                    <i className="bi bi-award fs-3 text-secondary me-2"></i>
                    <span className="small fw-semibold text-secondary">{brand.name}</span>
                  </div>
                  <small className="text-dark fw-bold mb-1 d-block">{t(brand.category, brand.category)}</small>
                  <span className="badge bg-secondary-subtle text-secondary small mx-auto">
                    {language === 'hi' ? 'सत्यापन प्रक्रियाधीन' : brand.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="small text-muted text-center mt-3">
            {language === 'hi'
              ? '*आधिकारिक कंपनी ट्रेडमार्क और प्राधिकरण प्रमाणपत्र विक्रेता एजेंसी समझौतों के पूर्ण होने पर प्रदर्शित किए जाएंगे।'
              : '*Official company trademarks and authorization certificates will be displayed upon finalized vendor agency agreements.'}
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. SHOP BY CATEGORY (9 Specific Categories)
          ========================================================================= */}
      <section className="py-5" id="shop-by-category">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-2">
            <div>
              <span className="text-leaf-green fw-bold text-uppercase small tracking-wide">
                {t('catalogSubtitle', 'Comprehensive Agricultural Catalog')}
              </span>
              <h2 className="fw-bold brand-font text-dark mb-1">{t('shopByCategory', 'Shop by Category')}</h2>
              <p className="text-secondary small mb-0">
                {t('catalogDesc', 'Browse tested seeds, soil fertilizers, crop protection solutions, and equipment.')}
              </p>
            </div>
            <Link to="/products" className="btn btn-sm btn-outline-success fw-semibold">
              {t('viewAllCategories', 'View All Categories')} &rarr;
            </Link>
          </div>

          <div className="row g-3 g-md-4">
            {CATEGORIES.map((cat) => (
              <div className="col-6 col-md-4 col-lg-4 col-xl-4" key={cat.id}>
                <Link
                  to={`/category/${cat.slug}`}
                  className="card category-nav-card h-100 border-0 shadow-sm rounded-3 text-decoration-none p-3 p-md-4 bg-white"
                  id={`cat-card-${cat.slug}`}
                >
                  <div className="d-flex align-items-start justify-content-between mb-3">
                    <div
                      className="category-icon-wrapper rounded-3 d-flex align-items-center justify-content-center"
                      style={{
                        backgroundColor: `${cat.color}15`,
                        color: cat.color,
                        width: '52px',
                        height: '52px'
                      }}
                    >
                      <i className={`bi ${cat.icon} fs-3`}></i>
                    </div>
                    <span className="badge bg-light text-secondary border small">
                      {cat.subcategories.length} {t('types', 'Types')}
                    </span>
                  </div>

                  <h5 className="fw-bold text-dark mb-1 brand-font">{t(cat.name, cat.name)}</h5>
                  <p className="text-secondary small mb-3 line-clamp-2" style={{ fontSize: '0.82rem' }}>
                    {t('cat_desc_' + cat.id, cat.description)}
                  </p>

                  <div className="mt-auto d-flex align-items-center text-success small fw-semibold">
                    <span>{t('exploreProducts', 'Explore Products')}</span>
                    <i className="bi bi-arrow-right ms-1"></i>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. SEED & FERTILIZER SUBCATEGORIES BROWSER
          ========================================================================= */}
      <section className="py-4 py-lg-5 bg-white border-top border-bottom" id="subcategories-section">
        <div className="container">
          <div className="subcategories-directory-card">
            {/* Header and Segmented Control Tabs */}
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center pb-3 mb-3 border-bottom gap-3">
              <div className="d-flex align-items-center gap-3">
                <div className="subcat-header-icon flex-shrink-0" aria-hidden="true">
                  <i className="bi bi-diagram-3-fill"></i>
                </div>
                <div>
                  <h3 className="subcat-heading-title brand-font">
                    {t('subcategoriesTitle', 'Specialized Subcategories & Grade Directory')}
                  </h3>
                  <p className="subcat-heading-subtitle">
                    {t('subcategoriesSubtitle', 'Select a specific seed variety or fertilizer grade to check catalog availability.')}
                  </p>
                </div>
              </div>

              {/* Segmented Control Tabs */}
              <div className="subcat-segmented-tabs" role="tablist" aria-label={t('subcategoriesTitle', 'Specialized Subcategories & Grade Directory')}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeSubTab === 'seeds'}
                  className={`subcat-tab-btn ${activeSubTab === 'seeds' ? 'active' : ''}`}
                  onClick={() => setActiveSubTab('seeds')}
                  id="tab-btn-seeds"
                >
                  <i className="bi bi-flower2"></i>
                  <span>{t('seedVarieties', 'Seed Varieties')}</span>
                  <span className="subcat-tab-count">{SEED_SUBCATEGORIES.length}</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeSubTab === 'fertilizers'}
                  className={`subcat-tab-btn ${activeSubTab === 'fertilizers' ? 'active' : ''}`}
                  onClick={() => setActiveSubTab('fertilizers')}
                  id="tab-btn-fertilizers"
                >
                  <i className="bi bi-moisture"></i>
                  <span>{t('fertilizerGrades', 'Fertilizer Grades')}</span>
                  <span className="subcat-tab-count">{FERTILIZER_SUBCATEGORIES.length}</span>
                </button>
              </div>
            </div>

            {/* Informational Disclaimer Notice */}
            <div className="subcat-demo-notice">
              <i className="bi bi-info-circle-fill flex-shrink-0" aria-hidden="true"></i>
              <span>
                {activeSubTab === 'seeds'
                  ? t('subcategoriesSeedNotice', 'Demonstration catalog representation; stock is subject to seasonal crop cycles in Tonk.')
                  : t('subcategoriesFertNotice', 'Primary fertilizers, urea, and DAP are distributed in wholesale quantities subject to Mandi rates.')}
              </span>
            </div>

            {/* Seeds Subcategories Grid */}
            {activeSubTab === 'seeds' && (
              <div className="row g-3">
                {SEED_SUBCATEGORIES.map((seed, i) => (
                  <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={i}>
                    <Link
                      to={`/category/seeds/${seed.subSlug || seed.slug}`}
                      className="subcat-item-card"
                      id={`subcat-seed-${seed.slug}`}
                    >
                      <div className="subcat-item-icon" aria-hidden="true">
                        <i className={`bi ${seed.icon || 'bi-flower2'}`}></i>
                      </div>
                      <div className="subcat-item-content">
                        <span className="subcat-item-name">{t(seed.name, seed.name)}</span>
                        <span className={`subcat-badge ${getSubcategoryBadgeClass(seed.sampleCount)}`}>
                          {t(seed.sampleCount, seed.sampleCount)}
                        </span>
                      </div>
                      <i className="bi bi-chevron-right subcat-item-arrow" aria-hidden="true"></i>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Fertilizers Subcategories Grid */}
            {activeSubTab === 'fertilizers' && (
              <div className="row g-3">
                {FERTILIZER_SUBCATEGORIES.map((fert, i) => (
                  <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={i}>
                    <Link
                      to={`/category/fertilizers?subtype=${encodeURIComponent(fert.name)}`}
                      className="subcat-item-card"
                      id={`subcat-fert-${fert.slug}`}
                    >
                      <div className="subcat-item-icon" aria-hidden="true">
                        <i className={`bi ${fert.icon || 'bi-moisture'}`}></i>
                      </div>
                      <div className="subcat-item-content">
                        <span className="subcat-item-name">{t(fert.name, fert.name)}</span>
                        <span className={`subcat-badge ${getSubcategoryBadgeClass(fert.sampleCount)}`}>
                          {t(fert.sampleCount, fert.sampleCount)}
                        </span>
                      </div>
                      <i className="bi bi-chevron-right subcat-item-arrow" aria-hidden="true"></i>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. SEASONAL COLLECTION (Visually Distinct Seasonal Banner & Cards)
          ========================================================================= */}
      <section className="py-5" id="seasonal-collection">
        <div className="container">
          <div className="seasonal-collection-box p-4 p-md-5 rounded-4 text-white position-relative overflow-hidden mb-4">
            <div className="row align-items-center position-relative" style={{ zIndex: 2 }}>
              <div className="col-lg-8">
                <span className="badge seasonal-cycle-badge px-3 py-1.5 rounded-pill text-uppercase small mb-2 d-inline-flex align-items-center gap-1.5">
                  <i className="bi bi-sun-fill me-1"></i> {t('rabiSubtitle', 'Current Sowing Cycle Focus')}
                </span>
                <h2 className="display-6 fw-bold brand-font mb-2 seasonal-heading text-white">
                  {t('rabiTitle', 'Rabi Season Agri-Inputs Collection')}
                </h2>
                <p className="lead small seasonal-desc mb-3" style={{ maxWidth: '600px' }}>
                  {t('rabiDesc', 'Recommended certified seeds, balanced soil nutrition, and early-stage crop protection for wheat, mustard, and gram sowing across Tonk and surrounding Rajasthan basins.')}
                </p>
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge seasonal-white-card">
                    <span className="seasonal-primary-text">{t('Mustard', 'Mustard')}</span>
                    <span className="seasonal-secondary-text">{language === 'hi' ? 'बुवाई' : 'Sowing'}</span>
                  </span>
                  <span className="badge seasonal-white-card">
                    <span className="seasonal-primary-text">{t('Wheat', 'Wheat')}</span>
                    <span className="seasonal-secondary-text">{language === 'hi' ? 'बुवाई पोषण' : 'Basal Dressing'}</span>
                  </span>
                  <span className="badge seasonal-white-card">
                    <span className="seasonal-primary-text">{language === 'hi' ? 'जिंक एवं सल्फर' : 'Zinc & Sulphur'}</span>
                    <span className="seasonal-secondary-text">{language === 'hi' ? 'पोषण' : 'Deficiencies'}</span>
                  </span>
                </div>
              </div>
              <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
                <Link
                  to="/products?tag=seasonal"
                  className="btn btn-warning btn-lg px-4 shadow seasonal-cta-btn"
                  id="view-seasonal-products-btn"
                >
                  {t('exploreRabi', 'Explore Rabi Inputs')}
                </Link>
              </div>
            </div>
          </div>

          {/* Seasonal Products Grid */}
          <div className="row g-3 g-lg-4">
            {seasonalProducts.map((product) => (
              <div className="col-12 col-sm-6 col-lg-3" key={`seasonal-${product.id}`}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. FEATURED PRODUCTS (Demonstration Catalog)
          ========================================================================= */}
      <section className="py-5" id="featured-products">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-2">
            <div>
              <span className="text-leaf-green fw-bold text-uppercase small tracking-wide">
                {t('featuredSubtitle', 'Curated Agricultural Inputs')}
              </span>
              <h2 className="fw-bold brand-font text-dark mb-1">{t('featuredProducts', 'Featured Products')}</h2>
              <p className="text-secondary small mb-0">
                {t('featuredDesc', 'Hand-picked high-performance inputs certified for purity and field vitality across Tonk district.')}
              </p>
            </div>
            <Link to="/products" className="btn btn-sm btn-outline-success fw-semibold">
              {t('viewFullCatalog', 'View Full Catalog')} &rarr;
            </Link>
          </div>

          <div className="row g-3 g-lg-4">
            {featuredProducts.map((product) => (
              <div className="col-12 col-sm-6 col-lg-3" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Catalog Transparency Notice */}
          <div className="alert bg-white border text-secondary small mt-4 p-3 rounded-3 d-flex align-items-center gap-2">
            <i className="bi bi-info-circle-fill text-success fs-5"></i>
            <div>
              <strong>{language === 'hi' ? 'कैटलॉग सूचना:' : 'Demonstration Catalog Notice:'}</strong>{' '}
              {language === 'hi'
                ? 'उपरोक्त उत्पाद प्रारंभिक प्रणाली प्रदर्शन का प्रतिनिधित्व करते हैं। वास्तविक इन्वेंट्री और लाइव मूल्य निर्धारण शीघ्र सक्रिय होंगे।'
                : 'The products above represent initial system demonstration data. Final commercial brand agreements, real-time inventory levels, and live pricing will be populated as enterprise onboarding continues.'}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. MOST BOUGHT PRODUCTS / BEST SELLERS SECTION
          ========================================================================= */}
      <section className="py-5 bg-white border-top border-bottom" id="best-sellers-section">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-3 gap-2">
            <div>
              <div className="d-flex align-items-center gap-2">
                <span className="text-leaf-green fw-bold text-uppercase small tracking-wide">
                  {t('highDemandSubtitle', 'Critical Regional Supplies')}
                </span>
                <span className="badge bg-secondary-subtle text-secondary small">
                  {language === 'hi' ? 'अनुशंसित चयन' : 'Curated Selection'}
                </span>
              </div>
              <h2 className="fw-bold brand-font text-dark mb-1">
                {t('highDemand', 'High Demand Agricultural Inputs')}
              </h2>
              <p className="text-secondary small mb-0">
                {t('highDemandDesc', 'Essential inputs actively moving through Tonk Mandi and local distribution counters this week.')}
              </p>
            </div>
          </div>

          <div className="row g-3 g-lg-4">
            {DEMO_PRODUCTS.slice(4, 8).map((product) => (
              <div className="col-12 col-sm-6 col-lg-3" key={`bestseller-${product.id}`}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. SHOP BY CROP (8 Verified Crops)
          ========================================================================= */}
      <section className="py-5" id="shop-by-crop">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-leaf-green fw-bold text-uppercase small tracking-wide">
              {t('cropSectionSubtitle', 'Tailored Input Schedules')}
            </span>
            <h2 className="fw-bold brand-font text-dark mt-1">{t('shopByCrop', 'Shop by Crop')}</h2>
            <p className="text-secondary mx-auto" style={{ maxWidth: '620px' }}>
              {t('cropSectionDesc', 'Discover certified seeds, balanced nutrition, and pest remedies tailored for Rajasthan staples.')}
            </p>
          </div>

          <div className="row g-3 g-md-4">
            {CROPS.map((crop) => (
              <div className="col-6 col-md-4 col-lg-3" key={crop.id}>
                <Link
                  to={`/products?crop=${encodeURIComponent(crop.name)}`}
                  className="card crop-card h-100 border text-decoration-none p-3 p-lg-4 text-center rounded-3 bg-white hover-shadow-sm"
                  id={`crop-card-${crop.id}`}
                >
                  <div className="crop-icon-circle mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center shadow-sm">
                    <i className={`bi ${crop.icon} fs-2 text-success`}></i>
                  </div>
                  <h5 className="fw-bold text-dark mb-0 brand-font">{crop.name}</h5>
                  <small className="text-success fw-medium mb-1 d-block">{crop.hindiName}</small>
                  <span className="badge bg-light text-secondary border mx-auto mb-2" style={{ fontSize: '0.7rem' }}>
                    {crop.season} {language === 'hi' ? 'फसल' : 'Crop'}
                  </span>
                  <p className="text-secondary small mb-0 line-clamp-2" style={{ fontSize: '0.78rem' }}>
                    {t('crop_' + crop.id + '_desc', crop.description)}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. OUR FAMILY BUSINESSES (4 Sister Concerns in Tonk, RJ)
          ========================================================================= */}
      <section className="py-5 bg-white border-top border-bottom" id="our-family-businesses">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge bg-success-subtle text-success px-3 py-1.5 rounded-pill fw-semibold mb-2">
              {t('firmsSubtitle', 'Decades of Trusted Agricultural Distribution')}
            </span>
            <h2 className="fw-bold brand-font text-dark">{t('ourFamilyBusinesses', 'Our Family Businesses in Tonk, Rajasthan')}</h2>
            <p className="text-secondary mx-auto" style={{ maxWidth: '680px' }}>
              {t('firmsDesc', 'A multi-firm enterprise managed by our family across Tonk district, each dedicated to specialized agricultural needs:')}
            </p>
          </div>

          <div className="row g-4">
            {FAMILY_FIRMS.map((firm) => (
              <div className="col-lg-6 col-xl-3" key={firm.code}>
                <div className="card h-100 border-0 shadow-sm rounded-4 p-4 d-flex flex-column bg-warm-offwhite" id={`firm-box-${firm.code.toLowerCase()}`}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-dark text-white fw-bold px-2.5 py-1.5 rounded-2">
                      {firm.code}
                    </span>
                    <span className="small text-secondary fw-semibold">
                      <i className="bi bi-geo-alt-fill text-danger me-1"></i> Tonk, RJ
                    </span>
                  </div>

                  <h5 className="fw-bold text-dark mb-1 brand-font">{firm.name}</h5>
                  <div className="text-success small fw-semibold mb-2">
                    {t(firm.code.toLowerCase() + 'Role', firm.operatingRole)}
                  </div>

                  <p className="text-secondary small mb-3 flex-grow-1">
                    {t(firm.code.toLowerCase() + 'Specialty', firm.primarySpecialty)}
                  </p>

                  <div className="pt-3 border-top mt-auto small">
                    <div className="text-muted mb-1">
                      <i className="bi bi-building me-1"></i> {firm.location}
                    </div>
                    <div className="text-muted fst-italic">
                      <i className="bi bi-telephone me-1"></i> {t(firm.code.toLowerCase() + 'Contact', firm.contactPlaceholder)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. BULK AND DEALER ENQUIRIES (Preview Mode without fake success)
          ========================================================================= */}
      <section className="py-5" id="bulk-enquiries-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white">
                <div className="text-center mb-4">
                  <span className="badge bg-amber-subtle text-amber-emphasis px-3 py-1.5 rounded-pill fw-semibold mb-2 border" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
                    <i className="bi bi-truck me-1"></i> {t('bulkSectionBadge', 'Commercial Wholesale & Institutional Quotations')}
                  </span>
                  <h3 className="fw-bold brand-font text-dark">{t('dealerBulkEnquiries', 'Dealer & Bulk Enquiries')}</h3>
                  <p className="text-secondary small mx-auto" style={{ maxWidth: '580px' }}>
                    {t('bulkSectionDesc', 'For truckloads of fertilizers, certified seed bags, or implement lots across Tonk district, submit your requisition below.')}
                  </p>
                </div>

                {/* Explicit Technical Notice (No Fake Backend Claims) */}
                <div className="alert alert-warning border-warning-subtle small d-flex align-items-start gap-2 mb-4">
                  <i className="bi bi-exclamation-triangle-fill fs-5 mt-0.5"></i>
                  <div>
                    {t('bulkNotice', 'Connection Status: The automated bulk enquiry dispatch API is in preliminary integration mode. Submissions below are validated locally in Preview Mode. For immediate wholesale dispatch, please consult our physical Tonk Mandi counter.')}
                  </div>
                </div>

                {enquirySubmittedPreview ? (
                  <div className="card bg-light border p-4 text-center rounded-3" id="enquiry-preview-state">
                    <div className="p-3 rounded-circle bg-warning bg-opacity-10 text-warning d-inline-flex mb-3">
                      <i className="bi bi-clipboard2-check fs-1"></i>
                    </div>
                    <h5 className="fw-bold text-dark mb-1">{t('previewStateTitle', 'Client-Side Preview Generated')}</h5>
                    <p className="text-secondary small mb-3">
                      {t('previewStateDesc', 'Your bulk requisition has been structured locally for testing.')}
                    </p>
                    <div className="bg-white p-3 rounded border text-start small font-monospace mb-3">
                      <div>{t('name', 'Name')}: {enquiryForm.name}</div>
                      <div>{t('phoneNumber', 'Phone Number')}: {enquiryForm.phone}</div>
                      <div>{t('firmLabel', 'Firm:')}: {enquiryForm.firmCode}</div>
                      <div>{t('description', 'Notes')}: {enquiryForm.notes || (language === 'hi' ? 'कोई विवरण नहीं' : 'None provided')}</div>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => setEnquirySubmittedPreview(false)}
                        className="btn btn-sm btn-outline-secondary"
                      >
                        {t('resetForm', 'Reset Form')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleEnquirySubmit} id="homepage-enquiry-form">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-secondary">
                          {t('yourNameLabel', 'Your Name / Retail Shop')}
                        </label>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          placeholder={t('namePlaceholder', 'e.g. Ramesh Kumar')}
                          value={enquiryForm.name}
                          onChange={handleEnquiryChange}
                          required
                          id="enquiry-input-name"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-secondary">
                          {t('phoneLabel', 'Contact Phone Number')}
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          className="form-control"
                          placeholder={t('phonePlaceholder', '10-digit mobile number')}
                          value={enquiryForm.phone}
                          onChange={handleEnquiryChange}
                          required
                          id="enquiry-input-phone"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-secondary">
                          {t('firmSelectLabel', 'Target Family Firm')}
                        </label>
                        <select
                          name="firmCode"
                          className="form-select"
                          value={enquiryForm.firmCode}
                          onChange={handleEnquiryChange}
                          id="enquiry-select-firm"
                        >
                          <option value="VAI">Vinay Agri Inputs ({language === 'hi' ? 'कीटनाशक एवं जैव-पोषक' : 'Pesticides & Bio-Inputs'})</option>
                          <option value="GTAA">Gupta Traders & Auto Agencies ({language === 'hi' ? 'ट्रैक्टर एवं उपकरण स्पेयर' : 'Tractor & Implements'})</option>
                          <option value="VKBB">Vinay Khad Beej Bhandaar ({language === 'hi' ? 'प्रमाणित बीज एवं उर्वरक' : 'Seeds & Fertilizers'})</option>
                          <option value="GTT">Gupta Traders, Tonk ({language === 'hi' ? 'कृषि जिंस एवं थोक व्यापार' : 'Commodities & Bulk Trading'})</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-secondary">
                          {t('requisitionTypeLabel', 'Requisition Requirement')}
                        </label>
                        <select
                          name="requirementType"
                          className="form-select"
                          value={enquiryForm.requirementType}
                          onChange={handleEnquiryChange}
                          id="enquiry-select-type"
                        >
                          <option value="Bulk Fertilizer / Seed Order">{language === 'hi' ? 'थोक उर्वरक / बीज ऑर्डर (ट्रकलोड)' : 'Bulk Fertilizer / Seed Order (Truckload)'}</option>
                          <option value="Dealer Agency Partnership">{language === 'hi' ? 'डीलर एजेंसी साझेदारी पूछताछ' : 'Dealer Agency Partnership Inquiry'}</option>
                          <option value="Implement & Auto Spares">{language === 'hi' ? 'उपकरण एवं ट्रैक्टर स्पेयर पार्ट्स' : 'Implement & Tractor Spares Lot'}</option>
                          <option value="General Product Inquiries">{language === 'hi' ? 'सामान्य उत्पाद पूछताछ' : 'General Product Inquiries'}</option>
                        </select>
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-bold text-secondary">
                          {t('notesLabel', 'Specification & Estimated Quantity')}
                        </label>
                        <textarea
                          name="notes"
                          rows="3"
                          className="form-control"
                          placeholder={t('notesPlaceholder', 'Please note required metric tons / bag quantities, preferred dispatch dates to Tonk Mandi, or specifications...')}
                          value={enquiryForm.notes}
                          onChange={handleEnquiryChange}
                          id="enquiry-textarea-notes"
                        ></textarea>
                      </div>

                      <div className="col-12 text-end">
                        <button type="submit" className="btn btn-emerald px-4 py-2 fw-semibold" id="submit-enquiry-preview-btn">
                          <i className="bi bi-file-earmark-text me-1"></i> {t('validateSubmitBtn', 'Validate & Review Quotation Request')}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
