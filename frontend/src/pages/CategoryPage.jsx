import React, { useMemo, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/useLanguage';
import {
  CROPS,
  SEED_CROPS,
  DEMO_PRODUCTS,
  getCategoryBySlug
} from '../data/catalogData';

export default function CategoryPage() {
  const { categorySlug, subSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { language, t } = useLanguage();

  // Mobile filter drawer state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Look up current category
  const category = useMemo(() => {
    return getCategoryBySlug(categorySlug);
  }, [categorySlug]);

  // If seeds, determine active seed crop subcategory
  const isSeedsCategory = category?.slug === 'seeds';
  const activeSeedCrop = useMemo(() => {
    if (!isSeedsCategory || !subSlug) return null;
    return SEED_CROPS.find((sc) => sc.slug === subSlug.toLowerCase()) || null;
  }, [isSeedsCategory, subSlug]);

  // Filter params from URL query string
  const selectedBrand = searchParams.get('brand') || 'ALL';
  const selectedAvailability = searchParams.get('availability') || 'ALL';
  const selectedCrop = searchParams.get('crop') || 'ALL';
  const selectedSubtype = searchParams.get('subtype') || 'ALL';
  const selectedPriceRange = searchParams.get('priceRange') || 'ALL';
  const selectedFirm = searchParams.get('firm') || 'ALL';
  const sortBy = searchParams.get('sort') || 'featured';

  // Helper to update query params while preserving current category & route
  const updateQueryParam = (key, value) => {
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

  // Base products strictly belonging to this category
  const baseCategoryProducts = useMemo(() => {
    if (!category) return [];
    return DEMO_PRODUCTS.filter((product) => {
      return (
        product.category.toLowerCase().trim() === category.name.toLowerCase().trim() ||
        (category.id === 'other-inputs' && product.category === 'Other Agricultural Inputs')
      );
    });
  }, [category]);

  // Calculate live item counts for seed crop pills
  const seedCropCounts = useMemo(() => {
    if (!isSeedsCategory) return {};
    const counts = { all: baseCategoryProducts.length };
    SEED_CROPS.forEach((crop) => {
      counts[crop.slug] = baseCategoryProducts.filter((product) => {
        const matchesCropId = product.crops && product.crops.includes(crop.cropId);
        const matchesCropSlug = product.crops && product.crops.includes(crop.slug);
        const matchesSub =
          product.subcategory &&
          product.subcategory.toLowerCase().includes(crop.slug.toLowerCase());
        return matchesCropId || matchesCropSlug || matchesSub;
      }).length;
    });
    return counts;
  }, [isSeedsCategory, baseCategoryProducts]);

  // Available filter options dynamic to products in this category
  const availableBrands = useMemo(() => {
    const set = new Set();
    baseCategoryProducts.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set).sort();
  }, [baseCategoryProducts]);

  const availableCrops = useMemo(() => {
    const cropIdSet = new Set();
    baseCategoryProducts.forEach((p) => {
      if (p.crops && Array.isArray(p.crops)) {
        p.crops.forEach((c) => cropIdSet.add(c));
      }
    });
    return CROPS.filter((c) => cropIdSet.has(c.id));
  }, [baseCategoryProducts]);

  const availableSubtypes = useMemo(() => {
    if (category?.subcategories && category.subcategories.length > 0) {
      return category.subcategories;
    }
    const set = new Set();
    baseCategoryProducts.forEach((p) => {
      if (p.subcategory) set.add(p.subcategory);
    });
    return Array.from(set);
  }, [category, baseCategoryProducts]);

  const hasPricedProducts = useMemo(() => {
    return baseCategoryProducts.some((p) => p.price !== null && p.price !== undefined);
  }, [baseCategoryProducts]);

  // Filtered and sorted products
  const displayedProducts = useMemo(() => {
    if (!category) return [];

    // 1. Filter
    const filtered = baseCategoryProducts.filter((product) => {
      // Crop route filter (for /category/seeds/:subSlug)
      if (activeSeedCrop) {
        const matchesCropId =
          product.crops && product.crops.includes(activeSeedCrop.cropId);
        const matchesCropSlug =
          product.crops && product.crops.includes(activeSeedCrop.slug);
        const matchesSub =
          product.subcategory &&
          product.subcategory.toLowerCase().includes(activeSeedCrop.slug.toLowerCase());
        if (!matchesCropId && !matchesCropSlug && !matchesSub) {
          return false;
        }
      }

      // Brand filter
      if (selectedBrand !== 'ALL' && product.brand !== selectedBrand) {
        return false;
      }

      // Firm filter
      if (selectedFirm !== 'ALL' && product.firmCode !== selectedFirm) {
        return false;
      }

      // Availability filter
      if (selectedAvailability === 'in-stock' && !product.isAvailable) {
        return false;
      }

      // Crop type filter (sidebar selection)
      if (selectedCrop !== 'ALL') {
        const hasCrop =
          product.crops &&
          product.crops.some((c) => c.toLowerCase() === selectedCrop.toLowerCase());
        if (!hasCrop) return false;
      }

      // Product Subtype filter
      if (selectedSubtype !== 'ALL') {
        if (!product.subcategory || product.subcategory !== selectedSubtype) {
          return false;
        }
      }

      // Price Range filter
      if (selectedPriceRange !== 'ALL') {
        if (selectedPriceRange === 'under-500') {
          if (product.price === null || product.price === undefined || product.price >= 500) {
            return false;
          }
        } else if (selectedPriceRange === '500-1000') {
          if (
            product.price === null ||
            product.price === undefined ||
            product.price < 500 ||
            product.price > 1000
          ) {
            return false;
          }
        } else if (selectedPriceRange === 'above-1000') {
          if (product.price === null || product.price === undefined || product.price <= 1000) {
            return false;
          }
        } else if (selectedPriceRange === 'quote-only') {
          if (product.priceType !== 'quote_only' && product.price !== null) {
            return false;
          }
        } else if (selectedPriceRange === 'priced-only') {
          if (product.price === null || product.price === undefined || product.price <= 0) {
            return false;
          }
        }
      }

      return true;
    });

    // 2. Sort
    return [...filtered].sort((a, b) => {
      if (sortBy === 'price-low') {
        const priceA = a.price ?? Number.POSITIVE_INFINITY;
        const priceB = b.price ?? Number.POSITIVE_INFINITY;
        return priceA - priceB;
      }
      if (sortBy === 'price-high') {
        const priceA = a.price ?? -1;
        const priceB = b.price ?? -1;
        return priceB - priceA;
      }
      if (sortBy === 'newest') {
        return (b.id || 0) - (a.id || 0);
      }
      // 'featured': preserve natural catalog order
      return (a.id || 0) - (b.id || 0);
    });
  }, [
    category,
    baseCategoryProducts,
    activeSeedCrop,
    selectedBrand,
    selectedAvailability,
    selectedCrop,
    selectedSubtype,
    selectedPriceRange,
    selectedFirm,
    sortBy
  ]);

  // Check if any sidebar filters are active
  const hasActiveFilters =
    selectedBrand !== 'ALL' ||
    selectedAvailability !== 'ALL' ||
    selectedCrop !== 'ALL' ||
    selectedSubtype !== 'ALL' ||
    selectedPriceRange !== 'ALL' ||
    selectedFirm !== 'ALL';

  const activeFiltersCount =
    (selectedBrand !== 'ALL' ? 1 : 0) +
    (selectedAvailability !== 'ALL' ? 1 : 0) +
    (selectedCrop !== 'ALL' ? 1 : 0) +
    (selectedSubtype !== 'ALL' ? 1 : 0) +
    (selectedPriceRange !== 'ALL' ? 1 : 0) +
    (selectedFirm !== 'ALL' ? 1 : 0);

  // 404 Not Found state if invalid category slug
  if (!category) {
    return (
      <div className="container py-5 my-5 text-center" id="category-not-found">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light mb-3"
          style={{ width: '80px', height: '80px' }}
        >
          <i className="bi bi-folder-x fs-1 text-secondary"></i>
        </div>
        <h3 className="fw-bold brand-font text-dark mb-2">
          {t('categoryNotFound', 'Category Not Found')}
        </h3>
        <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: '480px' }}>
          {t(
            'categoryNotFoundDesc',
            'The requested category does not exist in the Vinay Agri Inputs catalog.'
          )}
        </p>
        <div className="d-flex justify-content-center gap-2">
          <Link to="/" className="btn btn-emerald px-4 py-2">
            <i className="bi bi-house-door me-1.5"></i>
            {t('home', 'Home')}
          </Link>
          <Link to="/products" className="btn btn-outline-secondary px-4 py-2">
            {t('browseAllCategoriesBtn', 'Browse Catalog')}
          </Link>
        </div>
      </div>
    );
  }

  // Active category titles and descriptions
  const localizedCategoryName = t(category.name, category.name);
  const localizedCategoryDesc = t('cat_desc_' + category.slug, t('cat_desc_' + category.id, category.description));
  const activeSeedCropTitle = activeSeedCrop
    ? language === 'hi'
      ? activeSeedCrop.hindiName
      : activeSeedCrop.name
    : null;

  return (
    <div className="category-page-wrapper bg-warm-offwhite py-3 py-lg-4" id="category-page">
      <div className="container">
        {/* =========================================================================
            1. BREADCRUMBS
            ========================================================================= */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb small mb-0 bg-transparent p-0 align-items-center">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-muted hover-text-dark">
                <i className="bi bi-house-door me-1"></i>
                {t('home', 'Home')}
              </Link>
            </li>
            <li className="breadcrumb-item">
              <span className="text-muted">{t('categories', 'Categories')}</span>
            </li>
            {activeSeedCrop ? (
              <>
                <li className="breadcrumb-item">
                  <Link
                    to={`/category/${category.slug}`}
                    className="text-decoration-none text-muted hover-text-dark"
                  >
                    {localizedCategoryName}
                  </Link>
                </li>
                <li
                  className="breadcrumb-item active text-forest-green fw-semibold"
                  aria-current="page"
                >
                  {activeSeedCropTitle}
                </li>
              </>
            ) : (
              <li
                className="breadcrumb-item active text-forest-green fw-semibold"
                aria-current="page"
              >
                {localizedCategoryName}
              </li>
            )}
          </ol>
        </nav>

        {/* =========================================================================
            2. CATEGORY HERO HEADER
            ========================================================================= */}
        <div
          className="card border-0 rounded-4 shadow-sm p-4 p-md-4 mb-4 bg-white position-relative overflow-hidden"
          style={{ borderLeft: `6px solid ${category.color || '#16a34a'}` }}
        >
          <div className="row align-items-center g-3">
            <div className="col-12 col-md-8">
              <div className="d-flex align-items-center gap-3 mb-2">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    backgroundColor: `${category.color || '#16a34a'}18`,
                    color: category.color || '#16a34a',
                    width: '54px',
                    height: '54px'
                  }}
                >
                  <i className={`bi ${category.icon} fs-2`}></i>
                </div>
                <div>
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <h2 className="fw-bold brand-font text-dark mb-0 fs-3">
                      {activeSeedCrop ? `${localizedCategoryName} • ${activeSeedCropTitle}` : localizedCategoryName}
                    </h2>
                    <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-2.5 py-1 small">
                      <i className="bi bi-box-seam me-1"></i>
                      {displayedProducts.length}{' '}
                      {displayedProducts.length === 1
                        ? t('products', 'Product')
                        : t('products', 'Products')}
                    </span>
                  </div>
                  <span className="text-muted small" style={{ fontSize: '0.8rem' }}>
                    {t('demonstrationNoticeCategory', 'Demonstration catalog products for Tonk, Rajasthan')}
                  </span>
                </div>
              </div>
              <p className="text-secondary small mb-0 mt-2" style={{ maxWidth: '780px', lineHeight: 1.55 }}>
                {localizedCategoryDesc}
              </p>
            </div>

            <div className="col-12 col-md-4 text-md-end">
              <div className="d-inline-flex flex-column align-items-md-end gap-1">
                <span className="badge bg-light text-secondary border px-2.5 py-1 small">
                  <i className="bi bi-geo-alt text-danger me-1"></i>
                  {t('tonkOperatingFirms', 'Tonk Regional Mandi Catalog')}
                </span>
                <span className="text-muted" style={{ fontSize: '0.74rem' }}>
                  {t('governanceBadge', '4-Firm Governance')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. SEED CROPS SUB-NAVIGATION PILLS (Exclusive to Seeds category)
            ========================================================================= */}
        {isSeedsCategory && (
          <div className="card border-0 rounded-4 shadow-sm p-3 mb-4 bg-white" id="seed-crops-pill-nav">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small fw-bold text-dark text-uppercase tracking-wider">
                <i className="bi bi-flower2 text-success me-1.5"></i>
                {t('seedCropVarieties', 'Crop Seed Varieties')}
              </span>
              <span className="text-muted" style={{ fontSize: '0.76rem' }}>
                {SEED_CROPS.length} {t('types', 'Types')}
              </span>
            </div>
            <div className="d-flex flex-nowrap overflow-x-auto gap-2 py-1 scrollbar-thin">
              {/* All Seeds Tab */}
              <Link
                to="/category/seeds"
                className={`btn btn-sm rounded-pill text-nowrap px-3 py-1.5 d-flex align-items-center gap-1.5 ${
                  !subSlug ? 'btn-emerald text-white fw-semibold' : 'btn-light border text-secondary'
                }`}
                id="seed-crop-all"
              >
                <span>{t('allSeeds', 'All Seeds')}</span>
                <span
                  className={`badge rounded-pill small ${
                    !subSlug ? 'bg-white text-success' : 'bg-secondary-subtle text-secondary'
                  }`}
                  style={{ fontSize: '0.68rem' }}
                >
                  {seedCropCounts.all || 0}
                </span>
              </Link>

              {/* Individual Seed Crops */}
              {SEED_CROPS.map((crop) => {
                const isActive = subSlug?.toLowerCase() === crop.slug;
                const count = seedCropCounts[crop.slug] || 0;
                return (
                  <Link
                    key={crop.slug}
                    to={`/category/seeds/${crop.slug}`}
                    className={`btn btn-sm rounded-pill text-nowrap px-3 py-1.5 d-flex align-items-center gap-1.5 ${
                      isActive ? 'btn-emerald text-white fw-semibold' : 'btn-light border text-secondary'
                    }`}
                    id={`seed-crop-${crop.slug}`}
                  >
                    <i className={`bi ${crop.icon}`} style={{ fontSize: '0.85rem' }}></i>
                    <span>{language === 'hi' ? crop.hindiName : crop.name}</span>
                    <span
                      className={`badge rounded-pill small ${
                        isActive
                          ? 'bg-white text-success'
                          : count > 0
                          ? 'bg-success-subtle text-success border border-success-subtle'
                          : 'bg-light text-muted border'
                      }`}
                      style={{ fontSize: '0.68rem' }}
                    >
                      {count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            4. TOOLBAR ROW: MOBILE FILTER TOGGLE & SORT DROPDOWN
            ========================================================================= */}
        <div className="card border-0 rounded-3 shadow-sm p-3 mb-4 bg-white">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
            {/* Left: Product count & active filters indicator */}
            <div className="d-flex align-items-center gap-2">
              {/* Mobile Filter Toggle Button */}
              <button
                type="button"
                className="btn btn-sm btn-outline-success d-lg-none fw-semibold d-flex align-items-center gap-1.5"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                aria-expanded={mobileFiltersOpen}
                aria-controls="filter-sidebar"
                id="mobile-filter-btn"
              >
                <i className="bi bi-funnel"></i>
                <span>{t('mobileFilterToggle', 'Filter & Sort')}</span>
                {activeFiltersCount > 0 && (
                  <span className="badge rounded-pill bg-success text-white">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <span className="small text-secondary">
                {displayedProducts.length === baseCategoryProducts.length
                  ? t('showingAllProductsCount', 'Showing all {count} items').replace('{count}', displayedProducts.length)
                  : t('showingProductsCount', 'Showing {shown} of {total} items')
                      .replace('{shown}', displayedProducts.length)
                      .replace('{total}', baseCategoryProducts.length)}
              </span>
            </div>

            {/* Right: Sort Dropdown */}
            <div className="d-flex align-items-center gap-2 ms-auto">
              <label htmlFor="sort-select" className="small text-muted fw-semibold text-nowrap mb-0 d-none d-sm-inline">
                <i className="bi bi-arrow-down-up me-1"></i>
                {t('sortBy', 'Sort By')}:
              </label>
              <select
                id="sort-select"
                className="form-select form-select-sm border-secondary-subtle"
                style={{ minWidth: '170px' }}
                value={sortBy}
                onChange={(e) => updateQueryParam('sort', e.target.value)}
              >
                <option value="featured">{t('sortFeatured', 'Featured')}</option>
                <option value="price-low">{t('sortPriceLowHigh', 'Price: Low to High')}</option>
                <option value="price-high">{t('sortPriceHighLow', 'Price: High to Low')}</option>
                <option value="newest">{t('sortNewest', 'Newest')}</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="active-criteria-row pt-3 mt-3 border-top">
              <span className="active-criteria-label">
                {t('activeCriteria', 'Active Criteria:')}
              </span>

              {selectedFirm !== 'ALL' && (
                <span className="active-filter-chip">
                  <span className="active-filter-chip-text">
                    {t('firm', 'Firm')}: <strong>{selectedFirm}</strong>
                  </span>
                  <button
                    type="button"
                    className="active-filter-chip-remove"
                    onClick={() => updateQueryParam('firm', 'ALL')}
                    aria-label={`${t('remove', 'Remove')} ${t('firm', 'Firm')} filter`}
                    title={`${t('remove', 'Remove')} ${t('firm', 'Firm')} filter`}
                  >
                    <i className="bi bi-x-lg" aria-hidden="true"></i>
                  </button>
                </span>
              )}

              {selectedBrand !== 'ALL' && (
                <span className="active-filter-chip">
                  <span className="active-filter-chip-text">
                    {t('brandFilter', 'Brand')}: <strong>{selectedBrand}</strong>
                  </span>
                  <button
                    type="button"
                    className="active-filter-chip-remove"
                    onClick={() => updateQueryParam('brand', 'ALL')}
                    aria-label={`${t('remove', 'Remove')} ${t('brandFilter', 'Brand')} filter`}
                    title={`${t('remove', 'Remove')} ${t('brandFilter', 'Brand')} filter`}
                  >
                    <i className="bi bi-x-lg" aria-hidden="true"></i>
                  </button>
                </span>
              )}

              {selectedAvailability !== 'ALL' && (
                <span className="active-filter-chip">
                  <span className="active-filter-chip-text">
                    {t('inStockOnly', 'In Stock Only')}
                  </span>
                  <button
                    type="button"
                    className="active-filter-chip-remove"
                    onClick={() => updateQueryParam('availability', 'ALL')}
                    aria-label={`${t('remove', 'Remove')} ${t('availabilityFilter', 'Availability')} filter`}
                    title={`${t('remove', 'Remove')} ${t('availabilityFilter', 'Availability')} filter`}
                  >
                    <i className="bi bi-x-lg" aria-hidden="true"></i>
                  </button>
                </span>
              )}

              {selectedCrop !== 'ALL' && (
                <span className="active-filter-chip">
                  <span className="active-filter-chip-text">
                    {t('cropFilter', 'Crop')}: <strong>{selectedCrop}</strong>
                  </span>
                  <button
                    type="button"
                    className="active-filter-chip-remove"
                    onClick={() => updateQueryParam('crop', 'ALL')}
                    aria-label={`${t('remove', 'Remove')} ${t('cropFilter', 'Crop')} filter`}
                    title={`${t('remove', 'Remove')} ${t('cropFilter', 'Crop')} filter`}
                  >
                    <i className="bi bi-x-lg" aria-hidden="true"></i>
                  </button>
                </span>
              )}

              {selectedSubtype !== 'ALL' && (
                <span className="active-filter-chip">
                  <span className="active-filter-chip-text">
                    {t('productSubtype', 'Subtype')}: <strong>{selectedSubtype}</strong>
                  </span>
                  <button
                    type="button"
                    className="active-filter-chip-remove"
                    onClick={() => updateQueryParam('subtype', 'ALL')}
                    aria-label={`${t('remove', 'Remove')} ${t('productSubtype', 'Subtype')} filter`}
                    title={`${t('remove', 'Remove')} ${t('productSubtype', 'Subtype')} filter`}
                  >
                    <i className="bi bi-x-lg" aria-hidden="true"></i>
                  </button>
                </span>
              )}

              {selectedPriceRange !== 'ALL' && (
                <span className="active-filter-chip">
                  <span className="active-filter-chip-text">
                    {selectedPriceRange === 'under-500' && t('under500', 'Under ₹500')}
                    {selectedPriceRange === '500-1000' && t('price500to1000', '₹500 - ₹1,000')}
                    {selectedPriceRange === 'above-1000' && t('above1000', 'Above ₹1,000')}
                    {selectedPriceRange === 'quote-only' && t('quoteOnlyFilter', 'Bulk / Mandi Quote')}
                    {selectedPriceRange === 'priced-only' && t('pricedItemsOnly', 'Direct Price Configured')}
                  </span>
                  <button
                    type="button"
                    className="active-filter-chip-remove"
                    onClick={() => updateQueryParam('priceRange', 'ALL')}
                    aria-label={`${t('remove', 'Remove')} ${t('priceRange', 'Price Range')} filter`}
                    title={`${t('remove', 'Remove')} ${t('priceRange', 'Price Range')} filter`}
                  >
                    <i className="bi bi-x-lg" aria-hidden="true"></i>
                  </button>
                </span>
              )}

              <button
                type="button"
                className="active-criteria-clear-btn"
                onClick={clearAllFilters}
                id="clear-active-filters-btn"
                title={t('clearFilters', 'Clear Filters')}
              >
                <i className="bi bi-x-circle" aria-hidden="true"></i>
                <span>{t('clearFilters', 'Clear Filters')}</span>
              </button>
            </div>
          )}
        </div>

        {/* =========================================================================
            5. MAIN CONTENT LAYOUT (Sidebar Filters Left, Product Grid Right)
            ========================================================================= */}
        <div className="row g-4">
          {/* =======================
              FILTER SIDEBAR
              ======================= */}
          <aside
            className={`col-lg-3 ${mobileFiltersOpen ? 'd-block' : 'd-none d-lg-block'}`}
            id="filter-sidebar"
          >
            <div className="card border-0 rounded-4 shadow-sm p-4 bg-white sticky-top" style={{ top: '90px' }}>
              <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
                <h5 className="fw-bold brand-font text-dark mb-0 fs-6 d-flex align-items-center gap-2">
                  <i className="bi bi-sliders text-success"></i>
                  {t('filterSidebarTitle', 'Filter Products')}
                </h5>
                <div className="d-flex align-items-center gap-2">
                  {hasActiveFilters && (
                    <button
                      type="button"
                      className="btn btn-sm btn-link text-danger p-0 text-decoration-none small"
                      onClick={clearAllFilters}
                      title={t('clearFilters', 'Clear Filters')}
                    >
                      {t('clearFilters', 'Clear')}
                    </button>
                  )}
                  {/* Close button on mobile */}
                  <button
                    type="button"
                    className="btn-close d-lg-none"
                    onClick={() => setMobileFiltersOpen(false)}
                    aria-label={t('closeFilters', 'Close Filters')}
                  ></button>
                </div>
              </div>

              {/* Filter 1: Product Subtype (if category has subtypes) */}
              {availableSubtypes.length > 0 && (
                <div className="mb-4">
                  <label htmlFor="filter-subtype" className="form-label small fw-bold text-dark text-uppercase tracking-wider mb-2">
                    {t('productSubtype', 'Product Subtype')}
                  </label>
                  <select
                    id="filter-subtype"
                    className="form-select form-select-sm border-secondary-subtle"
                    value={selectedSubtype}
                    onChange={(e) => updateQueryParam('subtype', e.target.value)}
                  >
                    <option value="ALL">{t('allSubtypes', 'All Subtypes')}</option>
                    {availableSubtypes.map((sub, i) => (
                      <option key={i} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Filter 2: Brand */}
              {availableBrands.length > 0 && (
                <div className="mb-4">
                  <label htmlFor="filter-brand" className="form-label small fw-bold text-dark text-uppercase tracking-wider mb-2">
                    {t('brandFilter', 'Brand / Manufacturer')}
                  </label>
                  <select
                    id="filter-brand"
                    className="form-select form-select-sm border-secondary-subtle"
                    value={selectedBrand}
                    onChange={(e) => updateQueryParam('brand', e.target.value)}
                  >
                    <option value="ALL">{t('allBrands', 'All Brands')}</option>
                    {availableBrands.map((brand, i) => (
                      <option key={i} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Filter 3: Crop Type (only where crops are configured for this category) */}
              {availableCrops.length > 0 && (
                <div className="mb-4">
                  <label htmlFor="filter-crop" className="form-label small fw-bold text-dark text-uppercase tracking-wider mb-2">
                    {t('cropFilter', 'Crop Suitability')}
                  </label>
                  <select
                    id="filter-crop"
                    className="form-select form-select-sm border-secondary-subtle"
                    value={selectedCrop}
                    onChange={(e) => updateQueryParam('crop', e.target.value)}
                  >
                    <option value="ALL">{t('allCrops', 'All Crops')}</option>
                    {availableCrops.map((crop) => (
                      <option key={crop.id} value={crop.id}>
                        {crop.name} ({crop.hindiName})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Filter 4: Price Range (only where prices exist in this category) */}
              {hasPricedProducts && (
                <div className="mb-4">
                  <label htmlFor="filter-price" className="form-label small fw-bold text-dark text-uppercase tracking-wider mb-2">
                    {t('priceRange', 'Price Range')}
                  </label>
                  <select
                    id="filter-price"
                    className="form-select form-select-sm border-secondary-subtle"
                    value={selectedPriceRange}
                    onChange={(e) => updateQueryParam('priceRange', e.target.value)}
                  >
                    <option value="ALL">{t('allPrices', 'All Prices')}</option>
                    <option value="under-500">{t('under500', 'Under ₹500')}</option>
                    <option value="500-1000">{t('price500to1000', '₹500 - ₹1,000')}</option>
                    <option value="above-1000">{t('above1000', 'Above ₹1,000')}</option>
                    <option value="quote-only">{t('quoteOnlyFilter', 'Bulk / Mandi Quote')}</option>
                  </select>
                </div>
              )}

              {/* Filter 5: Stock Availability Checkbox */}
              <div className="mb-3 pt-2 border-top">
                <label className="form-label small fw-bold text-dark text-uppercase tracking-wider mb-2">
                  {t('availabilityFilter', 'Stock Availability')}
                </label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="switch-in-stock"
                    checked={selectedAvailability === 'in-stock'}
                    onChange={(e) =>
                      updateQueryParam('availability', e.target.checked ? 'in-stock' : 'ALL')
                    }
                  />
                  <label className="form-check-label small text-secondary" htmlFor="switch-in-stock">
                    {t('inStockOnly', 'In Stock Only')}
                  </label>
                </div>
              </div>

              {/* Mobile Drawer Action Buttons */}
              <div className="d-lg-none pt-3 mt-3 border-top d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-emerald w-100 btn-sm py-2"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  {t('applyFilters', 'Apply Filters')}
                </button>
                {hasActiveFilters && (
                  <button
                    type="button"
                    className="btn btn-outline-danger w-50 btn-sm py-2"
                    onClick={() => {
                      clearAllFilters();
                      setMobileFiltersOpen(false);
                    }}
                  >
                    {t('clearFilters', 'Reset')}
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* =======================
              PRODUCT GRID / EMPTY STATE
              ======================= */}
          <section className="col-12 col-lg-9" id="product-grid-section">
            {displayedProducts.length > 0 ? (
              <div className="row g-3 g-md-4">
                {displayedProducts.map((product) => (
                  <div className="col-12 col-sm-6 col-xl-4" key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div
                className="card border-0 rounded-4 shadow-sm p-5 text-center bg-white my-2"
                id="category-empty-state"
              >
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light mx-auto mb-3"
                  style={{ width: '84px', height: '84px' }}
                >
                  <i className="bi bi-inbox fs-1 text-muted"></i>
                </div>
                <h4 className="fw-bold brand-font text-dark mb-2">
                  {t(
                    'noProductsInCategory',
                    'No products found in this category matching your filters.'
                  )}
                </h4>
                <p className="text-secondary small mb-4 mx-auto" style={{ maxWidth: '520px', lineHeight: 1.55 }}>
                  {t(
                    'noProductsInCategoryDesc',
                    'We regularly restock crop inputs and seasonal varieties for the Tonk agricultural region. Try clearing some filters or browse all products in this category.'
                  )}
                </p>

                <div className="d-flex flex-wrap justify-content-center gap-2">
                  {hasActiveFilters && (
                    <button
                      type="button"
                      className="btn btn-emerald px-4 py-2"
                      onClick={clearAllFilters}
                      id="empty-clear-filters-btn"
                    >
                      <i className="bi bi-arrow-counterclockwise me-1.5"></i>
                      {t('viewAllCategoryProducts', 'Clear Category Filters')}
                    </button>
                  )}

                  {activeSeedCrop && (
                    <Link
                      to="/category/seeds"
                      className="btn btn-outline-success px-4 py-2"
                      id="empty-all-seeds-btn"
                    >
                      <i className="bi bi-flower2 me-1.5"></i>
                      {t('allSeeds', 'View All Seeds')}
                    </Link>
                  )}

                  <Link to="/" className="btn btn-outline-secondary px-4 py-2">
                    <i className="bi bi-grid me-1.5"></i>
                    {t('browseAllCategoriesBtn', 'Explore All Categories')}
                  </Link>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
