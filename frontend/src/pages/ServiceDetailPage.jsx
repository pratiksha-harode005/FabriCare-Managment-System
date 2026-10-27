import React from 'react';
import { useBooking } from '../context/BookingContext';
import { FAQAccordion } from '../components/common/FAQAccordion';
import { 
  Sparkles, 
  ShieldCheck, 
  Tag, 
  Truck, 
  Droplets, 
  Sun, 
  HeartHandshake, 
  Coins, 
  ArrowRight,
  CheckCircle,
  FileSearch,
  Wand2,
  Wind,
  Shirt,
  PackageCheck
} from 'lucide-react';

export const ServiceDetailPage = () => {
  const { startBooking, navigateTo, setCurrentStep } = useBooking();

  const handleBookNow = () => {
    if (typeof setCurrentStep === 'function') {
      setCurrentStep(1);
    }
    if (typeof navigateTo === 'function') {
      navigateTo('booking');
    } else if (typeof startBooking === 'function') {
      startBooking(1);
    }
  };

  const processSteps = [
    { num: '01', title: 'Tagging & Sorting', desc: 'Individual barcode tag assigned to trace every item.', icon: <Tag size={20} /> },
    { num: '02', title: 'Inspection', desc: 'Detailed check for fabric type, stains, and buttons.', icon: <FileSearch size={20} /> },
    { num: '03', title: 'Stain Treatment', desc: 'Targeted pre-spotting with specialized enzymes.', icon: <Wand2 size={20} /> },
    { num: '04', title: 'Eco-Friendly Cleaning', desc: 'Closed-loop hydrocarbon wash gentle on threads.', icon: <Droplets size={20} /> },
    { num: '05', title: 'Finishing', desc: 'Steam form pressing to restore original shape.', icon: <Wind size={20} /> },
    { num: '06', title: 'Quality Check', desc: 'Final inspection under multi-spectrum lighting.', icon: <CheckCircle size={20} /> },
    { num: '07', title: 'Packaging', desc: 'Breathable dust covers on wooden hangers.', icon: <PackageCheck size={20} /> }
  ];

  const promises = [
    {
      icon: <Coins size={26} />,
      title: 'Affordable Price',
      desc: 'Top-tier luxury garment care with transparent pricing and no hidden costs.'
    },
    {
      icon: <HeartHandshake size={26} />,
      title: 'Skin Friendly',
      desc: '100% hypoallergenic, non-toxic detergents safe for sensitive skin and babies.'
    },
    {
      icon: <Sun size={26} />,
      title: 'UV Safe Air Drying',
      desc: 'Temperature-regulated drying technology that prevents fabric shrinking and fading.'
    },
    {
      icon: <Droplets size={26} />,
      title: 'Less & Fresh Water',
      desc: 'Sustainable water filtration cycles that save up to 45% water per batch.'
    }
  ];

  return (
    <div className="service-detail-page">
      {/* 1. HERO BANNER */}
      <section className="service-hero-banner">
        <div className="service-hero-overlay" />
        <div className="container service-hero-content">
          <span className="service-hero-badge">OUR SPECIALTY SERVICE</span>
          <h1 className="service-hero-title">Dry Cleaning</h1>
          <p className="service-hero-subtitle">
            Eco-Friendly · Expert Stain Removal · Luxury Fabric Care
          </p>
        </div>
      </section>

      {/* 2. CARE THAT GOES BEYOND CLEANING */}
      <section className="beyond-cleaning-section">
        <div className="container">
          <div className="beyond-grid">
            <div className="beyond-image-col">
              <div className="beyond-image-frame">
                <img 
                  src="/assets/garment-specialist.jpg" 
                  alt="Garment Care Specialist Inspecting Suits" 
                  className="beyond-img"
                />
              </div>
            </div>

            <div className="beyond-content-col">
              <span className="section-tag pill">DRY CLEANING</span>
              <h2 className="section-title">
                Care That Goes <br />
                <span className="highlight">Beyond Cleaning</span>
              </h2>

              <p className="beyond-desc">
                Our dry cleaning service is designed to care for your delicate and premium garments. Using advanced, fabric-friendly methods, we remove stains, refresh the fabric and maintain the original look and feel of your clothes.
              </p>

              {/* 4 Feature Badges in 2x2 Grid */}
              <div className="beyond-badges-grid">
                <div className="beyond-badge-card">
                  <div className="beyond-badge-icon"><Shirt size={20} /></div>
                  <span className="beyond-badge-text">Safe for Delicate Fabrics</span>
                </div>

                <div className="beyond-badge-card">
                  <div className="beyond-badge-icon"><Wand2 size={20} /></div>
                  <span className="beyond-badge-text">Advanced Stain Treatment</span>
                </div>

                <div className="beyond-badge-card">
                  <div className="beyond-badge-icon"><Tag size={20} /></div>
                  <span className="beyond-badge-text">Transparent Pricing</span>
                </div>

                <div className="beyond-badge-card">
                  <div className="beyond-badge-icon"><Truck size={20} /></div>
                  <span className="beyond-badge-text">Doorstep Pickup & Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR DRY CLEANING PROCESS (7 STEPS TIMELINE) */}
      <section className="process-timeline-section">
        <div className="container">
          <div className="text-center process-timeline-head">
            <span className="section-tag pill">DRY CLEANING</span>
            <h2 className="section-title">
              Our <span className="highlight">Dry Cleaning Process</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Every garment goes through a careful step-by-step process to ensure the best care.
            </p>
          </div>

          <div className="timeline-horizontal-scroll">
            <div className="timeline-steps-track">
              {processSteps.map((step, idx) => (
                <div key={step.num} className="timeline-step-node">
                  <div className="node-num-pill">{step.num}</div>
                  <div className="node-icon-circle">
                    {step.icon}
                  </div>
                  <h4 className="node-title">{step.title}</h4>
                  <p className="node-desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR PROMISE TO YOU */}
      <section className="promises-section">
        <div className="container">
          <div className="text-center promises-head">
            <span className="section-tag pill">OUR COMMITMENT</span>
            <h2 className="section-title">
              OUR <span className="highlight">PROMISE</span> TO YOU
            </h2>
          </div>

          <div className="promises-cards-grid">
            {promises.map((p, index) => (
              <div key={index} className="promise-card">
                <div className="promise-icon-circle">
                  {p.icon}
                </div>
                <h3 className="promise-card-title">{p.title}</h3>
                <p className="promise-card-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA BANNER (KEEPING CLOTHES GOOD AS NEW) */}
      <section className="trust-cta-banner-section" aria-label="Book laundry service">
        <div className="container">
          <div className="trust-cta-banner">
            <div className="trust-cta-left">
              <h2 className="trust-cta-title">
                Trust us for keeping your clothes <br />
                <span className="cta-highlight">as good as new</span>
              </h2>
            </div>

            <div className="trust-cta-action-group">
              <div className="trust-cta-center-img-wrap">
                <picture>
                  <source srcSet="/assets/fresh-laundry-stack.webp" type="image/webp" />
                  <img 
                    src="/assets/fresh-laundry-stack.png" 
                    alt="Neatly folded clothes stack with green leaf" 
                    className="trust-towels-img"
                    loading="lazy"
                  />
                </picture>
              </div>

              <div className="trust-cta-right">
                <button 
                  type="button"
                  className="trust-cta-detail-btn"
                  onClick={handleBookNow}
                  aria-label="Book dry cleaning now"
                >
                  <span>Book Now</span>
                  <ArrowRight size={17} className="btn-arrow-icon" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SERVICE FAQS */}
      <FAQAccordion customTag="DRY CLEANING FAQS" />

      <style>{`
        .service-detail-page {
          width: 100%;
        }

        /* 1. HERO BANNER */
        .service-hero-banner {
          position: relative;
          background: url('/assets/dry-clean-hero.jpg') top center / cover no-repeat;
          background-attachment: scroll;
          padding: 110px 0 90px;
          color: #ffffff;
          overflow: hidden;
        }

        .service-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(13, 122, 117, 0.88) 0%, rgba(14, 75, 86, 0.94) 100%);
        }

        .service-hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
        }

        .service-hero-badge {
          display: inline-block;
          font-size: 0.8125rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #64DFDF;
          background: rgba(255, 255, 255, 0.12);
          padding: 6px 18px;
          border-radius: 999px;
          margin-bottom: 16px;
        }

        .service-hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }

        .service-hero-subtitle {
          font-size: 1.125rem;
          color: #E6F7F5;
          font-weight: 500;
        }

        /* 2. CARE THAT GOES BEYOND CLEANING */
        .beyond-cleaning-section {
          padding: 90px 0;
          background: #ffffff;
        }

        .beyond-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 56px;
          align-items: center;
        }

        .beyond-image-frame {
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
        }

        .beyond-img {
          width: 100%;
          height: 480px;
          object-fit: cover;
        }

        .beyond-desc {
          font-size: 1rem;
          color: #4A5568;
          line-height: 1.7;
          margin-bottom: 32px;
        }

        .beyond-badges-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .beyond-badge-card {
          display: flex;
          align-items: center;
          gap: 14px;
          background: #FAFCFC;
          border: 1.5px solid #E6EEF0;
          border-radius: 14px;
          padding: 16px;
        }

        .beyond-badge-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #EBF8F7;
          color: #0D7A75;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .beyond-badge-text {
          font-size: 0.875rem;
          font-weight: 700;
          color: #1A202C;
        }

        /* 3. PROCESS TIMELINE */
        .process-timeline-section {
          padding: 90px 0;
          background: #F0FDFB;
        }

        .process-timeline-head {
          margin-bottom: 50px;
        }

        .timeline-horizontal-scroll {
          overflow-x: auto;
          padding: 20px 0;
        }

        .timeline-steps-track {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 16px;
          min-width: 900px;
          position: relative;
        }

        .timeline-step-node {
          background: #ffffff;
          border: 1.5px solid #BCEAE6;
          border-radius: 18px;
          padding: 24px 14px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          box-shadow: 0 4px 14px rgba(13, 122, 117, 0.04);
        }

        .node-num-pill {
          font-size: 0.75rem;
          font-weight: 800;
          color: #0D7A75;
          background: #EBF8F7;
          padding: 2px 10px;
          border-radius: 999px;
          margin-bottom: 12px;
        }

        .node-icon-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #E6F7F5;
          color: #0D7A75;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .node-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #1A202C;
          margin-bottom: 6px;
        }

        .node-desc {
          font-size: 0.75rem;
          color: #718096;
          line-height: 1.4;
        }

        /* 4. PROMISES */
        .promises-section {
          padding: 90px 0;
          background: #ffffff;
        }

        .promises-head {
          margin-bottom: 50px;
        }

        .promises-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .promise-card {
          background: #FAFCFC;
          border: 1.5px solid #E6EEF0;
          border-radius: 20px;
          padding: 32px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.25s ease;
        }

        .promise-card:hover {
          transform: translateY(-4px);
          border-color: #BCEAE6;
          box-shadow: 0 10px 24px rgba(13, 122, 117, 0.08);
        }

        .promise-icon-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #EBF8F7;
          color: #0D7A75;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .promise-card-title {
          font-size: 1.125rem;
          font-weight: 800;
          color: #1A202C;
          margin-bottom: 8px;
        }

        .promise-card-desc {
          font-size: 0.8125rem;
          color: #718096;
          line-height: 1.55;
        }

        /* 5. TRUST CTA BANNER (56px Vertical Margin & 16-24px LHS/RHS Edge Gap) */
        .trust-cta-banner-section {
          padding: 56px 0;
          margin: 0;
          background: transparent;
          width: 100%;
          box-sizing: border-box;
        }

        .trust-cta-banner-section .container {
          width: 100% !important;
          max-width: 100% !important;
          padding: 0 24px !important;
          margin: 0 auto !important;
          box-sizing: border-box !important;
        }

        .trust-cta-banner {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 auto !important;
          box-sizing: border-box !important;
          background: #E8F8F9;
          background: linear-gradient(90deg, #EAF8F9 0%, #DDF4F5 50%, #EAF8F9 100%);
          border: 1px solid rgba(8, 127, 140, 0.16);
          border-radius: 24px;
          box-shadow: 0 12px 36px rgba(8, 127, 140, 0.09);
          padding: 38px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          position: relative;
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .trust-cta-banner:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(8, 127, 140, 0.13);
        }

        .trust-cta-left {
          flex: 1 1 0;
          min-width: 260px;
        }

        .trust-cta-title {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(23px, 2.3vw, 32px);
          font-weight: 800;
          color: #0F2935;
          line-height: 1.25;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .cta-highlight {
          display: block;
          color: #0A808D;
          font-weight: 800;
        }

        .trust-cta-action-group {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 28px;
          flex: 0 0 auto;
        }

        .trust-cta-center-img-wrap {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }

        .trust-towels-img {
          height: 140px;
          width: auto;
          max-width: 270px;
          object-fit: contain;
          filter: drop-shadow(0 12px 22px rgba(8, 127, 140, 0.14));
          display: block;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .trust-cta-banner:hover .trust-towels-img {
          transform: scale(1.04) translateY(-2px);
        }

        .trust-cta-right {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
        }

        .trust-cta-detail-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          background: #FF6652;
          background: linear-gradient(135deg, #FF705C 0%, #FF563E 100%);
          color: #FFFFFF;
          font-family: 'Poppins', sans-serif;
          font-size: 15.5px;
          font-weight: 700;
          line-height: 1;
          padding: 15px 30px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 6px 20px rgba(255, 86, 62, 0.35);
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .trust-cta-detail-btn:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, #FF7E6B 0%, #FF492F 100%);
          box-shadow: 0 10px 26px rgba(255, 86, 62, 0.45);
        }

        .trust-cta-detail-btn:active {
          transform: translateY(0) scale(0.98);
          box-shadow: 0 4px 12px rgba(255, 86, 62, 0.3);
        }

        .btn-arrow-icon {
          transition: transform 0.2s ease;
        }

        .trust-cta-detail-btn:hover .btn-arrow-icon {
          transform: translateX(4px);
        }

        @media (max-width: 1024px) {
          .trust-cta-banner-section .container {
            padding: 0 20px !important;
          }
          .trust-cta-banner {
            padding: 30px 36px !important;
            gap: 24px !important;
          }
          .trust-cta-title {
            font-size: 24px !important;
          }
          .trust-towels-img {
            height: 120px !important;
            max-width: 220px !important;
          }
          .trust-cta-detail-btn {
            padding: 13px 24px !important;
            font-size: 14.5px !important;
          }
        }

        @media (max-width: 992px) {
          .beyond-grid {
            grid-template-columns: 1fr;
          }
          .promises-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .service-hero-banner {
            background-attachment: scroll;
            padding: 70px 0 50px;
          }
          .beyond-cleaning-section,
          .process-timeline-section,
          .promises-section {
            padding: 56px 0;
          }
          .trust-cta-banner-section {
            margin: 32px 0 !important;
            padding: 0 !important;
          }
          .trust-cta-banner-section .container {
            padding: 0 16px !important;
          }
          .trust-cta-banner {
            flex-direction: column !important;
            text-align: center !important;
            padding: 30px 22px !important;
            border-radius: 18px !important;
            gap: 20px !important;
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 auto !important;
          }
          .trust-cta-left {
            flex: none !important;
            max-width: 100% !important;
            width: 100% !important;
            min-width: unset !important;
          }
          .trust-cta-title {
            font-size: 21px !important;
          }
          .trust-cta-action-group {
            flex-direction: column !important;
            width: 100% !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 16px !important;
          }
          .trust-cta-center-img-wrap {
            flex: none !important;
            width: 100% !important;
            padding: 0 !important;
          }
          .trust-towels-img {
            height: 110px !important;
            max-width: 220px !important;
            margin: 4px 0 !important;
          }
          .trust-cta-right {
            flex: none !important;
            width: 100% !important;
            justify-content: center !important;
          }
          .trust-cta-detail-btn {
            width: 100% !important;
            max-width: 280px !important;
            padding: 14px 24px !important;
            font-size: 15px !important;
          }
        }

        @media (max-width: 640px) {
          .promises-cards-grid,
          .beyond-badges-grid {
            grid-template-columns: 1fr;
          }
          .service-hero-title {
            font-size: 2.2rem;
          }
          .service-hero-subtitle {
            font-size: 0.95rem;
          }
          .trust-cta-title {
            font-size: 1.5rem;
          }
          .trust-towels-img {
            max-width: 180px;
            height: auto;
          }
        }
      `}</style>
    </div>
  );
};
