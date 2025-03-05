export interface Recipe {
  id: string;
  name: string;
  description: string;
  instructions: string;
  image_url: string;
  category: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  when_to_eat: string;
  calories?: number;
  cost?: number;
  created_at: string;
  created_by: string;
  published: boolean;
  disclaimer?: string;
}

export interface User {
  username: string;
  full_name: string;
  email: string;
  created_at: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface TokenResponse {
  token: string;
}

export interface UserFavorite {
  username: string;
  recipe_id: string;
}

export interface GetFavoritesByUserRow {
  recipe: Recipe;
}

export interface HTTPError {
  status?: number;
  title?: string;
  detail?: string;
  instance?: string;
  errors?: Array<{
    name: string;
    reason: string;
    more: Record<string, never>;
  }>;
}
