import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { favoritesApi } from '@/lib/api/client';
import { HeartIcon, HeartSolidIcon } from "@/components/icons";

const API_BASE_URL = "https://gourmet.cours.quimerch.com";

interface FavoriteButtonProps {
  recipeId: string;
  variant?: 'default' | 'contained';
}

class CustomEventSource {
  private url: string;
  private headers: HeadersInit;
  private abortController: AbortController | null = null;
  private listeners: Record<string, ((event: unknown) => void)[]> = {};
  private isConnected: boolean = false;
  private maxRetries: number = 3;
  private retryCount: number = 0;
  private retryTimeout: NodeJS.Timeout | null = null;
  private intentionalClose: boolean = false;

  constructor(url: string, headers: HeadersInit = {}) {
    this.url = url;
    this.headers = headers;
  }

  addEventListener(eventType: string, callback: (event: unknown) => void) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(callback);
  }

  connect() {
    if (this.intentionalClose) return;

    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }

    this.abortController = new AbortController();

    fetch(this.url, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
        ...this.headers
      },
      signal: this.abortController.signal
    })
        .then(response => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          if (!response.body) throw new Error("Response body is null");

          this.isConnected = true;
          this.retryCount = 0;

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          const processStream = ({ done, value }: ReadableStreamReadResult<Uint8Array>): Promise<void> => {
            if (this.intentionalClose) return Promise.resolve();

            if (done) {
              if (!this.intentionalClose) this.reconnect();
              return Promise.resolve();
            }

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            const events = buffer.split("\n\n");
            buffer = events.pop() || '';

            events.forEach(eventStr => {
              if (!eventStr.trim()) return;

              const eventLines = eventStr.split('\n');
              let eventType = 'message';
              let data = '';

              eventLines.forEach(line => {
                if (line.startsWith('event:')) {
                  eventType = line.slice(6).trim();
                } else if (line.startsWith('data:')) {
                  data = line.slice(5).trim();
                }
              });

              if (this.listeners[eventType]) {
                const event = { data };
                this.listeners[eventType].forEach(callback => callback(event));
              }
            });

            if (!this.intentionalClose && this.abortController) {
              return reader.read().then(processStream).catch(error => {
                if (!this.intentionalClose) this.handleError(error);
                return Promise.resolve();
              });
            }

            return Promise.resolve();
          };

          return reader.read()
              .then(processStream)
              .catch(error => {
                if (!this.intentionalClose) this.handleError(error);
              });
        })
        .catch(error => {
          if (!(error.name === 'AbortError' && this.intentionalClose)) {
            this.handleError(error);
          }
        });
  }

  private handleError(error: Error) {
    if (!(error.name === 'AbortError' && this.intentionalClose)) {
      console.error("SSE connection error:", error);
    }

    this.isConnected = false;

    if (!this.intentionalClose) {
      this.reconnect();
    }
  }

  private reconnect() {
    if (this.intentionalClose) return;

    if (this.retryCount < this.maxRetries) {
      const timeout = Math.min(1000 * 2 ** this.retryCount, 10000);
      this.retryCount++;

      this.retryTimeout = setTimeout(() => {
        if (!this.intentionalClose) this.connect();
      }, timeout);
    }
  }

  close() {
    this.intentionalClose = true;

    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }

    this.isConnected = false;
  }
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ recipeId, variant = 'default' }) => {
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [likeCount, setLikeCount] = useState<number | null>(null);
  const eventSourceRef = useRef<CustomEventSource | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    // Initialize SSE connection for like count updates
    const eventSource = new CustomEventSource(
        `${API_BASE_URL}/recipes/${recipeId}/stars`
    );

    eventSourceRef.current = eventSource;

    eventSource.addEventListener('count', (event: unknown) => {
      if (mountedRef.current) {
        const eventData = event as { data: string };
        const count = parseInt(eventData.data, 10);
        if (!isNaN(count)) {
          setLikeCount(count);
        }
      }
    });

    eventSource.connect();

    // Initial fetch for favorite status
    const checkIsFavorite = async () => {
      if (!session?.user?.id) return;

      try {
        const favorites = await favoritesApi.getMyFavorites();
        const isCurrentlyFavorite = favorites?.some?.(
            (favorite) => favorite.recipe.id === recipeId
        ) ?? false;
        setIsFavorite(isCurrentlyFavorite);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    checkIsFavorite();

    return () => {
      mountedRef.current = false;
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
    };
  }, [recipeId, session]);

  const toggleFavorite = async () => {
    if (!session) {
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await favoritesApi.removeFavorite(session.user.id, recipeId);
        setIsFavorite(false);
      } else {
        await favoritesApi.addFavorite(session.user.id, recipeId);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  const baseButtonClasses = "focus:outline-none hover:cursor-pointer flex items-center gap-1";
  const variantClasses = variant === 'contained'
      ? "bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
      : "text-orange-500 hover:text-orange-700";

  return (
      <button
          onClick={toggleFavorite}
          disabled={loading}
          className={`${baseButtonClasses} ${variantClasses}`}
      >
        {isFavorite ? (
            <HeartSolidIcon className="h-6 w-6 text-orange-500" />
        ) : (
            <HeartIcon className="h-6 w-6 text-orange-500" />
        )}

        {likeCount !== null && (
            <span className="text-sm">
          {likeCount}
        </span>
        )}
      </button>
  );
};

export default FavoriteButton;