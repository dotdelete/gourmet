import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://gourmet.cours.quimerch.com';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json(
      { error: 'Search query is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/search?q=${encodeURIComponent(query)}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `API responded with status: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error searching recipes:', error);
    return NextResponse.json(
      { error: 'Failed to search recipes' },
      { status: 500 }
    );
  }
}
