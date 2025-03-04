import { HTTPError, Recipe, User, UserFavorite, GetFavoritesByUserRow } from "@/types";

// Use relative URLs for our Next.js API routes
const API_BASE_URL = "https://gourmet.cours.quimerch.com";

/**
 * Custom fetch function to interact with the Gourmet API via our Next.js API routes
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Set default headers
  const headers: Record<string, string> = {
    "Accept": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  // Get the token from localStorage if it exists
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  
  // Add authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") === -1) {
      if (!response.ok) {
        throw {
          status: response.status,
          detail: await response.text(),
        } as HTTPError;
      }
      return await response.text() as unknown as T;
    }

    // Parse JSON response
    const data = await response.json();

    // Handle API errors
    if (!response.ok) {
      throw {
        status: response.status,
        ...data,
      } as HTTPError;
    }

    return data as T;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

/**
 * API functions for recipes
 */
export const recipesApi = {
  // Get all recipes
  getAll: () => apiFetch<Recipe[]>("/recipes"),
  
  // Get a single recipe by ID
  getById: (id: string) => apiFetch<Recipe>(`/recipes/${id}`),
  
  // Get related recipes
  getRelated: (id: string) => apiFetch<Recipe[]>(`/recipes/${id}/related`),
  
  // Search recipes
  search: (query: string) => apiFetch<Recipe[]>(`/search?q=${encodeURIComponent(query)}`),
};

/**
 * API functions for user authentication
 */
export const authApi = {
  // Login user
  login: (credentials: { username: string; password: string }) => 
    apiFetch<{ token: string }>("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  
  // Get current user info
  getMe: () => apiFetch<User>("/me"),
  
  // Logout user (client-side only, just removes the token)
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
    return Promise.resolve();
  },
};

/**
 * API functions for favorites
 */
export const favoritesApi = {
  // Get user's favorites
  getMyFavorites: () => apiFetch<GetFavoritesByUserRow[]>("/favorites"),
  
  // Add a recipe to favorites
  addFavorite: (username: string, recipeId: string) => 
    apiFetch<UserFavorite>(`/users/${username}/favorites?recipeID=${recipeId}`, {
      method: "POST",
    }),
  
  // Remove a recipe from favorites
  removeFavorite: (username: string, recipeId: string) => 
    apiFetch<void>(`/users/${username}/favorites?recipeID=${recipeId}`, {
      method: "DELETE",
    }),
};
