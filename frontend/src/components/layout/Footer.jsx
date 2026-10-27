import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useBooking } from '../../context/BookingContext';
import { useAdmin } from '../../context/AdminContext';
import {
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  MapPin,
  Clock,
  Mail,
  ArrowRight,
  X,
  ShieldCheck,
  FileText
} from 'lucide-react';

export const Footer = () => {
  const { navigateTo, startBooking } = useBooking();
  const { settings } = useAdmin();
  const [activeLegalModal, setActiveLegalModal] = useState(null);

  // Lock background scroll and listen for Escape key when legal modal is open
  useEffect(() => {
    if (activeLegalModal) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setActiveLegalModal(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = prevOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [activeLegalModal]);

  const instagramUrl = settings?.instagram || 'https://instagram.com/fabricare';
  const facebookUrl = settings?.facebook || 'https://facebook.com/fabricare';
  const twitterUrl = settings?.twitter || 'https://x.com/fabricare';
  const linkedinUrl = settings?.linkedin || 'https://linkedin.com/company/fabricare';
  const youtubeUrl = settings?.youtube || 'https://youtube.com';
  const supportEmail = settings?.supportEmail || 'support@fabricare.com';

  const handleLinkClick = (pageId, scrollId = null) => {
    if (navigateTo) {
      navigateTo(pageId);
    }
    if (scrollId) {
      setTimeout(() => {
        document.getElementById(scrollId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer-root no-print">
      <div className="footer-inner-container">
        {/* Main 4-Column Section with Vertical Dividers */}
        <div className="footer-main-grid">
          {/* Column 1: Brand & Slogan */}
          <div className="footer-col footer-col-brand">
            <div
              className="footer-logo-title"
              onClick={() => handleLinkClick('home')}
              role="button"
              tabIndex={0}
            >
              <img 
                src="/images/fabricare-logo.png" 
                alt="FabriCare" 
                className="footer-brand-logo-img" 
              />
              <div>
                <span className="logo-teal">Fabri</span>
                <span className="logo-coral">Care</span>
              </div>
            </div>

            <p className="footer-slogan">Fresh clothes, brighter days.</p>
            <p className="footer-desc">
              Reliable laundry and garment care delivered to your door.
            </p>

            <div className="footer-social-row">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-circle"
                aria-label="Instagram"
              >
                <Instagram size={17} strokeWidth={2.2} />
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-circle"
                aria-label="Facebook"
              >
                <Facebook size={17} strokeWidth={2.2} />
              </a>
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-circle"
                aria-label="Twitter / X"
              >
                <span style={{ fontSize: '13px', fontWeight: 800, lineHeight: 1, fontFamily: 'system-ui, -apple-system, sans-serif' }}>𝕏</span>
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-circle"
                aria-label="LinkedIn"
              >
                <Linkedin size={17} strokeWidth={2.2} />
              </a>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-circle"
                aria-label="YouTube"
              >
                <Youtube size={17} strokeWidth={2.2} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col footer-col-links">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-nav-list">
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={() => handleLinkClick('home')}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={() => handleLinkClick('about')}
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={() => handleLinkClick('services')}
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={() => handleLinkClick('how-it-works')}
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={() => handleLinkClick('pricing')}
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={() => handleLinkClick('why-us', 'faq-section')}
                >
                  FAQs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={() => handleLinkClick('home', 'contact-section')}
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Our Services */}
          <div className="footer-col footer-col-services">
            <h4 className="footer-heading">Our Services</h4>
            <ul className="footer-nav-list">
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={() => handleLinkClick('services')}
                >
                  Wash &amp; Fold
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={() => handleLinkClick('services')}
                >
                  Wash &amp; Iron
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={() => handleLinkClick('services')}
                >
                  Dry Cleaning
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={() => handleLinkClick('services')}
                >
                  Steam Ironing
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={() => handleLinkClick('services')}
                >
                  Express Laundry
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Get in Touch */}
          <div className="footer-col footer-col-contact">
            <h4 className="footer-heading">Get in Touch</h4>

            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <div className="contact-icon-bubble">
                  <MapPin size={15} strokeWidth={2.4} />
                </div>
                <span className="contact-item-text">
                  Pickup &amp; delivery available
                </span>
              </div>

              <div className="footer-contact-item">
                <div className="contact-icon-bubble">
                  <Clock size={15} strokeWidth={2.4} />
                </div>
                <span className="contact-item-text">
                  Service hours vary by location
                </span>
              </div>

              <div className="footer-contact-item">
                <div className="contact-icon-bubble">
                  <Mail size={15} strokeWidth={2.4} />
                </div>
                <a
                  href={`mailto:${supportEmail}`}
                  className="contact-item-text contact-mail-link"
                >
                  {supportEmail}
                </a>
              </div>
            </div>

            <button
              type="button"
              className="footer-cta-pill-btn"
              onClick={() => startBooking && startBooking()}
            >
              <span>Book a Pickup</span>
              <ArrowRight size={17} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Bottom Horizontal Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright-text">
            &copy; 2026 FabriCare. All rights reserved.
          </p>

          <div className="footer-legal-links">
            <button
              type="button"
              className="footer-legal-link"
              onClick={() => setActiveLegalModal('privacy')}
            >
              Privacy Policy
            </button>
            <span className="footer-legal-divider">|</span>
            <button
              type="button"
              className="footer-legal-link"
              onClick={() => setActiveLegalModal('terms')}
            >
              Terms &amp; Conditions
            </button>
          </div>
        </div>
      </div>

      {/* Legal Modal (Privacy Policy & Terms) - Rendered into body via createPortal */}
      {activeLegalModal && typeof document !== 'undefined' && createPortal(
        <div 
          className="legal-modal-backdrop" 
          onClick={() => setActiveLegalModal(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
        >
          <div className="legal-modal-card" onClick={e => e.stopPropagation()}>
            <div className="legal-modal-header">
              <div className="legal-modal-header-left">
                <div className="legal-modal-icon-bubble">
                  {activeLegalModal === 'privacy' ? (
                    <ShieldCheck size={22} color="#087F8C" strokeWidth={2.3} />
                  ) : (
                    <FileText size={22} color="#087F8C" strokeWidth={2.3} />
                  )}
                </div>
                <div>
                  <h3 id="legal-modal-title" className="legal-modal-title">
                    {activeLegalModal === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
                  </h3>
                  <p className="legal-modal-subtitle">
                    Last updated: October 2026 • Official Policy
                  </p>
                </div>
              </div>

              <button 
                type="button" 
                className="legal-modal-close"
                onClick={() => setActiveLegalModal(null)}
                aria-label="Close modal"
              >
                <X size={18} strokeWidth={2.4} />
              </button>
            </div>

            <div className="legal-modal-body">
              {activeLegalModal === 'privacy' ? (
                <>
                  <div className="legal-clause-card">
                    <h4>1. Information We Collect</h4>
                    <p>We collect essential personal information including your full name, 10-digit mobile number, email address, and pickup/delivery address when you schedule an order or create an account.</p>
                  </div>
                  <div className="legal-clause-card">
                    <h4>2. How We Use Your Information</h4>
                    <p>Your details are used solely to process your garment care orders, route doorstep pickups and deliveries, provide live tracking updates, and deliver responsive customer support.</p>
                  </div>
                  <div className="legal-clause-card">
                    <h4>3. Data Security &amp; Confidentiality</h4>
                    <p>We enforce stringent industry-standard encryption and strict access protocols to protect your personal information. We never sell, rent, or disclose personal data to third-party marketing companies.</p>
                  </div>
                  <div className="legal-clause-card">
                    <h4>4. Secure Transactions</h4>
                    <p>All payments are securely handled through certified, PCI-DSS compliant payment gateways. Sensitive payment card numbers are never stored on our servers.</p>
                  </div>
                  <div className="legal-clause-card">
                    <h4>5. Customer Rights &amp; Preferences</h4>
                    <p>You can update your personal profile, manage saved pickup addresses, or request data deletion at any time directly through your account or by contacting support.</p>
                  </div>
                  <div className="legal-clause-card">
                    <h4>6. Privacy Contact</h4>
                    <p>For any questions or concerns regarding this privacy policy or your personal data, please contact our team at <a href={`mailto:${supportEmail}`} className="legal-email-link">{supportEmail}</a>.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="legal-clause-card">
                    <h4>1. Service Agreement</h4>
                    <p>Welcome to FabriCare. By scheduling an order, booking a pickup, or using our platform, you agree to these Terms &amp; Conditions governing our doorstep laundry and garment care services.</p>
                  </div>
                  <div className="legal-clause-card">
                    <h4>2. Garment Care &amp; Processing</h4>
                    <p>Every garment is inspected and treated in strict accordance with its fabric care label and selected service category (Wash &amp; Fold, Wash &amp; Iron, Dry Cleaning, or Steam Ironing). Please ensure all pockets are emptied prior to pickup.</p>
                  </div>
                  <div className="legal-clause-card">
                    <h4>3. Scheduled Pickup &amp; Delivery</h4>
                    <p>We provide doorstep pickup and delivery within your chosen time slots. Standard service turnaround is 24 to 48 hours. Live rider tracking updates are sent once assigned.</p>
                  </div>
                  <div className="legal-clause-card">
                    <h4>4. Cancellations &amp; Rescheduling</h4>
                    <p>Pickup appointments may be rescheduled or cancelled free of charge at any time before our delivery rider is dispatched to your address.</p>
                  </div>
                  <div className="legal-clause-card">
                    <h4>5. Garment Protection &amp; Claims</h4>
                    <p>In the rare event of damage or loss, claims must be reported within 48 hours of delivery with order details and photographs. We will promptly investigate and provide fair compensation per our Garment Protection Policy.</p>
                  </div>
                  <div className="legal-clause-card">
                    <h4>6. Support &amp; Inquiries</h4>
                    <p>For any assistance or questions regarding these terms, our customer care team is available at <a href={`mailto:${supportEmail}`} className="legal-email-link">{supportEmail}</a>.</p>
                  </div>
                </>
              )}
            </div>

            <div className="legal-modal-footer">
              <span className="legal-footer-note">
                Need help? <a href={`mailto:${supportEmail}`} className="legal-email-link">{supportEmail}</a>
              </span>
              <button 
                type="button" 
                className="legal-modal-btn"
                onClick={() => setActiveLegalModal(null)}
              >
                I Understand
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        /* ==========================================================================
           FABRICARE FOOTER SECTION STYLES
           Dark navy palette (#071A24) matching exact design with vertical dividers.
           ========================================================================== */
        .footer-root {
          background-color: #071A24;
          color: #8FA4B0;
          font-family: 'Poppins', sans-serif;
          width: 100%;
          margin-top: auto;
          margin-bottom: 0 !important;
          padding-bottom: 0 !important;
          position: relative;
          z-index: 10;
          flex-shrink: 0;
          overflow: hidden;
        }

        .footer-inner-container {
          max-width: 100%;
          width: 100%;
          margin: 0 auto;
          padding: 68px 48px 32px;
          box-sizing: border-box;
        }

        /* 4-Column Grid with Vertical Divider Lines */
        .footer-main-grid {
          display: grid;
          grid-template-columns: 1.35fr 0.95fr 1fr 1.3fr;
          gap: 0;
          align-items: stretch;
        }

        .footer-col {
          padding: 0 36px;
        }

        .footer-col:first-child {
          padding-left: 0;
        }

        .footer-col:last-child {
          padding-right: 0;
        }

        /* Subtle Vertical Dividers between columns */
        .footer-col-brand,
        .footer-col-links,
        .footer-col-services {
          border-right: 1px solid rgba(255, 255, 255, 0.08);
        }

        .footer-logo-title {
          font-family: 'Poppins', sans-serif;
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.6px;
          line-height: 1;
          margin-bottom: 18px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }

        .footer-brand-logo-img {
          width: 38px;
          height: 38px;
          border-radius: 9px;
          object-fit: contain;
          flex-shrink: 0;
        }

        .logo-teal {
          color: #00CED1;
        }

        .logo-coral {
          color: #FF6B54;
        }

        .footer-slogan {
          font-family: 'Poppins', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #FFFFFF;
          margin: 0 0 8px;
          line-height: 1.35;
        }

        .footer-desc {
          font-family: 'Poppins', sans-serif;
          font-size: 13.5px;
          font-weight: 400;
          color: #8FA4B0;
          line-height: 1.55;
          margin: 0 0 24px;
          max-width: 290px;
        }

        .footer-social-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-social-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #0B2936;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          text-decoration: none;
        }

        .footer-social-circle:hover {
          background: #087F8C;
          color: #FFFFFF;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(8, 127, 140, 0.35);
        }

        /* Column Headings */
        .footer-heading {
          font-family: 'Poppins', sans-serif;
          font-size: 16.5px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 4px 0 22px;
          letter-spacing: -0.01em;
        }

        /* Link Lists */
        .footer-nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .footer-nav-link {
          background: none;
          border: none;
          padding: 0;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: #8FA4B0;
          cursor: pointer;
          text-align: left;
          transition: color 0.18s ease, transform 0.18s ease;
          display: inline-block;
        }

        .footer-nav-link:hover {
          color: #00CED1;
          transform: translateX(2px);
        }

        /* Column 4: Contact & CTA */
        .footer-contact-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 26px;
        }

        .footer-contact-item {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .contact-icon-bubble {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #08535E;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .contact-item-text {
          font-family: 'Poppins', sans-serif;
          font-size: 13.5px;
          color: #D1DCE5;
          font-weight: 400;
          line-height: 1.35;
        }

        .contact-mail-link {
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .contact-mail-link:hover {
          color: #00CED1;
        }

        .footer-cta-pill-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background-color: #FF6B54;
          color: #FFFFFF;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 15px;
          padding: 13px 30px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 22px rgba(255, 107, 84, 0.35);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          width: 100%;
          max-width: 250px;
        }

        .footer-cta-pill-btn:hover {
          background-color: #E8553F;
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(255, 107, 84, 0.5);
        }

        .footer-cta-pill-btn:active {
          transform: translateY(0);
        }

        /* Bottom Copyright & Legal Bar */
        .footer-bottom-bar {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          margin-top: 56px;
          padding-top: 24px;
          margin-bottom: 0;
          padding-bottom: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .footer-copyright-text {
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          color: #8FA4B0;
          margin: 0;
        }

        .footer-legal-links {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .footer-legal-link {
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          color: #8FA4B0;
          text-decoration: none;
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .footer-legal-link:hover {
          color: #FFFFFF;
        }

        /* Legal Modal (Professional Portal-rendered design) */
        .legal-modal-backdrop {
          position: fixed !important;
          inset: 0 !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background: rgba(7, 26, 36, 0.72) !important;
          backdrop-filter: blur(8px) !important;
          -webkit-backdrop-filter: blur(8px) !important;
          z-index: 999999 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 24px !important;
          box-sizing: border-box !important;
          animation: legalModalBackdropFade 0.2s ease-out;
        }

        @keyframes legalModalBackdropFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .legal-modal-card {
          background: #FFFFFF !important;
          border-radius: 20px !important;
          max-width: 660px !important;
          width: 100% !important;
          max-height: min(85vh, 720px) !important;
          display: flex !important;
          flex-direction: column !important;
          box-shadow: 0 25px 65px -12px rgba(7, 26, 36, 0.4), 0 0 0 1px rgba(7, 26, 36, 0.08) !important;
          overflow: hidden !important;
          animation: legalModalCardPop 0.24s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        @keyframes legalModalCardPop {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .legal-modal-header {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding: 20px 28px !important;
          border-bottom: 1px solid #E2E8F0 !important;
          background: #FFFFFF !important;
          flex-shrink: 0 !important;
        }

        .legal-modal-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .legal-modal-icon-bubble {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #EBF8F9;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .legal-modal-title {
          font-family: 'Poppins', sans-serif !important;
          font-size: 1.25rem !important;
          font-weight: 700 !important;
          color: #0F2935 !important;
          margin: 0 !important;
          line-height: 1.2 !important;
        }

        .legal-modal-subtitle {
          font-family: 'Poppins', sans-serif !important;
          font-size: 0.775rem !important;
          color: #64748B !important;
          margin: 4px 0 0 0 !important;
          font-weight: 500 !important;
        }

        .legal-modal-close {
          background: #F1F5F9 !important;
          border: none !important;
          width: 36px !important;
          height: 36px !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          color: #64748B !important;
          transition: all 0.18s ease !important;
          flex-shrink: 0 !important;
        }

        .legal-modal-close:hover {
          background: #E2E8F0 !important;
          color: #0F2935 !important;
          transform: rotate(90deg);
        }

        .legal-modal-body {
          padding: 24px 28px !important;
          overflow-y: auto !important;
          overscroll-behavior: contain;
          flex: 1 1 auto;
          scrollbar-width: thin;
          scrollbar-color: #CBD5E1 transparent;
        }

        .legal-modal-body::-webkit-scrollbar {
          width: 6px;
        }

        .legal-modal-body::-webkit-scrollbar-track {
          background: transparent;
        }

        .legal-modal-body::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 10px;
        }

        .legal-modal-body::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
        }

        .legal-clause-card {
          background: #F8FAFC !important;
          border: 1px solid #EAEFF5 !important;
          border-radius: 12px !important;
          padding: 16px 20px !important;
          margin-bottom: 14px !important;
          transition: border-color 0.2s ease, background 0.2s ease;
        }

        .legal-clause-card:hover {
          background: #FFFFFF !important;
          border-color: #BCEAE6 !important;
          box-shadow: 0 4px 14px rgba(8, 127, 140, 0.05);
        }

        .legal-clause-card:last-child {
          margin-bottom: 0 !important;
        }

        .legal-clause-card h4 {
          font-family: 'Poppins', sans-serif !important;
          font-size: 0.95rem !important;
          font-weight: 700 !important;
          color: #0F2935 !important;
          margin: 0 0 6px 0 !important;
        }

        .legal-clause-card p {
          font-family: 'Poppins', sans-serif !important;
          font-size: 0.85rem !important;
          line-height: 1.6 !important;
          color: #475569 !important;
          margin: 0 !important;
        }

        .legal-email-link {
          color: #087F8C !important;
          font-weight: 600 !important;
          text-decoration: underline !important;
        }

        .legal-modal-footer {
          padding: 16px 28px !important;
          border-top: 1px solid #E2E8F0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          background: #F8FAFC !important;
          flex-shrink: 0 !important;
        }

        .legal-footer-note {
          font-size: 0.8rem;
          color: #64748B;
        }

        .legal-modal-btn {
          background: #087F8C !important;
          background: linear-gradient(135deg, #0A8E9D 0%, #087F8C 100%) !important;
          color: #FFFFFF !important;
          border: none !important;
          padding: 10px 24px !important;
          border-radius: 10px !important;
          font-family: 'Poppins', sans-serif !important;
          font-weight: 600 !important;
          font-size: 0.875rem !important;
          cursor: pointer !important;
          box-shadow: 0 4px 12px rgba(8, 127, 140, 0.25) !important;
          transition: all 0.18s ease !important;
        }

        .legal-modal-btn:hover {
          background: linear-gradient(135deg, #0BA0B1 0%, #07727E 100%) !important;
          box-shadow: 0 6px 18px rgba(8, 127, 140, 0.35) !important;
          transform: translateY(-1px);
        }

        .legal-modal-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 640px) {
          .legal-modal-backdrop {
            padding: 16px !important;
          }
          .legal-modal-card {
            border-radius: 16px !important;
            max-height: 90vh !important;
          }
          .legal-modal-header {
            padding: 16px 20px !important;
          }
          .legal-modal-body {
            padding: 18px 20px !important;
          }
          .legal-modal-footer {
            padding: 14px 20px !important;
            flex-direction: column !important;
            gap: 12px !important;
            align-items: stretch !important;
          }
          .legal-footer-note {
            text-align: center;
          }
          .legal-modal-btn {
            width: 100% !important;
          }
        }

        .footer-legal-divider {
          color: rgba(255, 255, 255, 0.2);
          font-size: 12px;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1080px) and (min-width: 769px) {
          .footer-inner-container {
            padding: 60px 32px 32px;
          }
          .footer-main-grid {
            grid-template-columns: 1fr 1fr;
            gap: 40px 24px;
          }
          .footer-col {
            padding: 0 16px;
            border-right: none;
          }
          .footer-col-brand,
          .footer-col-links,
          .footer-col-services {
            border-right: none;
          }
        }

        @media (max-width: 768px) {
          .footer-inner-container {
            padding: 44px 20px calc(24px + env(safe-area-inset-bottom, 0px));
          }
          .footer-main-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 28px 18px;
          }
          .footer-col {
            padding: 0;
            border-right: none;
          }
          .footer-col-brand {
            grid-column: 1 / -1;
            border-right: none;
            padding-bottom: 4px;
          }
          .footer-logo-title {
            font-size: 26px;
            margin-bottom: 12px;
            gap: 10px;
          }
          .footer-brand-logo-img {
            width: 32px;
            height: 32px;
          }
          .footer-slogan {
            font-size: 14.5px;
            margin-bottom: 6px;
          }
          .footer-desc {
            font-size: 13px;
            line-height: 1.5;
            color: #8FA4B0;
            max-width: 100%;
            margin-bottom: 18px;
          }
          .footer-social-row {
            gap: 10px;
          }
          .footer-social-circle {
            width: 36px;
            height: 36px;
            background: #0C2836;
            border: 1px solid rgba(255, 255, 255, 0.08);
          }
          .footer-col-links {
            grid-column: 1 / 2;
            border-right: none;
          }
          .footer-col-services {
            grid-column: 2 / 3;
            border-right: none;
          }
          .footer-heading {
            font-size: 14.5px;
            font-weight: 700;
            color: #FFFFFF;
            margin: 0 0 12px;
            letter-spacing: -0.01em;
          }
          .footer-nav-list {
            gap: 9px;
          }
          .footer-nav-link {
            font-size: 13px;
            padding: 3px 0;
            color: #94A8B5;
          }
          .footer-col-contact {
            grid-column: 1 / -1;
            padding-top: 22px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
          }
          .footer-contact-list {
            gap: 12px;
            margin-bottom: 20px;
          }
          .footer-contact-item {
            gap: 12px;
          }
          .contact-icon-bubble {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: #0A3A45;
            color: #00CED1;
          }
          .contact-item-text {
            font-size: 13px;
            color: #D1DCE5;
          }
          .footer-cta-pill-btn {
            width: 100% !important;
            max-width: 100% !important;
            height: 48px;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: linear-gradient(135deg, #FF6B54 0%, #FF5639 100%);
            box-shadow: 0 6px 20px rgba(255, 107, 84, 0.32);
          }
          .footer-bottom-bar {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 10px;
            margin-top: 28px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
          }
          .footer-copyright-text {
            font-size: 12px;
            color: #768C9A;
          }
          .footer-legal-links {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
          }
          .footer-legal-link {
            font-size: 12px;
            color: #8FA4B0;
          }
          .footer-legal-divider {
            color: rgba(255, 255, 255, 0.25);
            font-size: 11px;
          }
        }

        @media (max-width: 380px) {
          .footer-inner-container {
            padding: 38px 16px calc(20px + env(safe-area-inset-bottom, 0px));
          }
          .footer-main-grid {
            gap: 24px 12px;
          }
          .footer-logo-title {
            font-size: 24px;
          }
          .footer-nav-link {
            font-size: 12.5px;
          }
          .footer-cta-pill-btn {
            height: 46px;
            font-size: 14px;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
