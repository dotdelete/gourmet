import {
  HTTPError,
  Recipe,
  User,
  UserFavorite,
  GetFavoritesByUserRow,
} from "@/types";
import Cookies from "js-cookie";

// Use relative URLs for our Next.js API routes
const API_BASE_URL = "https://gourmet.cours.quimerch.com";

// Define protected routes using regex patterns for more flexible matching
const PROTECTED_ROUTES_PATTERNS = [
  /^\/login(\/.*)?$/,
  /^\/me(\/.*)?$/,
  /^\/favorites(\/.*)?$/,
  /^\/users\/[^/]+\/favorites(\/.*)?$/,
];

/**
 * Custom fetch function to interact with the Gourmet API via our Next.js API routes
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = new URL(endpoint, API_BASE_URL);

  // Set default headers
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  // Extract the path without query parameters
  const pathName = url.pathname;

  // Check if the current path matches any protected route pattern using regex
  const isProtectedRoute = PROTECTED_ROUTES_PATTERNS.some((pattern) =>
    pattern.test(pathName)
  );

  if (isProtectedRoute) {
    // Get the token from cookies
    const token = Cookies.get("auth_token");

    // Add authorization header if token exists
    if (token) {
      headers["Authorization"] = token;
    }
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
      return (await response.text()) as unknown as T;
    }

    // Parse JSON response
    let data;
    try {
      data = await response.json();
    } catch {
      return {} as T;
    }

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
 * API functions for user authentication
 */
export const authApi = {
  // Login user
  login: async (credentials: { username: string; password: string }) => {
    // Remove existing token
    Cookies.remove("auth_token");

    // Call the login endpoint
    const { token } = await apiFetch<{ token: string }>("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: { "Content-Type": "application/json" },
    });
    // Decode token to extract expiration if available
    let expires: number | Date = 7; // Default fallback expiration in days
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(base64));

      if (payload && payload.exp) {
        // Convert exp (seconds since epoch) to Date object
        expires = new Date(payload.exp * 1000);
      }
    } catch (e) {
      console.warn("Could not decode token for expiration date", e);
    }

    // Store the token in a cookie - format must match what your API expects
    Cookies.set("auth_token", `Bearer ${token}`, {
      expires,
      sameSite: "strict",
      path: "/",
    });

    // Fetch user details
    const user = await apiFetch<User>("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      id: user.username,
      name: user.full_name,
      email: user.email,
      token: token,
    };
  },

  // Get current user info
  getMe: () => apiFetch<User>("/me"),

  // Logout user (client-side only, just removes the token)
  logout: () => {
    Cookies.remove("auth_token");
    return Promise.resolve();
  },
};

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
  search: (query: string) =>
    apiFetch<Recipe[]>(`/search?q=${encodeURIComponent(query)}`),
};

/**
 * API functions for favorites
 */
export const favoritesApi = {
  // Get user's favorites
  getMyFavorites: () => apiFetch<GetFavoritesByUserRow[]>("/favorites"),

  // Add a recipe to favorites
  addFavorite: (username: string, recipeId: string) =>
    apiFetch<UserFavorite>(
      `/users/${username}/favorites?recipeID=${recipeId}`,
      {
        method: "POST",
      }
    ),

  // Remove a recipe from favorites
  removeFavorite: (username: string, recipeId: string) =>
    apiFetch<void>(`/users/${username}/favorites?recipeID=${recipeId}`, {
      method: "DELETE",
    }),
};
