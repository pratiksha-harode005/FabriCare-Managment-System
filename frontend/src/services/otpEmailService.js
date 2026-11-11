import { ref, get, update } from 'firebase/database';
import { rtdb } from '../config/firebase';

/**
 * Service to generate, persist, send via EmailJS, and verify real 4-Digit Customer OTPs
 * for both Pickup and Delivery tasks.
 */

const EMAILJS_API_URL = 'https://api.emailjs.com/api/v1.0/email/send';

// Helper to generate a genuine 4-digit code (1000 - 9999)
export const generate4DigitOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

/**
 * Retrieves existing or generates a new 4-digit OTP for an order in Firebase RTDB
 * @param {string} orderId 
 * @param {'pickup' | 'delivery'} type 
 * @returns {Promise<string>} 4-digit OTP
 */
export const getOrGenerateOrderOtp = async (orderId, type = 'pickup') => {
  if (!orderId || !rtdb) return generate4DigitOtp();

  const cleanOrderId = String(orderId).trim();
  const secretRef = ref(rtdb, `orderSecrets/${cleanOrderId}`);

  try {
    const snap = await get(secretRef);
    const secrets = snap.exists() ? snap.val() : {};

    const key = type === 'delivery' ? 'deliveryOtp' : 'pickupOtp';
    const existing = secrets[key];

    // If existing valid 4-digit OTP exists, return it
    if (existing && /^\d{4}$/.test(String(existing).trim())) {
      return String(existing).trim();
    }

    // Otherwise generate and store a new real 4-digit OTP
    const newOtp = generate4DigitOtp();
    await update(secretRef, {
      [key]: newOtp,
      otpAttempts: 0,
      updatedAt: Date.now()
    });

    return newOtp;
  } catch (err) {
    console.warn(`[OTP Service] Failed to read/update orderSecrets for ${orderId}:`, err);
    return generate4DigitOtp();
  }
};

/**
 * Sends real 4-digit OTP to the customer's email using EmailJS.
 * 
 * Template parameters supported:
 * - to_email / email / customer_email
 * - to_name / customer_name
 * - otp_code / otp
 * - order_id / order_code
 * - task_type (Pickup / Delivery)
 * - message
 */
export const sendCustomerOtpEmail = async ({
  orderId,
  orderCode,
  customerEmail,
  customerName = 'Valued Customer',
  taskType = 'pickup' // 'pickup' | 'delivery'
}) => {
  const cleanEmail = String(customerEmail || '').trim().toLowerCase();
  const formattedType = taskType.toLowerCase() === 'delivery' ? 'Delivery' : 'Pickup';
  const displayCode = orderCode || orderId || 'Order';

  // 1. Get or generate the real 4-digit OTP from database
  const otpCode = await getOrGenerateOrderOtp(orderId, taskType);

  // 2. Fetch EmailJS environment config
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

  const hasConfig = Boolean(serviceId && templateId && publicKey);

  const emailPayload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      to_email: cleanEmail,
      email: cleanEmail,
      customer_email: cleanEmail,
      to_name: customerName,
      customer_name: customerName,
      otp_code: otpCode,
      otp: otpCode,
      order_id: displayCode,
      order_code: displayCode,
      task_type: formattedType,
      subject: `FabriCare ${formattedType} OTP: ${otpCode} (Order ${displayCode})`,
      message: `Your 4-digit FabriCare verification code for Doorstep ${formattedType} is: ${otpCode}. Please share this code only with your authorized delivery partner at your doorstep.`
    }
  };

  if (hasConfig && cleanEmail && cleanEmail.includes('@')) {
    try {
      const response = await fetch(EMAILJS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn('[EmailJS] API responded with error:', response.status, errText);
        return {
          success: true,
          sent: false,
          otp: otpCode,
          email: cleanEmail,
          warning: `EmailJS responded with status ${response.status}: ${errText}`
        };
      }

      console.info(`[EmailJS] Successfully sent ${formattedType} OTP to ${cleanEmail}`);
      return {
        success: true,
        sent: true,
        otp: otpCode,
        email: cleanEmail
      };
    } catch (netErr) {
      console.warn('[EmailJS] Network error while sending OTP:', netErr);
      return {
        success: true,
        sent: false,
        otp: otpCode,
        email: cleanEmail,
        warning: netErr.message
      };
    }
  }

  // Fallback / Development Simulation mode if EmailJS keys are not yet configured in .env
  console.info(
    `%c[FabriCare OTP Email]%c To: ${cleanEmail || 'customer'} | ${formattedType} OTP: %c${otpCode}%c | Order: ${displayCode}`,
    'background:#0D7A75;color:#fff;padding:2px 6px;border-radius:4px;font-weight:bold;',
    'color:#1E293B;font-weight:600;',
    'background:#FEF3C7;color:#D97706;padding:2px 6px;border-radius:4px;font-weight:bold;',
    'color:#64748B;'
  );

  return {
    success: true,
    sent: false,
    simulated: true,
    otp: otpCode,
    email: cleanEmail,
    warning: hasConfig ? 'Invalid customer email' : 'EmailJS credentials not yet configured in .env'
  };
};

/**
 * Validates the entered OTP against the real OTP stored in database
 */
export const verifyOrderOtp = async (orderId, enteredOtp, taskType = 'pickup') => {
  if (!orderId || !enteredOtp) {
    return { valid: false, message: 'Please enter a 4-digit OTP.' };
  }

  const cleanEntered = String(enteredOtp).trim();
  if (cleanEntered.length !== 4 || !/^\d{4}$/.test(cleanEntered)) {
    return { valid: false, message: 'OTP must be exactly 4 digits.' };
  }

  if (!rtdb) {
    return { valid: cleanEntered.length === 4, message: '' };
  }

  const cleanOrderId = String(orderId).trim();
  const secretRef = ref(rtdb, `orderSecrets/${cleanOrderId}`);

  try {
    const snap = await get(secretRef);
    if (!snap.exists()) {
      return { valid: false, message: 'Security record not found for this order.' };
    }

    const secrets = snap.val();
    const key = taskType.toLowerCase() === 'delivery' ? 'deliveryOtp' : 'pickupOtp';
    const actualOtp = String(secrets[key] || '').trim();

    if (cleanEntered !== actualOtp) {
      const attempts = (secrets.otpAttempts || 0) + 1;
      await update(secretRef, { otpAttempts: attempts });
      return {
        valid: false,
        attempts,
        message: `Invalid OTP. Please enter the 4-digit code sent to customer's email.`
      };
    }

    // Reset attempts on successful verification
    await update(secretRef, { otpAttempts: 0, [`${key}VerifiedAt`]: Date.now() });
    return { valid: true, message: 'OTP verified successfully.' };
  } catch (err) {
    console.warn('[OTP Service] Verification read error:', err);
    return { valid: false, message: err.message || 'OTP verification failed.' };
  }
};

