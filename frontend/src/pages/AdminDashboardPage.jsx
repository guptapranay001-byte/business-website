import React, { useState } from 'react';
import { useLanguage } from '../context/useLanguage';

export default function AdminDashboardPage() {
  const { t } = useLanguage();
  const [selectedFirm, setSelectedFirm] = useState('ALL');
  const [activeTab, setActiveTab] = useState('firms'); // 'firms' | 'inventory' | 'agencies' | 'reports'

  const firmsData = [
    {
      code: 'VAI',
      name: 'Vinay Agri Inputs',
      gstin: '08AAAAA0000A1Z5',
      location: 'Station Road, Krishi Upaj Mandi, Tonk',
      specialty: 'Bio-Fertilizers & Crop Protection',
      totalProducts: 24,
      inventoryValue: '₹ 12,40,000',
      manager: 'Vinay Gupta',
      phone: '01432-240001'
    },
    {
      code: 'GTAA',
      name: 'Gupta Traders and Auto Agencies',
      gstin: '08AAAAA0000A2Z4',
      location: 'Old Bus Stand Road, Tonk',
      specialty: 'Tractor Implements, Auto & Engine Spares',
      totalProducts: 18,
      inventoryValue: '₹ 8,90,000',
      manager: 'Auto Agency Head',
      phone: '01432-240002'
    },
    {
      code: 'VKBB',
      name: 'Vinay Khad Beej Bhandaar',
      gstin: '08AAAAA0000A3Z3',
      location: 'Subhash Chowk, Grain Market, Tonk',
      specialty: 'Certified Seeds & Approved Fertilizers',
      totalProducts: 15,
      inventoryValue: '₹ 7,50,000',
      manager: 'Seed & Fertilizer Specialist',
      phone: '01432-240003'
    },
    {
      code: 'GTT',
      name: 'Gupta Traders, Tonk',
      gstin: '08AAAAA0000A4Z2',
      location: 'Mandi Samiti Complex, Tonk',
      specialty: 'Commodities, Bulk Commercial Supplies',
      totalProducts: 12,
      inventoryValue: '₹ 6,00,000',
      manager: 'Commodity Trading Desk',
      phone: '01432-240004'
    }
  ];

  const inventoryRecords = [
    { id: 1, firm: 'VAI', product: 'Organic Zinc Micro-Nutrient Chelate', batch: 'ZN-2026-A', qty: 340, reorder: 50, status: 'In Stock' },
    { id: 2, firm: 'VAI', product: 'Systemic Insecticide Chlorpyrifos', batch: 'CP-2026-X', qty: 25, reorder: 30, status: 'Low Stock' },
    { id: 3, firm: 'GTAA', product: 'Tractor Cultivator Blades (9-Set)', batch: 'CB-2026-09', qty: 85, reorder: 20, status: 'In Stock' },
    { id: 4, firm: 'GTAA', product: 'Diesel Engine Filter Assembly', batch: 'DF-2026-04', qty: 110, reorder: 25, status: 'In Stock' },
    { id: 5, firm: 'VKBB', product: 'Hybrid Mustard Seeds (Grade 59)', batch: 'MS-59-RJ', qty: 15, reorder: 40, status: 'Low Stock' },
    { id: 6, firm: 'VKBB', product: 'Zinc Sulphate Agriculture Grade', batch: 'ZS-2026-01', qty: 450, reorder: 100, status: 'In Stock' },
    { id: 7, firm: 'GTT', product: 'Commercial DAP (50 KG)', batch: 'DAP-BULK-01', qty: 200, reorder: 50, status: 'In Stock' },
  ];

  const filteredInventory = inventoryRecords.filter(
    (item) => selectedFirm === 'ALL' || item.firm === selectedFirm
  );

  return (
    <div className="container-fluid px-lg-5 py-4" id="admin-dashboard-page">
      {/* Top Header Bar */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center pb-3 mb-4 border-bottom gap-3">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h2 className="fw-bold brand-font text-dark mb-0">{t('adminDashboardTitle', 'Centralized Enterprise Dashboard')}</h2>
            <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1">
              {t('adminGovernance', 'Admin Governance')}
            </span>
          </div>
          <small className="text-secondary">
            {t('adminSubtitle', 'Consolidated Management for 4 Sister Operating Firms in Tonk, Rajasthan')}
          </small>
        </div>

        {/* Multi-Firm Scope Switcher */}
        <div className="d-flex align-items-center gap-2">
          <label className="text-secondary small fw-bold mb-0">{t('scopeView', 'Scope View:')}</label>
          <select
            className="form-select form-select-sm fw-semibold border-success"
            style={{ minWidth: '240px' }}
            value={selectedFirm}
            onChange={(e) => setSelectedFirm(e.target.value)}
            id="admin-firm-scope-select"
          >
            <option value="ALL">{t('consolidatedAllFirms', '🌐 Consolidated (All 4 Firms)')}</option>
            <option value="VAI">Vinay Agri Inputs (VAI)</option>
            <option value="GTAA">Gupta Traders & Auto Agencies (GTAA)</option>
            <option value="VKBB">Vinay Khad Beej Bhandaar (VKBB)</option>
            <option value="GTT">Gupta Traders, Tonk (GTT)</option>
          </select>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-secondary text-uppercase fw-semibold">{t('activeOperatingFirms', 'Active Operating Firms')}</small>
                <h3 className="fw-bold text-dark mt-1 mb-0">4 {t('firm', 'Firms')}</h3>
                <small className="text-success fw-medium">{t('allBasedInTonk', 'All based in Tonk, RJ')}</small>
              </div>
              <div className="p-3 rounded-3 bg-success bg-opacity-10 text-success">
                <i className="bi bi-buildings fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-secondary text-uppercase fw-semibold">{t('catalogProductsMetric', 'Catalog Products')}</small>
                <h3 className="fw-bold text-dark mt-1 mb-0">69 SKUs</h3>
                <small className="text-primary fw-medium">{t('acrossCategories', 'Across 5 Categories')}</small>
              </div>
              <div className="p-3 rounded-3 bg-primary bg-opacity-10 text-primary">
                <i className="bi bi-boxes fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-secondary text-uppercase fw-semibold">{t('inventoryValuation', 'Inventory Valuation')}</small>
                <h3 className="fw-bold text-dark mt-1 mb-0">₹ 34.8 Lakh</h3>
                <small className="text-muted fw-medium">{t('consolidatedValuation', 'Consolidated Valuation')}</small>
              </div>
              <div className="p-3 rounded-3 bg-warning bg-opacity-10 text-warning">
                <i className="bi bi-currency-rupee fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-secondary text-uppercase fw-semibold">{t('pendingEnquiriesMetric', 'Pending Enquiries')}</small>
                <h3 className="fw-bold text-dark mt-1 mb-0">14 Active</h3>
                <small className="text-danger fw-medium">{t('bulkQuotationTenders', '3 Bulk Quotation Tenders')}</small>
              </div>
              <div className="p-3 rounded-3 bg-danger bg-opacity-10 text-danger">
                <i className="bi bi-chat-dots fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-pills mb-4 gap-2" id="admin-tabs">
        <li className="nav-item">
          <button
            className={`nav-link px-3 py-2 ${activeTab === 'firms' ? 'active bg-success text-white fw-semibold' : 'bg-white text-secondary shadow-sm'}`}
            onClick={() => setActiveTab('firms')}
            id="tab-firms"
          >
            <i className="bi bi-building me-1"></i> {t('firmEntitiesTab', 'Firm Entities ({count})', { count: firmsData.length })}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link px-3 py-2 ${activeTab === 'inventory' ? 'active bg-success text-white fw-semibold' : 'bg-white text-secondary shadow-sm'}`}
            onClick={() => setActiveTab('inventory')}
            id="tab-inventory"
          >
            <i className="bi bi-clipboard2-data me-1"></i> {t('firmInventoryTab', 'Firm-Specific Inventory')}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link px-3 py-2 ${activeTab === 'agencies' ? 'active bg-success text-white fw-semibold' : 'bg-white text-secondary shadow-sm'}`}
            onClick={() => setActiveTab('agencies')}
            id="tab-agencies"
          >
            <i className="bi bi-award me-1"></i> {t('authorizedAgenciesTab', 'Authorized Agencies & Brands')}
          </button>
        </li>
      </ul>

      {/* Tab 1: Firm Management */}
      {activeTab === 'firms' && (
        <div className="card border-0 shadow-sm rounded-3 overflow-hidden p-3 bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>{t('firmCodeCol', 'Code')}</th>
                  <th>{t('firmNameCol', 'Firm Name')}</th>
                  <th>{t('operatingSpecialtyCol', 'Operating Specialty')}</th>
                  <th>{t('gstinLocationCol', 'GSTIN & Mandi Location')}</th>
                  <th>{t('managerDeskCol', 'Manager / Desk')}</th>
                  <th>{t('inventoryValueCol', 'Inventory Value')}</th>
                  <th>{t('statusCol', 'Status')}</th>
                </tr>
              </thead>
              <tbody>
                {firmsData.map((f) => (
                  <tr key={f.code}>
                    <td>
                      <span className="badge bg-dark px-2.5 py-1.5">{f.code}</span>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{f.name}</div>
                      <small className="text-secondary">{f.phone}</small>
                    </td>
                    <td><span className="small text-secondary">{f.specialty}</span></td>
                    <td>
                      <div className="small font-monospace text-dark">{f.gstin}</div>
                      <small className="text-secondary">{f.location}</small>
                    </td>
                    <td><span className="small fw-semibold">{f.manager}</span></td>
                    <td><strong className="text-success">{f.inventoryValue}</strong></td>
                    <td><span className="badge bg-success-subtle text-success">{t('activeStatus', 'Active')}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Inventory & Batch Records */}
      {activeTab === 'inventory' && (
        <div className="card border-0 shadow-sm rounded-3 overflow-hidden p-3 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h6 className="fw-bold mb-0">{t('inventoryLedgerTitle', 'Batch & Multi-Firm Inventory Ledger')}</h6>
              <small className="text-secondary">{t('inventoryLedgerSub', 'Tracking isolated stock balances per firm')}</small>
            </div>
            <span className="badge bg-light text-dark border">
              {t('filteredBy', 'Filtered by:')} {selectedFirm === 'ALL' ? t('allFirms', 'All Firms') : selectedFirm}
            </span>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>{t('firm', 'Firm')}</th>
                  <th>{t('productDetails', 'Product Name')}</th>
                  <th>{t('productSku', 'Batch Number')}</th>
                  <th className="text-center">{t('qtyAvailable', 'Quantity Available')}</th>
                  <th className="text-center">{t('reorderLevel', 'Reorder Level')}</th>
                  <th>{t('stockHealth', 'Stock Health')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id}>
                    <td><span className="badge bg-dark">{item.firm}</span></td>
                    <td className="fw-semibold text-dark">{item.product}</td>
                    <td><code className="text-primary">{item.batch}</code></td>
                    <td className="text-center fw-bold">{item.qty} {t('units', 'units')}</td>
                    <td className="text-center text-secondary">{item.reorder} {t('units', 'units')}</td>
                    <td>
                      {item.status === 'Low Stock' ? (
                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                          <i className="bi bi-exclamation-triangle-fill me-1"></i> {t('Low Stock', 'Low Stock')}
                        </span>
                      ) : (
                        <span className="badge bg-success-subtle text-success border border-success-subtle">
                          <i className="bi bi-check-circle-fill me-1"></i> {t('inStock', 'Normal')}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Agency Partnerships */}
      {activeTab === 'agencies' && (
        <div className="row g-4">
          {[
            { name: 'IFFCO & KRIBHCO', type: 'Fertilizers & Urea', firm: 'Vinay Khad Beej Bhandaar & Gupta Traders', coverage: 'Tonk Mandi' },
            { name: 'Bayer Crop Science', type: 'Insecticides & Fungicides', firm: 'Vinay Agri Inputs', coverage: 'District Distributorship' },
            { name: 'Mahindra & Swaraj Spares', type: 'Tractor Spares & Auto Implements', firm: 'Gupta Traders and Auto Agencies', coverage: 'Tonk & Niwai Area' },
            { name: 'Pioneer & Bayer Hybrid Seeds', type: 'Mustard & Pearl Millet Seeds', firm: 'Vinay Khad Beej Bhandaar', coverage: 'Authorized Dealer' },
          ].map((agency, i) => (
            <div className="col-md-6" key={i}>
              <div className="card border-0 shadow-sm rounded-3 p-4 bg-white h-100">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="fw-bold text-dark mb-0">{agency.name}</h5>
                  <span className="badge bg-success text-white">{t('authorizedAgency', 'Authorized')}</span>
                </div>
                <div className="text-secondary small mb-3">{agency.type}</div>
                <div className="small text-secondary mb-1">
                  <strong>{t('contractedFirm', 'Contracted Firm:')}</strong> {agency.firm}
                </div>
                <div className="small text-secondary">
                  <strong>{t('territoryCoverage', 'Territory Coverage:')}</strong> {agency.coverage}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
