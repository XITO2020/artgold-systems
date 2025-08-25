// Stocke le token JWT dans le localStorage
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

// Récupère le token JWT depuis le localStorage
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Supprime le token JWT du localStorage
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
};

// Vérifie si l'utilisateur est authentifié
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
