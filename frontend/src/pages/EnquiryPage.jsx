import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/useLanguage';

export default function EnquiryPage() {
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const initialProduct = searchParams.get('product') || '';
  const initialFirm = searchParams.get('firm') || 'VAI';

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    city: 'Tonk',
    firmCode: initialFirm,
    enquiryType: 'BULK_QUOTATION',
    productSku: initialProduct,
    quantityRequired: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container py-5" id="enquiry-page">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-semibold mb-2 border border-success-subtle">
              {t('enquiryBadge', 'Direct Business Communication')}
            </span>
            <h2 className="fw-bold brand-font text-dark">{t('enquiryTitle', 'Product Enquiries & Bulk Quotation Requests')}</h2>
            <p className="text-secondary mx-auto" style={{ maxWidth: '600px' }}>
              {t('enquirySubtitle', 'Farmers, co-operatives, and regional retailers can request bulk commercial rates, institutional tenders, and agency partnerships.')}
            </p>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
            {submitted ? (
              <div className="text-center py-4" id="enquiry-success-message">
                <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success d-inline-flex mb-3">
                  <i className="bi bi-check2-circle fs-1"></i>
                </div>
                <h4 className="fw-bold text-dark mb-2">{t('quotationReceived', 'Quotation Request Received!')}</h4>
                <p className="text-secondary mb-4">
                  {t('enquirySuccessThankYou', 'Thank you, {name}. Your quotation request has been routed to the authorized manager for {firm} in Tonk, Rajasthan. Our distribution desk will reach you at {phone}.', {
                    name: formData.customerName,
                    firm: formData.firmCode,
                    phone: formData.customerPhone
                  })}
                </p>
                <button
                  className="btn btn-outline-success"
                  onClick={() => setSubmitted(false)}
                >
                  {t('submitAnother', 'Submit Another Request')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} id="enquiry-form">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary">{t('firmSelectLabel', 'Target Enterprise Firm')}</label>
                    <select
                      className="form-select"
                      name="firmCode"
                      value={formData.firmCode}
                      onChange={handleChange}
                      required
                      id="enquiry-firm-select"
                    >
                      <option value="VAI">{t('vaiOption', 'Vinay Agri Inputs (Pesticides & Crop Nutrition)')}</option>
                      <option value="GTAA">{t('gtaaOption', 'Gupta Traders & Auto Agencies (Tractor & Implements)')}</option>
                      <option value="VKBB">{t('vkbbOption', 'Vinay Khad Beej Bhandaar (Seeds & Fertilizers)')}</option>
                      <option value="GTT">{t('gttOption', 'Gupta Traders, Tonk (Agri Commodities & Trading)')}</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary">{t('enquiryClassification', 'Enquiry Classification')}</label>
                    <select
                      className="form-select"
                      name="enquiryType"
                      value={formData.enquiryType}
                      onChange={handleChange}
                      required
                      id="enquiry-type-select"
                    >
                      <option value="BULK_QUOTATION">{t('enquiryBulkQuotation', 'Bulk Commercial Quotation (Truck / Metric Ton)')}</option>
                      <option value="PRODUCT">{t('enquiryProductInfo', 'Product Technical Information / Dosage')}</option>
                      <option value="AGENCY">{t('enquiryAgency', 'Agency Partnership / Dealership Enquiry')}</option>
                      <option value="GENERAL">{t('enquiryGeneral', 'General Customer Support')}</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary">{t('fullName', 'Your Full Name')}</label>
                    <input
                      type="text"
                      className="form-control"
                      name="customerName"
                      placeholder={t('namePlaceholder', 'e.g. Ramesh Chandra Sharma')}
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                      id="enquiry-name-input"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary">{t('phoneLabel', 'Contact Mobile Number')}</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="customerPhone"
                      placeholder={t('phonePlaceholder', '10-digit mobile number')}
                      value={formData.customerPhone}
                      onChange={handleChange}
                      required
                      id="enquiry-phone-input"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary">{t('email', 'Email Address (Optional)')}</label>
                    <input
                      type="email"
                      className="form-control"
                      name="customerEmail"
                      placeholder="name@example.com"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      id="enquiry-email-input"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary">{t('townDistrict', 'Town / Tehsil / District')}</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      placeholder={t('townPlaceholder', 'e.g. Tonk / Niwai / Deoli / Malpura')}
                      value={formData.city}
                      onChange={handleChange}
                      required
                      id="enquiry-city-input"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary">{t('productSku', 'Product SKU / Name (Optional)')}</label>
                    <input
                      type="text"
                      className="form-control"
                      name="productSku"
                      placeholder="e.g. PRD-BIO-001 or Urea / DAP"
                      value={formData.productSku}
                      onChange={handleChange}
                      id="enquiry-product-input"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary">{t('quantityNeeded', 'Estimated Quantity Needed')}</label>
                    <input
                      type="text"
                      className="form-control"
                      name="quantityRequired"
                      placeholder="e.g. 50 Bags, 10 Metric Tons, 25 Units"
                      value={formData.quantityRequired}
                      onChange={handleChange}
                      id="enquiry-qty-input"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold text-secondary">{t('messageOrNotes', 'Requirements & Specific Notes')}</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      name="message"
                      placeholder={t('notesPlaceholder', 'Please specify any specific brand preferences, required delivery timeline to Tonk Mandi or nearby villages, or billing requirements...')}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      id="enquiry-message-input"
                    ></textarea>
                  </div>

                  <div className="col-12 mt-4">
                    <button
                      type="submit"
                      className="btn btn-emerald btn-lg w-100"
                      id="btn-submit-enquiry"
                    >
                      <i className="bi bi-send-fill me-2"></i> {t('submitEnquiryBtn', 'Submit Quotation Request')}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
