import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { ref, get, set, update, serverTimestamp } from 'firebase/database';
import { auth, rtdb, isFirebaseConfigured, getSecondaryAuth } from '../config/firebase.js';

export const mapAuthError = (error) => {
  if (!error) return 'An unknown error occurred.';
  const code = error.code || '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email address or password. Please check your credentials and try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please log in or use a different email.';
    case 'auth/invalid-email':
      return 'Please provide a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is not enabled. Please check your Firebase console.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/requires-recent-login':
      return 'This operation requires recent authentication. Please sign in again.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Sign-in window was closed before completing login.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
    default:
      return error.message || 'Authentication failed. Please try again.';
  }
};

/**
 * Register a new user with email & password and create customer profile in RTDB
 * Security Notice: Public self-registration strictly assigns role = 'customer'
 */
export const registerUser = async ({ email, password, fullName, phone = '' }) => {
  const cleanName = (fullName || '').trim();
  const cleanEmail = (email || '').trim().toLowerCase();
  let cleanPhone = (phone || '').replace(/\D/g, '');
  if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
    cleanPhone = cleanPhone.slice(2);
  }

  // 1. Full name: alphabetic characters only, max 25 characters
  if (!cleanName) {
    throw new Error('Please enter your full name.');
  }
  if (cleanName.length > 25) {
    throw new Error('Full name cannot exceed 25 characters.');
  }
  if (!/^[A-Za-z]+(?:\s+[A-Za-z]+)*$/.test(cleanName)) {
    throw new Error('Full name can only contain alphabetic characters (no numbers or special characters).');
  }

  // 2. Email Address: valid email format
  if (!cleanEmail) {
    throw new Error('Please enter your email address.');
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(cleanEmail)) {
    throw new Error('Please enter a valid email address (e.g., user@gmail.com).');
  }

  // 3. Mobile Number: 10 digits starting with 6, 7, 8, or 9
  if (!cleanPhone) {
    throw new Error('Please enter your mobile number.');
  }
  if (cleanPhone.length !== 10) {
    throw new Error('Mobile number must be exactly 10 digits.');
  }
  if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
    throw new Error('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
  }

  // 4. Password: min 6, max 12 characters
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }
  if (password.length > 12) {
    throw new Error('Password cannot exceed 12 characters.');
  }

  if (!isFirebaseConfigured || !auth || !rtdb) {
    throw new Error('Firebase Authentication is not configured.');
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    const user = userCredential.user;

    const resolvedName = cleanName || user.displayName || 'Customer';

    if (resolvedName) {
      await updateProfile(user, { displayName: resolvedName });
    }

    const nameParts = resolvedName.split(' ');
    const firstName = nameParts[0] || resolvedName;
    const lastName = nameParts.slice(1).join(' ') || '';
    const username = cleanEmail ? cleanEmail.split('@')[0] : resolvedName.toLowerCase().replace(/\s+/g, '');
    const userPhone = cleanPhone || (user.phoneNumber || '');

    const userRef = ref(rtdb, `users/${user.uid}`);
    const profileData = {
      name: resolvedName,
      full_name: resolvedName,
      fullName: resolvedName,
      displayName: resolvedName,
      first_name: firstName,
      last_name: lastName,
      username: username,
      email: cleanEmail,
      phone: userPhone,
      phoneNumber: userPhone,
      role: 'customer',
      isActive: true,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(resolvedName)}&background=0D9488&color=fff`,
      createdAt: Date.now()
    };

    await set(userRef, profileData);
    await set(ref(rtdb, `roleUsers/customer/${user.uid}`), true);
    return { ...profileData, uid: user.uid, id: user.uid };
  } catch (error) {
    console.error('Registration failed:', error);
    throw new Error(mapAuthError(error));
  }
};

/**
 * Sign in user with email and password, returning profile with role from RTDB
 */
export const loginUser = async ({ email, password, requiredRole = null }) => {
  if (!isFirebaseConfigured || !auth || !rtdb) {
    throw new Error('Firebase Authentication is not configured.');
  }
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;

    const userSnap = await get(ref(rtdb, `users/${user.uid}`));
    let profile = userSnap.exists() ? userSnap.val() : null;

    if (!profile) {
      // Create initial profile if missing
      const cleanName = user.displayName || 'Customer';
      const nameParts = cleanName.split(' ');
      const cleanEmail = (user.email || email || '').trim().toLowerCase();
      const username = cleanEmail ? cleanEmail.split('@')[0] : cleanName.toLowerCase().replace(/\s+/g, '');
      const cleanPhone = user.phoneNumber || '';

      profile = {
        name: cleanName,
        full_name: cleanName,
        fullName: cleanName,
        displayName: cleanName,
        first_name: nameParts[0] || cleanName,
        last_name: nameParts.slice(1).join(' ') || '',
        username: username,
        email: cleanEmail,
        phone: cleanPhone,
        phoneNumber: cleanPhone,
        role: 'customer',
        isActive: true,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=0D9488&color=fff`,
        createdAt: Date.now()
      };
      await set(ref(rtdb, `users/${user.uid}`), profile);
    }

    if (profile.role) {
      set(ref(rtdb, `roleUsers/${String(profile.role).toLowerCase()}/${user.uid}`), true).catch(() => {});
    }

    // Role Guard Check
    if (requiredRole && profile.role !== requiredRole && profile.role !== 'admin') {
      await signOut(auth);
      throw new Error(`Access Denied: Your account role is "${profile.role}", which does not have permission to access the ${requiredRole} portal.`);
    }

    return { ...profile, uid: user.uid };
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error(mapAuthError(error));
  }
};

