import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/useLanguage';
import {
  CATEGORIES,
  CROPS,
  DEMO_PRODUCTS,
  FAMILY_FIRMS
} from '../data/catalogData';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { language, t } = useLanguage();

  const selectedCategory = searchParams.get('category') || 'ALL';
  const selectedSub = searchParams.get('sub') || '';
  const selectedCrop = searchParams.get('crop') || '';
  const selectedFirm = searchParams.get('firm') || 'ALL';
  const searchQuery = searchParams.get('search') || '';
  const isSeasonalTag = searchParams.get('tag') === 'seasonal';

  // Filter products based on combined criteria
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return DEMO_PRODUCTS.filter((product) => {
      // Category filter
      const matchesCategory =
        selectedCategory === 'ALL' ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();

      // Subcategory filter
      const matchesSub =
        !selectedSub ||
        (product.subcategory &&
          product.subcategory.toLowerCase().includes(selectedSub.toLowerCase()));

      // Crop association filter
      const matchesCrop =
        !selectedCrop ||
        (product.crops &&
          product.crops.some((c) => c.toLowerCase() === selectedCrop.toLowerCase()));

      // Firm filter
      const matchesFirm =
        selectedFirm === 'ALL' || product.firmCode === selectedFirm;

      // Seasonal tag
      const matchesSeasonal = !isSeasonalTag || product.seasonal;

      // Dual-language search query filter (matches English & Hindi catalog attributes)
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.sku.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        t(product.category).toLowerCase().includes(q) ||
        (product.subcategory && (
          product.subcategory.toLowerCase().includes(q) ||
          t(product.subcategory).toLowerCase().includes(q)
        )) ||
        (product.availability && (
          product.availability.toLowerCase().includes(q) ||
          t(product.availability).toLowerCase().includes(q)
        )) ||
        (product.crops && product.crops.some((c) => {
          const cropObj = CROPS.find(
            (cr) => cr.id.toLowerCase() === c.toLowerCase() || cr.name.toLowerCase() === c.toLowerCase()
          );
          return (
            c.toLowerCase().includes(q) ||
            (cropObj && (cropObj.hindiName.toLowerCase().includes(q) || cropObj.name.toLowerCase().includes(q)))
          );
        }));

      return (
        matchesCategory &&
        matchesSub &&
        matchesCrop &&
        matchesFirm &&
        matchesSeasonal &&
        matchesSearch
      );
    });
  }, [selectedCategory, selectedSub, selectedCrop, selectedFirm, isSeasonalTag, searchQuery, t]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'ALL') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters =
    selectedCategory !== 'ALL' ||
    selectedSub ||
    selectedCrop ||
    selectedFirm !== 'ALL' ||
    searchQuery ||
    isSeasonalTag;

  return (
    <div className="container py-4 py-lg-5" id="products-catalog-page">
      {/* Page Title & Breadcrumb */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb small mb-1">
              <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">{t('home', 'Home')}</Link></li>
              <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page">{t('catalogProductsTab', 'Catalog')}</li>
            </ol>
          </nav>
          <h2 className="fw-bold brand-font text-dark mb-0">{t('catalogTitle', 'Agricultural Inputs Catalog')}</h2>
          <small className="text-secondary">
            {t('catalogSubtext', 'Demonstration repository for certified seeds, soil nutrients, pesticides, and tractor implements.')}
          </small>
        </div>

        {/* Quick Search */}
        <div style={{ maxWidth: '340px' }} className="w-100">
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-secondary"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder={t('catalogSearchPlaceholder', 'Search by name, SKU, or brand...')}
              value={searchQuery}
              onChange={(e) => updateParam('search', e.target.value)}
              id="catalog-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="btn btn-outline-secondary border-start-0"
                onClick={() => updateParam('search', '')}
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Filter Sidebar */}
        <aside className="col-lg-3" id="catalog-sidebar-filters">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white sticky-lg-top" style={{ top: '100px' }}>
            <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom">
              <span className="fw-bold small text-dark d-flex align-items-center gap-1.5">
                <i className="bi bi-sliders text-success"></i> {t('filters', 'Filters')}
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="btn btn-sm btn-link text-danger p-0 text-decoration-none small"
                  id="clear-all-filters-btn"
                >
                  {t('resetAll', 'Reset All')}
                </button>
              )}
            </div>

            {/* Filter 1: By Operating Firm */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary text-uppercase mb-2" style={{ fontSize: '0.72rem' }}>
                {t('operatingSisterFirm', 'Operating Sister Firm')}
              </label>
              <div className="d-flex flex-column gap-1">
                <button
                  type="button"
                  onClick={() => updateParam('firm', 'ALL')}
                  className={`btn btn-sm text-start py-1 px-2 rounded-2 ${
                    selectedFirm === 'ALL' ? 'btn-emerald text-white fw-semibold' : 'btn-light text-secondary'
                  }`}
                >
                  {t('allTonkFirms', 'All 4 Tonk Firms')}
                </button>
                {FAMILY_FIRMS.map((f) => (
                  <button
                    key={f.code}
                    type="button"
                    onClick={() => updateParam('firm', f.code)}
                    className={`btn btn-sm text-start py-1 px-2 rounded-2 d-flex justify-content-between align-items-center ${
                      selectedFirm === f.code ? 'btn-emerald text-white fw-semibold' : 'btn-light text-secondary'
                    }`}
                  >
                    <span className="text-truncate">{f.name}</span>
                    <span className="badge bg-secondary-subtle text-secondary small ms-1">{f.code}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filter 2: By Category */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary text-uppercase mb-2" style={{ fontSize: '0.72rem' }}>
                {t('primaryCategory', 'Primary Category')}
              </label>
              <div className="d-flex flex-column gap-1">
                <button
                  type="button"
                  onClick={() => updateParam('category', 'ALL')}
                  className={`btn btn-sm text-start py-1 px-2 rounded-2 ${
                    selectedCategory === 'ALL' ? 'btn-emerald text-white fw-semibold' : 'btn-light text-secondary'
                  }`}
                >
                  {t('allCategories', 'All Categories')}
                </button>
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => updateParam('category', c.name)}
                    className={`btn btn-sm text-start py-1 px-2 rounded-2 d-flex justify-content-between align-items-center ${
                      selectedCategory.toLowerCase() === c.name.toLowerCase()
                        ? 'btn-emerald text-white fw-semibold'
                        : 'btn-light text-secondary'
                    }`}
                  >
                    <span>{t(c.name, c.name)}</span>
                    <i className={`bi ${c.icon} small text-muted`}></i>
                  </button>
                ))}
              </div>
            </div>

            {/* Filter 3: By Target Crop */}
            <div>
              <label className="form-label small fw-bold text-secondary text-uppercase mb-2" style={{ fontSize: '0.72rem' }}>
                {t('cropAssociation', 'Crop Association')}
              </label>
              <div className="d-flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => updateParam('crop', '')}
                  className={`badge rounded-pill border px-2.5 py-1.5 ${
                    !selectedCrop ? 'bg-dark text-white' : 'bg-light text-secondary'
                  }`}
                >
                  {t('allCrops', 'All Crops')}
                </button>
                {CROPS.map((cr) => (
                  <button
                    key={cr.id}
                    type="button"
                    onClick={() => updateParam('crop', cr.id)}
                    className={`badge rounded-pill border px-2.5 py-1.5 ${
                      selectedCrop === cr.id ? 'bg-success text-white' : 'bg-light text-secondary'
                    }`}
                  >
                    {language === 'hi' ? `${cr.hindiName} (${cr.name})` : `${cr.name} (${cr.hindiName})`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Product Grid */}
        <main className="col-lg-9" id="catalog-products-section">
          {/* Active Filter Chips Row */}
          {hasActiveFilters && (
            <div className="card border-0 bg-white shadow-sm p-3 rounded-3 mb-3">
              <div className="active-criteria-row">
                <span className="active-criteria-label">{t('activeCriteria', 'Active Criteria:')}</span>

                {selectedCategory !== 'ALL' && (
                  <span className="active-filter-chip">
                    <span className="active-filter-chip-text">
                      {t('category', 'Category')}: <strong>{t(selectedCategory, selectedCategory)}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => updateParam('category', 'ALL')}
                      className="active-filter-chip-remove"
                      aria-label={`${t('remove', 'Remove')} ${t('category', 'Category')} filter`}
                      title={`${t('remove', 'Remove')} ${t('category', 'Category')} filter`}
                    >
                      <i className="bi bi-x-lg" aria-hidden="true"></i>
                    </button>
                  </span>
                )}

                {selectedSub && (
                  <span className="active-filter-chip">
                    <span className="active-filter-chip-text">
                      {t('subcategory', 'Subcategory')}: <strong>{t(selectedSub, selectedSub)}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => updateParam('sub', '')}
                      className="active-filter-chip-remove"
                      aria-label={`${t('remove', 'Remove')} ${t('subcategory', 'Subcategory')} filter`}
                      title={`${t('remove', 'Remove')} ${t('subcategory', 'Subcategory')} filter`}
                    >
                      <i className="bi bi-x-lg" aria-hidden="true"></i>
                    </button>
                  </span>
                )}

                {selectedCrop && (
                  <span className="active-filter-chip">
                    <span className="active-filter-chip-text">
                      {t('crop', 'Crop')}: <strong>{selectedCrop}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => updateParam('crop', '')}
                      className="active-filter-chip-remove"
                      aria-label={`${t('remove', 'Remove')} ${t('crop', 'Crop')} filter`}
                      title={`${t('remove', 'Remove')} ${t('crop', 'Crop')} filter`}
                    >
                      <i className="bi bi-x-lg" aria-hidden="true"></i>
                    </button>
                  </span>
                )}

                {selectedFirm !== 'ALL' && (
                  <span className="active-filter-chip">
                    <span className="active-filter-chip-text">
                      {t('firm', 'Firm')}: <strong>{selectedFirm}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => updateParam('firm', 'ALL')}
                      className="active-filter-chip-remove"
                      aria-label={`${t('remove', 'Remove')} ${t('firm', 'Firm')} filter`}
                      title={`${t('remove', 'Remove')} ${t('firm', 'Firm')} filter`}
                    >
                      <i className="bi bi-x-lg" aria-hidden="true"></i>
                    </button>
                  </span>
                )}

                {isSeasonalTag && (
                  <span className="active-filter-chip">
                    <span className="active-filter-chip-text">
                      <strong>{t('seasonalFocus', 'Seasonal Collection Focus')}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => updateParam('tag', '')}
                      className="active-filter-chip-remove"
                      aria-label={`${t('remove', 'Remove')} ${t('seasonalFocus', 'Seasonal Collection Focus')} filter`}
                      title={`${t('remove', 'Remove')} ${t('seasonalFocus', 'Seasonal Collection Focus')} filter`}
                    >
                      <i className="bi bi-x-lg" aria-hidden="true"></i>
                    </button>
                  </span>
                )}

                {searchQuery && (
                  <span className="active-filter-chip">
                    <span className="active-filter-chip-text">
                      {t('searchAction', 'Search')}: <strong>"{searchQuery}"</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => updateParam('search', '')}
                      className="active-filter-chip-remove"
                      aria-label={`${t('remove', 'Remove')} ${t('searchAction', 'Search')} filter`}
                      title={`${t('remove', 'Remove')} ${t('searchAction', 'Search')} filter`}
                    >
                      <i className="bi bi-x-lg" aria-hidden="true"></i>
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  className="active-criteria-clear-btn"
                  onClick={clearAllFilters}
                  id="catalog-clear-filters-btn"
                  title={t('clearFilters', 'Clear Filters')}
                >
                  <i className="bi bi-x-circle" aria-hidden="true"></i>
                  <span>{t('clearFilters', 'Clear Filters')}</span>
                </button>
              </div>
            </div>
          )}

          {/* Catalog Count & Sorter Bar */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-secondary small">
              {t('showingCatalogCount', 'Showing {count} items in demonstration catalog', { count: filteredProducts.length })}
            </span>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="row g-3 g-lg-4" id="filtered-products-grid">
              {filteredProducts.map((product) => (
                <div className="col-12 col-sm-6 col-xl-4" key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white my-3">
              <div
                className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: '70px', height: '70px' }}
              >
                <i className="bi bi-inbox text-secondary fs-2"></i>
              </div>
              <h5 className="fw-bold text-dark mb-1">{t('noProductsFound', 'No Matching Products Found')}</h5>
              <p className="text-secondary small mb-3">
                {t('noProductsDesc', 'No items in the demonstration catalog match your currently selected filters.')}
              </p>
              <div>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="btn btn-sm btn-emerald px-3 py-1.5"
                >
                  {t('clearAllFilters', 'Clear All Filters')}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
