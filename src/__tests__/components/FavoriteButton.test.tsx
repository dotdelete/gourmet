import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSession } from 'next-auth/react';
import FavoriteButton from '@/components/FavoriteButton';
import { favoritesApi } from '@/lib/api/client';

// Mock the next-auth/react module
jest.mock('next-auth/react');

// Mock the API client
jest.mock('@/lib/api/client', () => ({
  favoritesApi: {
    getMyFavorites: jest.fn(),
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
  },
}));

// Mock the icons
jest.mock('@/components/icons', () => ({
  HeartIcon: () => <span data-testid="heart-icon">♡</span>,
  HeartSolidIcon: () => <span data-testid="heart-solid-icon">♥</span>,
}));

describe('FavoriteButton', () => {
  const mockSession = {
    data: {
      user: {
        id: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
      },
      expires: '2023-01-01',
    },
    status: 'authenticated',
  };

  const mockNoSession = {
    data: null,
    status: 'unauthenticated',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset window.location.href
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' },
    });
  });

  it('renders an empty heart when recipe is not a favorite', async () => {
    // Mock session
    (useSession as jest.Mock).mockReturnValue(mockSession);
    
    // Mock API response - no favorites
    (favoritesApi.getMyFavorites as jest.Mock).mockResolvedValue([]);

    // Render component
    render(<FavoriteButton recipeId="recipe1" />);

    // Wait for the useEffect to complete
    await waitFor(() => {
      expect(favoritesApi.getMyFavorites).toHaveBeenCalled();
    });

    // Check that the empty heart icon is displayed
    expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('heart-solid-icon')).not.toBeInTheDocument();
  });

  it('renders a filled heart when recipe is a favorite', async () => {
    // Mock session
    (useSession as jest.Mock).mockReturnValue(mockSession);
    
    // Mock API response - recipe is a favorite
    (favoritesApi.getMyFavorites as jest.Mock).mockResolvedValue([
      { recipe: { id: 'recipe1', name: 'Test Recipe' } }
    ]);

    // Render component
    render(<FavoriteButton recipeId="recipe1" />);

    // Wait for the useEffect to complete and state to update
    await waitFor(() => {
      expect(screen.getByTestId('heart-solid-icon')).toBeInTheDocument();
    });
    
    // Verify empty heart is not present
    expect(screen.queryByTestId('heart-icon')).not.toBeInTheDocument();
  });

  it('adds a recipe to favorites when clicked and not a favorite', async () => {
    // Setup user event
    const user = userEvent.setup();
    
    // Mock session
    (useSession as jest.Mock).mockReturnValue(mockSession);
    
    // Mock API responses
    (favoritesApi.getMyFavorites as jest.Mock).mockResolvedValue([]);
    (favoritesApi.addFavorite as jest.Mock).mockResolvedValue({ 
      username: 'testuser', 
      recipe_id: 'recipe1' 
    });

    // Render component
    render(<FavoriteButton recipeId="recipe1" />);

    // Wait for the initial useEffect to complete
    await waitFor(() => {
      expect(favoritesApi.getMyFavorites).toHaveBeenCalled();
    });

    // Click the button
    const button = screen.getByRole('button');
    await user.click(button);

    // Verify the API was called correctly
    expect(favoritesApi.addFavorite).toHaveBeenCalledWith('testuser', 'recipe1');
    
    // Check that the heart icon changed to filled
    await waitFor(() => {
      expect(screen.getByTestId('heart-solid-icon')).toBeInTheDocument();
    });
  });

  it('removes a recipe from favorites when clicked and is a favorite', async () => {
    // Setup user event
    const user = userEvent.setup();
    
    // Mock session
    (useSession as jest.Mock).mockReturnValue(mockSession);
    
    // Mock API responses
    (favoritesApi.getMyFavorites as jest.Mock).mockResolvedValue([
      { recipe: { id: 'recipe1', name: 'Test Recipe' } }
    ]);
    (favoritesApi.removeFavorite as jest.Mock).mockResolvedValue({});

    // Render component
    render(<FavoriteButton recipeId="recipe1" />);

    // Wait for the initial useEffect to complete
    await waitFor(() => {
      expect(favoritesApi.getMyFavorites).toHaveBeenCalled();
    });

    // Click the button
    const button = screen.getByRole('button');
    await user.click(button);

    // Verify the API was called correctly
    expect(favoritesApi.removeFavorite).toHaveBeenCalledWith('testuser', 'recipe1');
    
    // Check that the heart icon changed to empty
    await waitFor(() => {
      expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
    });
  });

  it('redirects to login page when clicked and user is not logged in', async () => {
    // Setup user event
    const user = userEvent.setup();
    
    // Mock no session
    (useSession as jest.Mock).mockReturnValue(mockNoSession);

    // Render component
    render(<FavoriteButton recipeId="recipe1" />);

    // Click the button
    const button = screen.getByRole('button');
    await user.click(button);

    // Verify redirect to login page
    expect(window.location.href).toBe('/login');
    
    // Verify no API calls were made
    expect(favoritesApi.addFavorite).not.toHaveBeenCalled();
    expect(favoritesApi.removeFavorite).not.toHaveBeenCalled();
  });

  it('applies the correct CSS classes based on variant prop', () => {
    // Mock session
    (useSession as jest.Mock).mockReturnValue(mockSession);
    (favoritesApi.getMyFavorites as jest.Mock).mockResolvedValue([]);

    // Render with default variant
    const { rerender } = render(<FavoriteButton recipeId="recipe1" />);
    const defaultButton = screen.getByRole('button');
    expect(defaultButton).toHaveClass('text-orange-500');
    expect(defaultButton).not.toHaveClass('bg-gray-100');

    // Rerender with contained variant
    rerender(<FavoriteButton recipeId="recipe1" variant="contained" />);
    const containedButton = screen.getByRole('button');
    expect(containedButton).toHaveClass('bg-gray-100');
  });
});
