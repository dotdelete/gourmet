import { apiFetch, authApi, recipesApi, favoritesApi } from '@/lib/api/client';
import Cookies from 'js-cookie';

// Mock the Cookies module
jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

// Mock global fetch
const mockFetch = global.fetch as jest.Mock;

// Helper function to create mock responses
const createMockResponse = <T>(
  body: T, 
  options: { 
    ok?: boolean; 
    status?: number; 
    contentType?: string;
    isJson?: boolean;
  } = {}
): Response => {
  const {
    ok = true,
    status = 200,
    contentType = 'application/json',
    isJson = true,
  } = options;
  
  const statusText = ok ? 'OK' : status === 404 ? 'Not Found' : 'Error';
  
  const response: Partial<Response> = {
    ok,
    status,
    statusText,
    headers: new Headers({
      'content-type': contentType,
    }),
    redirected: false,
    type: 'basic' as ResponseType,
    url: 'https://gourmet.cours.quimerch.com/mock',
    clone: jest.fn(),
    body: null,
    bodyUsed: false,
    arrayBuffer: jest.fn(),
    blob: jest.fn(),
    formData: jest.fn(),
    text: jest.fn().mockResolvedValue(isJson ? JSON.stringify(body) : body),
  };
  
  // Add json method
  Object.defineProperty(response, 'json', {
    value: isJson 
      ? jest.fn().mockResolvedValue(body)
      : jest.fn().mockRejectedValue(new Error('Invalid JSON'))
  });
  
  return response as Response;
};

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  describe('apiFetch', () => {
    it('should make a fetch request with the correct URL', async () => {
      // Setup
      const mockResponse = createMockResponse({ data: 'test' });
      mockFetch.mockResolvedValue(mockResponse);

      // Execute
      await apiFetch('/test-endpoint');

      // Verify
      expect(mockFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          href: expect.stringContaining('/test-endpoint'),
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: 'application/json',
          }),
        })
      );
    });

    it('should add authorization header for protected routes', async () => {
      // Setup
      const mockResponse = createMockResponse({ data: 'test' });
      mockFetch.mockResolvedValue(mockResponse);
      (Cookies.get as jest.Mock).mockReturnValue('Bearer test-token');

      // Execute
      await apiFetch('/favorites');

      // Verify
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(URL),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });

    it('should handle non-JSON responses', async () => {
      // Setup
      const mockResponse = createMockResponse('text response', {
        contentType: 'text/plain',
        isJson: false
      });
      mockFetch.mockResolvedValue(mockResponse);

      // Execute
      const result = await apiFetch('/text-endpoint');

      // Verify
      expect(result).toBe('text response');
    });

    it('should throw an error for non-OK responses', async () => {
      // Setup
      const errorData = { 
        status: 404, 
        title: 'Not Found',
        detail: 'Resource not found'
      };
      const mockResponse = createMockResponse(errorData, {
        ok: false,
        status: 404
      });
      mockFetch.mockResolvedValue(mockResponse);

      // Execute & Verify
      await expect(apiFetch('/not-found')).rejects.toEqual(
        expect.objectContaining({
          status: 404,
          title: 'Not Found',
          detail: 'Resource not found'
        })
      );
    });
  });

  describe('authApi', () => {
    it('should login a user and store the token', async () => {
      // Setup
      const credentials = { username: 'pi', password: 'tJdRPSHxxuTZR6GwLqoK3Hcpwe' };
      const tokenResponse = { token: 'test-token' };
      const userResponse = { 
        username: 'pi', 
        full_name: 'Test User',
        email: 'test@example.com'
      };
      
      // Mock first fetch for token
      const mockTokenResponse = createMockResponse(tokenResponse);
      
      // Mock second fetch for user data
      const mockUserResponse = createMockResponse(userResponse);
      
      mockFetch.mockResolvedValueOnce(mockTokenResponse).mockResolvedValueOnce(mockUserResponse);

      // Execute
      console.log('Executing login...');
      console.log("credentials", credentials);
      const result = await authApi.login(credentials);

      // Verify
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(Cookies.set).toHaveBeenCalledWith(
        'auth_token',
        expect.stringContaining('Bearer test-token'),
        expect.any(Object)
      );
      expect(result).toEqual({
        id: 'pi',
        name: 'Test User',
        email: 'test@example.com',
        token: 'test-token'
      });
    });

    it('should logout a user by removing the token', async () => {
      // Execute
      await authApi.logout();

      // Verify
      expect(Cookies.remove).toHaveBeenCalledWith('auth_token');
    });
  });

  describe('recipesApi', () => {
    it('should fetch all recipes', async () => {
      // Setup
      const mockRecipes = [{ id: '1', name: 'Recipe 1' }, { id: '2', name: 'Recipe 2' }];
      const mockResponse = createMockResponse(mockRecipes);
      mockFetch.mockResolvedValue(mockResponse);

      // Execute
      const result = await recipesApi.getAll();

      // Verify
      expect(mockFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          href: expect.stringContaining('/recipes'),
        }),
        expect.any(Object)
      );
      expect(result).toEqual(mockRecipes);
    });

    it('should fetch a recipe by ID', async () => {
      // Setup
      const mockRecipe = { id: '1', name: 'Recipe 1' };
      const mockResponse = createMockResponse(mockRecipe);
      mockFetch.mockResolvedValue(mockResponse);

      // Execute
      const result = await recipesApi.getById('1');

      // Verify
      expect(mockFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          href: expect.stringContaining('/recipes/1'),
        }),
        expect.any(Object)
      );
      expect(result).toEqual(mockRecipe);
    });
  });

  describe('favoritesApi', () => {
    it('should fetch user favorites', async () => {
      // Setup
      const mockFavorites = [{ recipe: { id: '1', name: 'Recipe 1' } }];
      const mockResponse = createMockResponse(mockFavorites);
      mockFetch.mockResolvedValue(mockResponse);

      // Execute
      const result = await favoritesApi.getMyFavorites();

      // Verify
      expect(mockFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          href: expect.stringContaining('/favorites'),
        }),
        expect.any(Object)
      );
      expect(result).toEqual(mockFavorites);
    });

    it('should add a recipe to favorites', async () => {
      // Setup
      const mockFavorite = { username: 'testuser', recipe_id: '1' };
      const mockResponse = createMockResponse(mockFavorite);
      mockFetch.mockResolvedValue(mockResponse);

      // Execute
      const result = await favoritesApi.addFavorite('testuser', '1');

      // Verify
      expect(mockFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          href: expect.stringContaining('/users/testuser/favorites?recipeID=1'),
        }),
        expect.objectContaining({
          method: 'POST',
        })
      );
      expect(result).toEqual(mockFavorite);
    });

    it('should remove a recipe from favorites', async () => {
      // Setup
      const mockResponse = createMockResponse({});
      mockFetch.mockResolvedValue(mockResponse);

      // Execute
      await favoritesApi.removeFavorite('testuser', '1');

      // Verify
      expect(mockFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          href: expect.stringContaining('/users/testuser/favorites?recipeID=1'),
        }),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });
});
