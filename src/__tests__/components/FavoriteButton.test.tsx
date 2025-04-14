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

// Mock the CustomEventSource used in FavoriteButton
jest.mock('@/components/FavoriteButton', () => {
  const originalModule = jest.requireActual('@/components/FavoriteButton');
  return {
    ...originalModule,
    __esModule: true,
    // Use a more specific type for props if possible, e.g., React.ComponentProps<typeof originalModule.default>
    // For simplicity in this example, we'll keep it basic, but avoid 'any' in production code.
    // Let's assume FavoriteButtonProps is the correct type if exported, otherwise define inline or use a broader type.
    // If FavoriteButtonProps is not exported, define a minimal interface here or use React.ComponentProps<typeof originalModule.default>
    default: (props: React.ComponentProps<typeof originalModule.default>) => {
      // Mock the CustomEventSource part specifically for the test environment
      // You might need to adjust this mock based on how CustomEventSource is used
      const MockedFavoriteButton = originalModule.default;
      // Replace the actual CustomEventSource usage within the component if possible,
      // or mock its behavior more directly if it's instantiated inside.
      // For simplicity here, we just render the original button but acknowledge the mock setup.
      // A more robust mock might involve spying on or replacing the CustomEventSource instance.
      return <MockedFavoriteButton {...props} />;
    },
    // If CustomEventSource is exported and used directly, mock it here too:
    // CustomEventSource: jest.fn().mockImplementation(() => ({
    //   addEventListener: jest.fn(),
    //   connect: jest.fn(),
    //   close: jest.fn(),
    // })),
  };
});


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

    // Mock fetch specifically for the SSE endpoint to prevent the error
    const mockFetch = global.fetch as jest.Mock;
    mockFetch.mockImplementation((url) => {
      if (url.toString().includes('/stars')) {
        // Return a mock response for the SSE endpoint
        return Promise.resolve({
          ok: true,
          headers: new Headers({ 'content-type': 'text/event-stream' }),
          // Replace ReadableStream with null or a simpler mock if stream reading isn't tested
          body: null, 
          // Add other necessary Response properties if needed by the component
          status: 200,
          statusText: 'OK',
          clone: jest.fn(),
          // ... other properties
        } as unknown as Response);
      }
      // Fallback for other fetch calls if necessary, or return a default mock response
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) } as Response);
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
