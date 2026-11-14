import { RegisteredUser } from './types';

const USERS_STORAGE_KEY = 'nameforpet_registered_users';
const CURRENT_USER_KEY = 'nameforpet_current_user';

// Initial registered users for demo & preview
export const INITIAL_USERS: RegisteredUser[] = [
  {
    id: 'USR-101',
    name: 'Alex Fernando',
    email: 'alex.fernando@example.com',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    role: 'user',
    savedNamesCount: 5,
    ordersCount: 1,
    provider: 'email'
  },
  {
    id: 'USR-102',
    name: 'Kavindi Perera',
    email: 'kavindi.p@example.com',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    role: 'user',
    savedNamesCount: 12,
    ordersCount: 1,
    provider: 'email'
  },
  {
    id: 'USR-103',
    name: 'Dinuka Silva',
    email: 'dinuka.silva@example.com',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    role: 'user',
    savedNamesCount: 8,
    ordersCount: 1,
    provider: 'email'
  },
  {
    id: 'USR-104',
    name: 'Saman Kumara',
    email: 'saman.k@example.com',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    role: 'user',
    savedNamesCount: 3,
    ordersCount: 0,
    provider: 'email'
  },
  {
    id: 'USR-G105',
    name: 'Samantha Wickramasinghe',
    email: 'samantha.pets@gmail.com',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    role: 'user',
    savedNamesCount: 14,
    ordersCount: 2,
    provider: 'google',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Samantha+W&backgroundColor=4285F4'
  }
];

export function getStoredUsers(): RegisteredUser[] {
  if (typeof window === 'undefined') return INITIAL_USERS;
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse users:', err);
    return INITIAL_USERS;
  }
}

export function saveUserLocally(user: RegisteredUser): RegisteredUser[] {
  if (typeof window === 'undefined') return [user];
  try {
    const users = getStoredUsers();
    // Check if email already exists
    const existingIndex = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    let updated: RegisteredUser[];
    if (existingIndex >= 0) {
      updated = [...users];
      updated[existingIndex] = { ...updated[existingIndex], ...user, lastLoginAt: new Date().toISOString() };
    } else {
      updated = [user, ...users];
    }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save user:', err);
    return [user];
  }
}

export function deleteUserLocally(userId: string): RegisteredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const users = getStoredUsers().filter(u => u.id !== userId);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    return users;
  } catch {
    return [];
  }
}

export function getCurrentUser(): RegisteredUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: RegisteredUser | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

/**
 * Dev Bypass Helper: Quickly signs in or signs up a dev test user
 */
export function executeDevBypassLogin(): RegisteredUser {
  const devId = `DEV-${Math.floor(100 + Math.random() * 900)}`;
  const devUser: RegisteredUser = {
    id: devId,
    name: 'Developer Tester',
    email: `dev.tester_${Math.floor(10 + Math.random() * 89)}@nameforpet.com`,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    role: 'user',
    savedNamesCount: 4,
    ordersCount: 0,
    provider: 'dev_bypass'
  };

  saveUserLocally(devUser);
  setCurrentUser(devUser);
  return devUser;
}
