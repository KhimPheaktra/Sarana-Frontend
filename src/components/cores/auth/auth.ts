export const login = (username: string): void => {
  sessionStorage.setItem('isAuthenticated', 'true');
  sessionStorage.setItem('username', username);
};

export const logout = (): void => {
  sessionStorage.removeItem('isAuthenticated');
  sessionStorage.removeItem('username');
};

export const isAuthenticated = (): boolean => {
  return sessionStorage.getItem('isAuthenticated') === 'true';
};

export const getCurrentUser = (): string | null => {
  return sessionStorage.getItem('username');
}