/**
 * Sign out current user
 */
export const logoutUser = async () => {
  if (!auth) return;
  await signOut(auth);
};

/**
 * Get current user profile from RTDB
 */
export const getUserProfile = async (uid) => {
  if (!uid || !rtdb) return null;
  const snap = await get(ref(rtdb, `users/${uid}`));
  if (snap.exists()) {
    return { ...snap.val(), uid };
  }
  return null;
};

/**
 * Update current user profile
 */
export const updateUserProfile = async (uid, updates) => {
  if (!uid || !rtdb) return;
  const userRef = ref(rtdb, `users/${uid}`);
  // Exclude role and createdAt to avoid privilege escalation
  const { role, createdAt, ...safeUpdates } = updates;
  await update(userRef, safeUpdates);
};

/**
 * Admin creates staff or agent user using secondary Firebase app instance
 */
export const createStaffOrAgentByAdmin = async ({ 
  email, 
  password, 
  name, 
  phone, 
  role, 
  area, 
  address, 
  department, 
  shift, 
  vehicleType, 
  vehicleNumber, 
  status = 'Active',
  notes,
  ...extraFields 
}) => {
  const { secondaryAuth, secondaryApp } = getSecondaryAuth();
  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, email.trim(), password);
    const newUid = cred.user.uid;

    const effectiveRole = role || 'customer';
    const isActive = status === 'Active' || status === true;

    const profileData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      role: effectiveRole,
      isActive,
      status: isActive ? 'Active' : 'Inactive',
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=0D7A75&color=fff`,
      createdAt: Date.now(),
      ...(area ? { area: area.trim(), location: `${area.trim()}, Bengaluru` } : {}),
      ...(address ? { address } : {}),
      ...(department ? { department: department.trim() } : {}),
      ...(shift ? { shift: shift.trim() } : {}),
      ...(vehicleType ? { vehicleType: vehicleType.trim() } : {}),
      ...(vehicleNumber ? { vehicleNumber: vehicleNumber.trim() } : {}),
      ...(notes ? { notes } : {}),
      ...extraFields
    };

    await set(ref(rtdb, `users/${newUid}`), profileData);
    await set(ref(rtdb, `roleUsers/${effectiveRole}/${newUid}`), true);

    if (effectiveRole === 'agent' || effectiveRole === 'delivery') {
      await set(ref(rtdb, `agents/${newUid}`), {
        isOnline: isActive,
        vehicleType: vehicleType ? vehicleType.trim() : 'Two-Wheeler',
        vehicleNumber: vehicleNumber ? vehicleNumber.trim() : '',
        assignedArea: area ? area.trim() : 'Bengaluru',
        lastLat: 26.2183,
        lastLng: 78.1828,
        lastActiveAt: Date.now()
      });
    }

    // Sign out from secondary auth instance so admin state is pristine
    await signOut(secondaryAuth);
    return { ...profileData, uid: newUid, id: newUid };
  } catch (err) {
    await signOut(secondaryAuth).catch(() => {});
    throw new Error(mapAuthError(err));
  }
};
