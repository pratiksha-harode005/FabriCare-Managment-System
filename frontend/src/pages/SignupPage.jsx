import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import {
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ChevronDown,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react';

export const SignupPage = () => {
  const { register, loginWithGoogle, authError, clearError, isAuthenticated } = useAuth();
  const { navigateTo } = useBooking();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [infoNotice, setInfoNotice] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Field-level error messages
  const [fieldErrors, setFieldErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });

  // Track if fields have been touched by user
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    phone: false,
    password: false
  });

  // 1. Full Name Validator: Alphabetic only, max 25 chars. No numbers or special characters.
  const validateFullName = (name) => {
    const val = (name || '').trim();
    if (!val) {
      return 'Please enter your full name.';
    }
    if (name.length > 25 || val.length > 25) {
      return 'Full name cannot exceed 25 characters.';
    }
    // Must contain only letters and single spaces between words
    if (!/^[A-Za-z]+(?:\s+[A-Za-z]+)*$/.test(val)) {
      return 'Full name can only contain alphabetic letters (no numbers or special characters).';
    }
    return '';
  };

  // 2. Email Address Validator: Proper email format (e.g. user@gmail.com)
  const validateEmail = (val) => {
    const trimmed = (val || '').trim();
    if (!trimmed) {
      return 'Please enter your email address.';
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) {
      return 'Please enter a valid email address (e.g., user@gmail.com).';
    }
    return '';
  };

  // 3. Mobile Number Validator: 10 digits starting with 6, 7, 8, or 9
  const validatePhone = (val) => {
    const digits = (val || '').replace(/\D/g, '');
    if (!digits) {
      return 'Please enter your mobile number.';
    }
    if (!/^[6-9]/.test(digits)) {
      return 'Mobile number must start with 6, 7, 8, or 9.';
    }
    if (digits.length !== 10) {
      return 'Mobile number must be exactly 10 digits.';
    }
    return '';
  };

  // 4. Password Validator: Min 6, Max 12 characters
  const validatePassword = (val) => {
    if (!val) {
      return 'Please create a password.';
    }
    if (val.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    if (val.length > 12) {
      return 'Password cannot exceed 12 characters.';
    }
    return '';
  };

  // If already authenticated as customer, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      sessionStorage.removeItem('fabricare_intended_destination');
      navigateTo('home');
    }
  }, [isAuthenticated, navigateTo]);

  // Input Handlers enforcing input-level restrictions
  const handleFullNameChange = (e) => {
    // Only allow alphabetic characters and spaces, max 25 characters
    const filtered = e.target.value.replace(/[^A-Za-z\s]/g, '').slice(0, 25);
    setFullName(filtered);
    if (touched.fullName) {
      setFieldErrors(prev => ({ ...prev, fullName: validateFullName(filtered) }));
    }
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (touched.email) {
      setFieldErrors(prev => ({ ...prev, email: validateEmail(val) }));
    }
  };

  const handlePhoneChange = (e) => {
    // Only allow numeric digits
    let digits = e.target.value.replace(/\D/g, '');

    // Mobile number must start with 6, 7, 8, or 9 (do not allow 0, 1, 2, 3, 4, 5)
    if (digits.length > 0 && !/^[6-9]/.test(digits)) {
      setTouched(prev => ({ ...prev, phone: true }));
      setFieldErrors(prev => ({ ...prev, phone: 'Mobile number must start with 6, 7, 8, or 9.' }));
      return;
    }

    digits = digits.slice(0, 10);
    setPhone(digits);
    if (touched.phone) {
      setFieldErrors(prev => ({ ...prev, phone: validatePhone(digits) }));
    }
  };

  const handlePasswordChange = (e) => {
    // Max limit 12 characters
    const val = e.target.value.slice(0, 12);
    setPassword(val);
    if (touched.password) {
      setFieldErrors(prev => ({ ...prev, password: validatePassword(val) }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    let err = '';
    if (field === 'fullName') err = validateFullName(fullName);
    if (field === 'email') err = validateEmail(email);
    if (field === 'phone') err = validatePhone(phone);
    if (field === 'password') err = validatePassword(password);
    setFieldErrors(prev => ({ ...prev, [field]: err }));
  };

  // Overall form validity check
  const isFullNameValid = validateFullName(fullName) === '';
  const isEmailValid = validateEmail(email) === '';
  const isPhoneValid = validatePhone(phone) === '';
  const isPasswordValid = validatePassword(password) === '';
  const isFormValid = isFullNameValid && isEmailValid && isPhoneValid && isPasswordValid;

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    clearError();

    // Mark all as touched to show errors if attempted to submit
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      password: true
    });

    const nameErr = validateFullName(fullName);
    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone);
    const passErr = validatePassword(password);

    setFieldErrors({
      fullName: nameErr,
      email: emailErr,
      phone: phoneErr,
      password: passErr
    });

    if (nameErr || emailErr || phoneErr || passErr) {
      setErrorMessage(nameErr || emailErr || phoneErr || passErr);
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const fullPhoneNumber = `${countryCode} ${cleanPhone}`;
      await register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: fullPhoneNumber
      });

      setSuccessMessage('Account created successfully! Redirecting...');
      setTimeout(() => {
        sessionStorage.removeItem('fabricare_intended_destination');
        navigateTo('home');
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check your information and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setErrorMessage(null);
    setInfoNotice(null);
    clearError();
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      sessionStorage.removeItem('fabricare_intended_destination');
      navigateTo('home');
    } catch (err) {
      setErrorMessage(err.message || 'Google sign-up could not be completed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppleSignUp = () => {
    setErrorMessage(null);
    clearError();
    setInfoNotice('Apple Sign-Up will be available soon. Please register using Google or your email address.');
  };

  const handleFacebookSignUp = () => {
    setErrorMessage(null);
    clearError();
    setInfoNotice('Facebook Sign-Up will be available soon. Please register using Google or your email address.');
  };

  return (
    <div className="auth-page-root">
      <div className="auth-split-layout signup-layout">
        {/* LEFT COLUMN: Visual Artwork matching Reference Image 1 */}
        <div 
          className="auth-artwork-panel left-side" 
          onClick={() => navigateTo('home')}
          title="Return to FabriCare Home"
        >
          <img 
            src="/assets/signup-artwork.png" 
            alt="FabriCare Premium Laundry" 
            className="auth-artwork-image"
            loading="eager"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/signup-visual-exact.png';
            }}
          />
        </div>

        {/* RIGHT COLUMN: Form Panel matching Reference Image 1 */}
        <div className="auth-form-panel">
          <div className="auth-form-container">
            <h1 className="auth-headline">Create Account</h1>

            {/* Social Buttons Row (Google, Apple, Facebook) */}
            <div className="auth-social-row">
              {/* Google */}
              <button
                type="button"
                className="auth-social-button"
                onClick={handleGoogleSignUp}
                disabled={isSubmitting}
                title="Sign up with Google"
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </button>

              {/* Apple */}
              <button
                type="button"
                className="auth-social-button"
                onClick={handleAppleSignUp}
                disabled={isSubmitting}
                title="Sign up with Apple"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="#000000">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.66-.99 1.73-.86 2.76 1.01.08 2.03-.51 2.56-1.26z"/>
                </svg>
              </button>

              {/* Facebook */}
              <button
                type="button"
                className="auth-social-button"
                onClick={handleFacebookSignUp}
                disabled={isSubmitting}
                title="Sign up with Facebook"
              >
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <circle cx="12" cy="12" r="12" fill="#1877F2"/>
                  <path fill="#FFFFFF" d="M14.5 12h-2v7h-3v-7h-1.5v-2.5h1.5v-1.7c0-2 1.2-3.3 3.2-3.3.96 0 1.8.07 1.8.07v2.2h-1c-1 0-1.5.6-1.5 1.3v1.43h2.5l-.5 2.5z"/>
                </svg>
              </button>
            </div>

            {/* OR Divider */}
            <div className="auth-separator">
              <span className="sep-line"></span>
              <span className="sep-label">OR</span>
              <span className="sep-line"></span>
            </div>

            {/* Info Notice Banner */}
            {infoNotice && !errorMessage && !authError && (
              <div className="auth-alert-message info" role="status">
                <Info size={15} />
                <span>{infoNotice}</span>
              </div>
            )}

            {/* Error or Success Notice */}
            {(errorMessage || authError) && (
              <div className="auth-alert-message error" role="alert">
                <AlertCircle size={15} />
                <span>{errorMessage || authError}</span>
              </div>
            )}
            {successMessage && (
              <div className="auth-alert-message success" role="alert">
                <CheckCircle2 size={15} />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Main Sign Up Form */}
            <form onSubmit={handleRegister} className="auth-form-body" noValidate>
              {/* Field 1: Full Name */}
              <div className="auth-field-row">
                <div className="auth-label-row">
                  <label className="auth-label">Full Name</label>
                  <span className="auth-char-count">{fullName.length}/25</span>
                </div>
                <div className={`auth-input-wrapper ${touched.fullName && fieldErrors.fullName ? 'has-error' : ''}`}>
                  <User size={16} className="auth-field-icon" />
                  <input
                    type="text"
                    required
                    maxLength={25}
                    className="auth-input-control"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={handleFullNameChange}
                    onBlur={() => handleBlur('fullName')}
                    disabled={isSubmitting}
                    autoComplete="name"
                  />
                </div>
                {touched.fullName && fieldErrors.fullName && (
                  <div className="auth-field-error-message" role="alert">
                    <AlertCircle size={13} />
                    <span>{fieldErrors.fullName}</span>
                  </div>
                )}
              </div>

              {/* Field 2: Email Address */}
              <div className="auth-field-row">
                <label className="auth-label">Email Address</label>
                <div className={`auth-input-wrapper ${touched.email && fieldErrors.email ? 'has-error' : ''}`}>
                  <Mail size={16} className="auth-field-icon" />
                  <input
                    type="email"
                    required
                    className="auth-input-control"
                    placeholder="e.g. user@gmail.com"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={() => handleBlur('email')}
                    disabled={isSubmitting}
                    autoComplete="email"
                  />
                </div>
                {touched.email && fieldErrors.email && (
                  <div className="auth-field-error-message" role="alert">
                    <AlertCircle size={13} />
                    <span>{fieldErrors.email}</span>
                  </div>
                )}
              </div>

              {/* Field 3: Mobile Number with Flag / Code */}
              <div className="auth-field-row">
                <div className="auth-label-row">
                  <label className="auth-label">Mobile Number</label>
                  <span className="auth-char-count">{phone.length}/10</span>
                </div>
                <div className="auth-input-phone-combo">
                  <div className="country-code-button">
                    <span className="country-flag-emoji">🇮🇳</span>
                    <span className="code-text">{countryCode}</span>
                    <ChevronDown size={13} className="code-chevron" />
                  </div>
                  <div className={`phone-input-split ${touched.phone && fieldErrors.phone ? 'has-error' : ''}`}>
                    <input
                      type="tel"
                      inputMode="numeric"
                      required
                      className="auth-input-control"
                      placeholder="Enter your mobile number"
                      value={phone}
                      onChange={handlePhoneChange}
                      onBlur={() => handleBlur('phone')}
                      maxLength={10}
                      disabled={isSubmitting}
                      autoComplete="tel"
                    />
                  </div>
                </div>
                {touched.phone && fieldErrors.phone && (
                  <div className="auth-field-error-message" role="alert">
                    <AlertCircle size={13} />
                    <span>{fieldErrors.phone}</span>
                  </div>
                )}
              </div>

              {/* Field 4: Password */}
              <div className="auth-field-row">
                <div className="auth-label-row">
                  <label className="auth-label">Password</label>
                  <span className="auth-char-count">{password.length}/12</span>
                </div>
                <div className={`auth-input-wrapper ${touched.password && fieldErrors.password ? 'has-error' : ''}`}>
                  <Lock size={16} className="auth-field-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="auth-input-control"
                    placeholder="Create a password"
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={() => handleBlur('password')}
                    maxLength={12}
                    disabled={isSubmitting}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="auth-input-action-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {touched.password && fieldErrors.password && (
                  <div className="auth-field-error-message" role="alert">
                    <AlertCircle size={13} />
                    <span>{fieldErrors.password}</span>
                  </div>
                )}
              </div>

              {/* Primary Button: Exact Matching Teal #017C9E */}
              <button
                type="submit"
                className="auth-primary-action-btn"
                disabled={!isFormValid || isSubmitting}
                title={!isFormValid ? "Please fill in all required fields correctly to create your account" : "Create Account"}
              >
                {isSubmitting ? (
                  <span className="btn-spinner-flex">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Creating Account...</span>
                  </span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* Footer Switch Prompt */}
            <div className="auth-switch-prompt">
              <span>Already have an account?</span>
              <button
                type="button"
                className="auth-text-link"
                onClick={() => navigateTo('login')}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scoped CSS with Exact Matching Colors and Layout */}
      <style>{`
        .auth-page-root {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F4F6F8;
          padding: 24px 16px;
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        .auth-split-layout {
          width: 100%;
          max-width: 1040px;
          min-height: 640px;
          background: #FFFFFF;
          border-radius: 28px;
          box-shadow: 0 16px 45px -10px rgba(0, 0, 0, 0.08), 0 2px 10px rgba(0, 0, 0, 0.03);
          display: flex;
          overflow: hidden;
          box-sizing: border-box;
        }

        /* Left Side: Artwork for Sign Up */
        .auth-artwork-panel.left-side {
          flex: 0 0 51%;
          position: relative;
          background: #E8F4F8;
          min-height: 600px;
          cursor: pointer;
          overflow: hidden;
          text-align: left;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
        }

        .auth-artwork-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: right top !important;
          display: block;
          transition: transform 0.4s ease;
        }

        .auth-artwork-panel:hover .auth-artwork-image {
          transform: scale(1.015);
        }

        /* Right Side: Form Panel for Sign Up */
        .auth-form-panel {
          flex: 0 0 49%;
          background: #FFFFFF;
          padding: 44px 44px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          box-sizing: border-box;
          position: relative;
          text-align: left;
        }

        /* Form Container */
        .auth-form-container {
          width: 100%;
          max-width: 370px;
          margin: 0 auto;
          text-align: left;
        }

        .auth-headline {
          font-size: 1.875rem;
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 16px 0;
          letter-spacing: -0.02em;
          text-align: left;
        }

        /* Social Row */
        .auth-social-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .auth-social-button {
          flex: 1;
          height: 44px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .auth-social-button:hover:not(:disabled) {
          border-color: #CBD5E1;
          background: #F8FAFC;
          transform: translateY(-1px);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
        }

        .auth-social-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Separator */
        .auth-separator {
          display: flex;
          align-items: center;
          margin: 16px 0 16px 0;
          gap: 14px;
        }

        .sep-line {
          flex: 1;
          height: 1px;
          background: #E2E8F0;
        }

        .sep-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Alerts */
        .auth-alert-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.8125rem;
          margin-bottom: 14px;
        }

        .auth-alert-message.error {
          background: #FEF2F2;
          color: #DC2626;
          border: 1px solid #FEE2E2;
        }

        .auth-alert-message.success {
          background: #F0FDF4;
          color: #16A34A;
          border: 1px solid #DCFCE7;
        }

        .auth-alert-message.info {
          background: #EFF6FF;
          color: #1D4ED8;
          border: 1px solid #BFDBFE;
        }

        /* Form Body */
        .auth-form-body {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }

        .auth-field-row {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .auth-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .auth-label {
          font-size: 0.8125rem;
          font-weight: 500;
          color: #1E293B;
          text-align: left;
        }

        .auth-char-count {
          font-size: 0.75rem;
          color: #94A3B8;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        .auth-input-wrapper {
          display: flex;
          align-items: center;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          height: 44px;
          padding: 0 14px;
          background: #FFFFFF;
          box-sizing: border-box;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
        }

        .auth-input-wrapper:focus-within {
          border-color: #017C9E;
          box-shadow: 0 0 0 3px rgba(1, 124, 158, 0.12);
        }

        .auth-input-wrapper.has-error {
          border-color: #EF4444 !important;
          background-color: #FFFDFD;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12) !important;
        }

        .auth-field-error-message {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #DC2626;
          font-size: 0.75rem;
          font-weight: 500;
          margin-top: 1px;
          line-height: 1.3;
          animation: authFieldFadeIn 0.15s ease-in-out;
        }

        @keyframes authFieldFadeIn {
          from { opacity: 0; transform: translateY(-2px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Phone Input Combo */
        .auth-input-phone-combo {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
        }

        .country-code-button {
          display: flex;
          align-items: center;
          gap: 6px;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          height: 44px;
          padding: 0 10px;
          background: #FFFFFF;
          flex-shrink: 0;
          user-select: none;
        }

        .country-flag-emoji {
          font-size: 1rem;
          line-height: 1;
        }

        .code-text {
          font-size: 0.8125rem;
          font-weight: 500;
          color: #1E293B;
        }

        .code-chevron {
          color: #94A3B8;
        }

        .phone-input-split {
          flex: 1;
          display: flex;
          align-items: center;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          height: 44px;
          padding: 0 14px;
          background: #FFFFFF;
          box-sizing: border-box;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .phone-input-split:focus-within {
          border-color: #017C9E;
          box-shadow: 0 0 0 3px rgba(1, 124, 158, 0.12);
        }

        .phone-input-split.has-error {
          border-color: #EF4444 !important;
          background-color: #FFFDFD;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12) !important;
        }

        .auth-field-icon {
          color: #94A3B8;
          flex-shrink: 0;
          margin-right: 10px;
        }

        .auth-input-control {
          border: none;
          outline: none;
          background: transparent;
          width: 100%;
          font-size: 0.875rem;
          color: #0F172A;
          padding: 0;
        }

        .auth-input-control::placeholder {
          color: #94A3B8;
          font-size: 0.875rem;
        }

        .auth-input-action-btn {
          background: none;
          border: none;
          padding: 4px;
          color: #94A3B8;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.15s ease;
        }

        .auth-input-action-btn:hover {
          color: #475569;
        }

        /* Primary Teal Button matching Sign In exactly (#017C9E) */
        .auth-primary-action-btn {
          width: 100%;
          height: 46px;
          background: #017C9E;
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 10px rgba(1, 124, 158, 0.18);
          transition: background 0.15s ease, transform 0.05s ease, box-shadow 0.15s ease;
        }

        .auth-primary-action-btn:hover:not(:disabled) {
          background: #016885;
          box-shadow: 0 6px 14px rgba(1, 124, 158, 0.28);
          transform: translateY(-1px);
        }

        .auth-primary-action-btn:active:not(:disabled) {
          transform: translateY(1px);
        }

        .auth-primary-action-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          background: #7EA6B2;
          box-shadow: none;
        }

        .btn-spinner-flex {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Switch Prompt */
        .auth-switch-prompt {
          text-align: center;
          margin-top: 20px;
          font-size: 0.84375rem;
          color: #64748B;
        }

        .auth-text-link {
          color: #017C9E;
          font-weight: 600;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          margin-left: 6px;
          font-size: 0.84375rem;
          transition: color 0.15s ease;
        }

        .auth-text-link:hover {
          text-decoration: underline;
          color: #016885;
        }

        /* Responsive Breakpoints */
        @media (max-width: 880px) {
          .auth-split-layout {
            flex-direction: column;
            max-width: 480px;
            border-radius: 20px;
          }

          .auth-artwork-panel.left-side {
            height: 320px;
            min-height: 320px;
            max-height: 360px;
            flex: none;
            width: 100%;
          }

          .auth-artwork-image {
            object-position: right top !important;
          }

          .auth-form-panel {
            padding: 32px 24px;
            flex: none;
          }
        }

        @media (max-width: 480px) {
          .auth-page-root {
            padding: 12px;
          }

          .auth-artwork-panel.left-side {
            height: 260px;
            min-height: 260px;
          }

          .auth-form-panel {
            padding: 24px 18px;
          }

          .auth-headline {
            font-size: 1.625rem;
          }
        }
      `}</style>
    </div>
  );
};
export default SignupPage;
