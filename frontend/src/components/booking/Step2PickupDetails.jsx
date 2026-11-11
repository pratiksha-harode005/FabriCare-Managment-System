import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { 
  Phone, 
  MapPin, 
  Home, 
  Crosshair, 
  Truck, 
  ShieldCheck, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  User 
} from 'lucide-react';

export const Step2PickupDetails = () => {
  const { 
    pickupDetails, 
    setPickupDetails, 
    setCurrentStep 
  } = useBooking();

  const [showLandmark, setShowLandmark] = useState(Boolean(pickupDetails.landmark));
  const [phoneError, setPhoneError] = useState('');

  // Validate Indian mobile: exactly 10 digits, starts with 6-9
  const validatePhone = (digits) => {
    if (!digits) return 'Mobile number is required.';
    if (!/^[6-9]/.test(digits)) return 'Number must start with 6, 7, 8, or 9.';
    if (digits.length < 10) return `Enter ${10 - digits.length} more digit${10 - digits.length > 1 ? 's' : ''}.`;
    return '';
  };

  // Strip +91 prefix and non-digits, keep max 10 digits
  const handleMobileChange = (e) => {
    let raw = e.target.value;
    // Remove leading +91 or 91 if user typed them
    raw = raw.replace(/^\+?91/, '');
    // Keep only digits, max 10
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    setPickupDetails({ ...pickupDetails, mobile: digits });
    setPhoneError(validatePhone(digits));
  };

  const handleMobileBlur = () => {
    const digits = (pickupDetails.mobile || '').replace(/\D/g, '');
    setPhoneError(validatePhone(digits));
  };

  const phoneDigits = (pickupDetails.mobile || '').replace(/\D/g, '');
  const isPhoneValid = phoneDigits.length === 10 && /^[6-9]/.test(phoneDigits);
  const canProceed = isPhoneValid && !!pickupDetails.address;

  const handleToggleDeliveryAddress = () => {
    setPickupDetails(prev => ({
      ...prev,
      sameAddressDelivery: !prev.sameAddressDelivery
    }));
  };

  const handleUseCurrentLocation = () => {
    setPickupDetails(prev => ({
      ...prev,
      address: 'Banaswadi, Bengaluru - 560043'
    }));
  };

  return (
    <div className="step2-container animate-fade-in">
      <div className="booking-layout-grid">
        {/* Left: Single Parent Card enclosing Header, Fields, and Pagination */}
        <div className="pickup-parent-card">
          <div className="step-header">
            <span className="step-count">02 / 04</span>
            <h2 className="step-title">Pickup details</h2>
            <p className="step-subtitle">Tell us where to pick up your laundry</p>
          </div>

          <div className="form-fields-container">
            {/* Full Name Field (Desktop only) */}
            <div className="form-group desktop-only-field">
              <label className="form-label">Full Name</label>
              <div className="input-with-icon">
                <span className="input-icon left-icon">
                  <User size={18} strokeWidth={1.8} />
                </span>
                <input
                  type="text"
                  maxLength={20}
                  className="form-input"
                  value={pickupDetails.name || ''}
                  onChange={(e) => setPickupDetails(prev => ({ ...prev, name: e.target.value.slice(0, 20) }))}
                  placeholder="Enter full name (max 20 characters)"
                />
              </div>
              <p className="input-helper-text">Name for order contact and delivery (max 20 characters)</p>
            </div>

            {/* Mobile Number Field */}
            <div className="form-group mt-3">
              <label className="form-label">Mobile Number</label>
              <div className="phone-input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                {/* Phone icon */}
                <span className="input-icon left-icon" style={{ left: '14px', zIndex: 2 }}>
                  <Phone size={18} strokeWidth={1.8} />
                </span>
                {/* +91 prefix badge */}
                <span className="phone-prefix-badge">+91</span>
                <input
                  id="mobile-input"
                  type="tel"
                  inputMode="numeric"
                  className={`form-input phone-input${phoneError ? ' input-error' : ''}`}
                  value={phoneDigits}
                  onChange={handleMobileChange}
                  onBlur={handleMobileBlur}
                  placeholder="98765 43210"
                  maxLength={10}
                  autoComplete="tel-national"
                />
              </div>
              {phoneError
                ? <p className="input-error-text">⚠ {phoneError}</p>
                : <p className="input-helper-text">We'll use this to share pickup updates</p>
              }
            </div>

            {/* Pickup Address Field */}
            <div className="form-group mt-3">
              <label className="form-label">Pickup Address</label>
              <div className="input-with-icon">
                <span className="input-icon left-icon">
                  <MapPin size={18} strokeWidth={1.8} />
                </span>
                <input
                  type="text"
                  className="form-input with-right-action"
                  value={pickupDetails.address || ''}
                  onChange={(e) => setPickupDetails(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Banaswadi, Bengaluru – 560043"
                />
                <button
                  type="button"
                  className="gps-target-btn"
                  onClick={handleUseCurrentLocation}
                  title="Use Current Location (GPS)"
                  aria-label="Use Current Location"
                >
                  <Crosshair size={18} strokeWidth={1.8} />
                </button>
              </div>

              {/* Landmark toggle link */}
              <div className="landmark-toggle-row">
                <button
                  type="button"
                  className="add-landmark-link"
                  onClick={() => setShowLandmark(prev => !prev)}
                >
                  {showLandmark ? 'Close landmark field' : 'Add landmark (optional)'}
                </button>
              </div>

              {showLandmark && (
                <div className="landmark-field-box animate-fade-in">
                  <div className="input-with-icon">
                    <span className="input-icon left-icon">
                      <Home size={18} strokeWidth={1.8} />
                    </span>
                    <input
                      type="text"
                      className="form-input"
                      value={pickupDetails.landmark || ''}
                      onChange={(e) => setPickupDetails({ ...pickupDetails, landmark: e.target.value })}
                      placeholder="House #12, 3rd Cross, HRBR Layout"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Same address for delivery box */}
            <div className="same-address-card">
              <div className="same-address-info">
                <div className="home-icon-box">
                  <Home size={18} strokeWidth={1.8} />
                </div>
                <div>
                  <h4 className="same-address-title">Same address for delivery</h4>
                  <p className="same-address-sub">We'll deliver back to this address after cleaning.</p>
                </div>
              </div>

              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={pickupDetails.sameAddressDelivery}
                  onChange={handleToggleDeliveryAddress}
                />
                <span className="toggle-slider round"></span>
              </label>
            </div>
          </div>

          {/* Desktop Carousel / Pagination Row inside parent card */}
          <div className="card-pagination-row desktop-only-pagination">
            <button
              className="pagination-circle-btn"
              onClick={() => setCurrentStep(1)}
              aria-label="Previous step"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="pagination-dots">
              <span className="dot" onClick={() => setCurrentStep(1)}></span>
              <span className="dot active"></span>
              <span className="dot" onClick={() => setCurrentStep(3)}></span>
              <span className="dot" onClick={() => setCurrentStep(4)}></span>
            </div>

            <button
              className="pagination-circle-btn"
              onClick={() => setCurrentStep(3)}
              aria-label="Next step"
              disabled={!canProceed}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Mobile Step 2 Bottom Navigation */}
          <div className="mobile-step2-bottom-bar mobile-only-bar">
            <div className="card-pagination-row">
              <button
                className="pagination-circle-btn"
                onClick={() => setCurrentStep(1)}
                aria-label="Previous step"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="pagination-dots">
                <span className="dot" onClick={() => setCurrentStep(1)}></span>
                <span className="dot active"></span>
                <span className="dot" onClick={() => canProceed && setCurrentStep(3)}></span>
                <span className="dot" onClick={() => canProceed && setCurrentStep(4)}></span>
              </div>

              <button
                className="pagination-circle-btn"
                onClick={() => canProceed && setCurrentStep(3)}
                aria-label="Next step"
                disabled={!canProceed}
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <button
              type="button"
              className="mobile-full-next-btn"
              onClick={() => canProceed && setCurrentStep(3)}
              disabled={!canProceed}
            >
              <span>Next</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Right: Map Graphic & Trust Assurance Card */}
        <div className="trust-side-card">
          {/* Hero Illustrated Map Box */}
          <div className="trust-hero-box">
            <div className="folded-map-illustration">
              <img 
                src="/assets/folded-map.png" 
                alt="Pickup Location Map" 
                className="folded-map-img" 
              />
            </div>
            <div className="map-floating-badge">
              <span className="live-pulse-dot" />
              <span>Doorstep Pickup & Delivery</span>
            </div>
          </div>

          <div className="trust-card-body">
            <div className="trust-title-row">
              <h3 className="trust-card-title">Don't worry!</h3>
              <span className="trust-verified-pill">
                <ShieldCheck size={13} strokeWidth={2.4} />
                <span>100% Care</span>
              </span>
            </div>
            <p className="trust-card-subtitle">
              Your garments are safe, barcoded & hygienically cleaned.
            </p>

            <div className="trust-features-list">
              <div className="trust-feature-item">
                <div className="trust-icon-box">
                  <Truck size={17} strokeWidth={2} />
                </div>
                <div className="trust-feature-text">
                  <span className="trust-feature-heading">Free Doorstep Pickup</span>
                  <span className="trust-feature-sub">Dedicated executive reaches your address on time</span>
                </div>
              </div>

              <div className="trust-feature-item">
                <div className="trust-icon-box">
                  <ShieldCheck size={17} strokeWidth={2} />
                </div>
                <div className="trust-feature-text">
                  <span className="trust-feature-heading">Safe & Tagged Handling</span>
                  <span className="trust-feature-sub">Individual wash bags & fabric-safe detergents</span>
                </div>
              </div>

              <div className="trust-feature-item">
                <div className="trust-icon-box">
                  <Clock size={17} strokeWidth={2} />
                </div>
                <div className="trust-feature-text">
                  <span className="trust-feature-heading">Real-Time Live Updates</span>
                  <span className="trust-feature-sub">Instant SMS & tracking from pickup to delivery</span>
                </div>
              </div>
            </div>

            {/* Delivery Partner Illustration Banner */}
            <div className="delivery-partner-badge-card">
              <div className="partner-badge-left">
                <span className="partner-badge-tag">Verified Partner</span>
                <span className="partner-badge-title">FabriCare Express Fleet</span>
                <span className="partner-badge-sub">Contactless doorstep collection available</span>
              </div>
              <div className="partner-badge-graphic">
                <img 
                  src="/images/delivery-rider.png" 
                  alt="Delivery Rider" 
                  className="partner-rider-img" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Step Navigation Action */}
      <div className="step-footer-actions">
        <button
          className="btn-next-action"
          onClick={() => setCurrentStep(3)}
          disabled={!canProceed}
        >
          <span>Next</span>
          <ArrowRight size={17} />
        </button>
      </div>

      <style>{`
        .step2-container {
          width: 100%;
        }

        .booking-layout-grid {
          display: grid;
          grid-template-columns: 1.8fr 1fr;
          gap: 24px;
          align-items: start;
        }

        /* Left Single Parent Card */
        .pickup-parent-card {
          background: #ffffff;
          border: 1.5px solid #E2E8F0;
          border-radius: 20px;
          padding: 28px 24px 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .step-header {
          margin-bottom: 20px;
        }

        .step-count {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #64748B;
          letter-spacing: 0.04em;
        }

        .step-title {
          font-size: 1.625rem;
          font-weight: 800;
          color: #0F172A;
          margin: 6px 0 2px 0;
          letter-spacing: -0.02em;
        }

        .step-subtitle {
          font-size: 0.875rem;
          color: #64748B;
        }

        .form-fields-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 0.875rem;
          font-weight: 700;
          color: #0F172A;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .input-icon.left-icon {
          position: absolute;
          left: 14px;
          color: #0D7A75;
          display: flex;
          pointer-events: none;
          z-index: 1;
        }

        .form-input {
          width: 100%;
          padding: 12px 14px 12px 42px;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          font-size: 0.9375rem;
          color: #0F172A;
          background: #ffffff;
          outline: none;
          transition: all 0.2s;
        }

        .form-input.with-right-action {
          padding-right: 44px;
        }

        .form-input:focus {
          border-color: #0D7A75;
          box-shadow: 0 0 0 3px rgba(13, 122, 117, 0.1);
        }

        /* Phone number field */
        .phone-input {
          padding-left: 96px !important;
          letter-spacing: 0.03em;
        }

        .phone-prefix-badge {
          position: absolute;
          left: 42px;
          font-size: 0.9375rem;
          font-weight: 600;
          color: #0D7A75;
          pointer-events: none;
          user-select: none;
          z-index: 2;
          background: transparent;
          border-right: 1.5px solid #E2E8F0;
          padding-right: 10px;
          line-height: 1;
        }

        .form-input.input-error {
          border-color: #EF4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .input-error-text {
          font-size: 0.775rem;
          color: #EF4444;
          font-weight: 500;
          margin-top: 4px;
        }

        .gps-target-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #0D7A75;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          transition: transform 0.15s;
        }

        .gps-target-btn:hover {
          transform: scale(1.1);
        }

        .input-helper-text {
          font-size: 0.775rem;
          color: #64748B;
          margin-top: 4px;
          min-height: 1.2em;
        }

        .landmark-toggle-row {
          margin-top: 4px;
        }

        .add-landmark-link {
          background: none;
          border: none;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #0D7A75;
          cursor: pointer;
          padding: 2px 0;
          display: inline-block;
        }

        .add-landmark-link:hover {
          text-decoration: underline;
        }

        .landmark-field-box {
          margin-top: 8px;
        }

        /* Same address for delivery box */
        .same-address-card {
          background: #F0FDF9;
          border: 1.5px solid #CCFBF1;
          border-radius: 14px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
        }

        .same-address-info {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .home-icon-box {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #ffffff;
          color: #0D7A75;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 6px rgba(13, 122, 117, 0.08);
        }

        .same-address-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #0F172A;
        }

        .same-address-sub {
          font-size: 0.775rem;
          color: #64748B;
          margin-top: 2px;
        }

        /* Toggle Switch */
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
          flex-shrink: 0;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #CBD5E1;
          transition: 0.3s;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.3s;
        }

        .toggle-switch input:checked + .toggle-slider {
          background-color: #0D7A75;
        }

        .toggle-switch input:checked + .toggle-slider:before {
          transform: translateX(20px);
        }

        .toggle-slider.round {
          border-radius: 34px;
        }

        .toggle-slider.round:before {
          border-radius: 50%;
        }

        /* Pagination Row at bottom of Parent Card */
        .card-pagination-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          margin-top: 28px;
          padding: 4px 0;
        }

        .pagination-dots {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .pagination-dots .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #E2E8F0;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .pagination-dots .dot.active {
          width: 14px;
          height: 6px;
          border-radius: 4px;
          background: #0D7A75;
        }

        .pagination-circle-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #F1F5F9;
          border: none;
          color: #64748B;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s;
        }

        .pagination-circle-btn:hover:not(:disabled) {
          background: #E2E8F0;
        }

        .pagination-circle-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* Right Trust Card */
        .trust-side-card {
          background: #ffffff;
          border: 1.5px solid #E2E8F0;
          border-radius: 20px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 0 4px 20px rgba(13, 122, 117, 0.04);
          position: sticky;
          top: 24px;
          height: fit-content;
          box-sizing: border-box;
          transition: all 0.25s ease;
        }

        /* Hero Illustrated Box */
        .trust-hero-box {
          background: linear-gradient(180deg, #F0FDF9 0%, #E6FAF6 100%);
          border: 1.5px solid #CCFBF1;
          border-radius: 16px;
          padding: 14px 12px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .folded-map-illustration {
          width: 100%;
          max-width: 220px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .folded-map-img {
          width: 100%;
          height: auto;
          max-height: 140px;
          object-fit: contain;
          display: block;
          filter: drop-shadow(0 8px 18px rgba(13, 122, 117, 0.15));
        }

        .map-floating-badge {
          margin-top: 10px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          border: 1px solid #D6EFE9;
          border-radius: 999px;
          padding: 4px 12px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #0D7A75;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
        }

        .live-pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
        }

        /* Trust Card Body */
        .trust-card-body {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 0;
          padding-top: 0;
        }

        .trust-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .trust-card-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
        }

        .trust-verified-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #EEFAF6;
          border: 1px solid #BCEAE6;
          color: #0D7A75;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 999px;
        }

        .trust-card-subtitle {
          font-size: 0.775rem;
          color: #64748B;
          margin: -6px 0 2px 0;
          line-height: 1.4;
        }

        .trust-features-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .trust-feature-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 9px 12px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          transition: all 0.15s ease;
        }

        .trust-feature-item:hover {
          background: #F0FDF9;
          border-color: #BCEAE6;
          transform: translateY(-1px);
        }

        .trust-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #E6F7F5;
          color: #0D7A75;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .trust-feature-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
          min-width: 0;
        }

        .trust-feature-heading {
          font-size: 0.8rem;
          font-weight: 700;
          color: #0F172A;
        }

        .trust-feature-sub {
          font-size: 0.7rem;
          color: #64748B;
          line-height: 1.35;
        }

        /* Delivery Partner Badge Card */
        .delivery-partner-badge-card {
          background: linear-gradient(135deg, #0D7A75 0%, #095955 100%);
          border-radius: 14px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          box-shadow: 0 4px 14px rgba(13, 122, 117, 0.18);
          margin-top: 2px;
          overflow: hidden;
          position: relative;
        }

        .partner-badge-left {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          z-index: 1;
        }

        .partner-badge-tag {
          font-size: 0.625rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #A7F3D0;
        }

        .partner-badge-title {
          font-size: 0.85rem;
          font-weight: 800;
          color: #FFFFFF;
        }

        .partner-badge-sub {
          font-size: 0.7rem;
          color: #CCFBF1;
          opacity: 0.95;
          line-height: 1.3;
        }

        .partner-badge-graphic {
          width: 84px;
          height: 50px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .partner-rider-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 3px 6px rgba(0,0,0,0.25));
        }

        /* Bottom Footer Action */
        .step-footer-actions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-top: 28px;
        }

        .btn-next-action {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #0D7A75;
          color: #ffffff;
          font-weight: 600;
          font-size: 0.9375rem;
          padding: 11px 28px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          transition: background 0.15s, opacity 0.15s;
          box-shadow: 0 4px 12px rgba(13, 122, 117, 0.15);
        }

        .btn-next-action:hover:not(:disabled) {
          background: #095F5B;
        }

        .btn-next-action:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .mobile-only-bar {
          display: none;
        }

        @media (max-width: 960px) {
          .booking-layout-grid {
            grid-template-columns: 1fr;
          }
          .trust-side-card {
            padding: 24px;
          }
        }

        @media (max-width: 768px) {
          .trust-side-card,
          .desktop-only-field,
          .desktop-only-pagination {
            display: none !important;
          }

          .pickup-parent-card {
            background: transparent !important;
            border: none !important;
            padding: 0 !important;
            box-shadow: none !important;
          }

          .step-header {
            margin-bottom: 22px;
            text-align: left;
          }

          .step-count {
            font-size: 0.875rem;
            font-weight: 600;
            color: #8492A6;
            margin-bottom: 6px;
            display: inline-block;
          }

          .step-title {
            font-family: 'Poppins', sans-serif;
            font-size: 1.65rem;
            font-weight: 800;
            color: #12263A;
            margin: 0 0 6px 0;
            letter-spacing: -0.02em;
            line-height: 1.2;
          }

          .step-subtitle {
            font-family: 'Inter', sans-serif;
            font-size: 0.875rem;
            color: #718096;
            margin: 0 0 20px 0;
          }

          .form-label {
            font-family: 'Poppins', sans-serif;
            font-size: 0.95rem;
            font-weight: 700;
            color: #12263A;
            margin-bottom: 8px;
            display: block;
          }

          .form-input {
            height: 48px;
            border-radius: 14px;
            border: 1.5px solid #E2E8F0;
            font-size: 0.95rem;
            color: #12263A;
            font-weight: 500;
            padding-left: 44px;
          }

          .form-input.phone-input {
            padding-left: 78px;
          }

          .phone-prefix-badge {
            position: absolute;
            left: 42px;
            font-weight: 600;
            color: #12263A;
            font-size: 0.95rem;
            z-index: 2;
          }

          .input-helper-text {
            font-size: 0.78rem;
            color: #718096;
            margin-top: 6px;
          }

          .add-landmark-link {
            color: #087F8C;
            font-size: 0.875rem;
            font-weight: 600;
            background: none;
            border: none;
            padding: 8px 0;
            cursor: pointer;
            margin-top: 4px;
            display: inline-block;
          }

          .same-address-card {
            background: #EAF8F7;
            border: 1.5px solid #D4F0EE;
            border-radius: 18px;
            padding: 16px 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 20px;
          }

          .home-icon-box {
            background: #FFFFFF;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #087F8C;
            flex-shrink: 0;
            box-shadow: 0 2px 8px rgba(8, 127, 140, 0.08);
          }

          .same-address-title {
            font-family: 'Poppins', sans-serif;
            font-size: 0.95rem;
            font-weight: 700;
            color: #12263A;
            margin: 0 0 3px 0;
          }

          .same-address-sub {
            font-family: 'Inter', sans-serif;
            font-size: 0.75rem;
            color: #556980;
            margin: 0;
            line-height: 1.35;
          }

          .toggle-switch {
            position: relative;
            display: inline-block;
            width: 48px;
            height: 26px;
            flex-shrink: 0;
          }

          .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #CBD5E1;
            transition: 0.3s;
            border-radius: 34px;
          }

          .toggle-slider:before {
            position: absolute;
            content: "";
            height: 20px;
            width: 20px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: 0.3s;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
          }

          input:checked + .toggle-slider {
            background-color: #087F8C;
          }

          input:checked + .toggle-slider:before {
            transform: translateX(22px);
          }

          .mobile-step2-bottom-bar.mobile-only-bar {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 18px !important;
            margin-top: 24px !important;
            width: 100% !important;
          }

          .mobile-step2-bottom-bar .card-pagination-row {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 16px !important;
            width: 100% !important;
          }

          .mobile-step2-bottom-bar .pagination-dots {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
          }

          .mobile-step2-bottom-bar .dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #CBD5E1;
            transition: all 0.2s;
            cursor: pointer;
          }

          .mobile-step2-bottom-bar .dot.active {
            background: #087F8C;
            width: 9px;
            height: 9px;
          }

          .mobile-full-next-btn {
            width: 100% !important;
            height: 48px !important;
            background: #087F8C !important;
            color: #FFFFFF !important;
            border-radius: 999px !important;
            font-size: 1rem !important;
            font-weight: 700 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 8px !important;
            border: none !important;
            box-shadow: 0 4px 14px rgba(8, 127, 140, 0.25) !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
          }

          .mobile-full-next-btn:disabled {
            opacity: 0.5 !important;
            cursor: not-allowed !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};
