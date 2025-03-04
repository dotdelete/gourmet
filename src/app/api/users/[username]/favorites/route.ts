import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://gourmet.cours.quimerch.com';

// Add a recipe to favorites
export async function POST(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  const username = params.username;
  const authHeader = request.headers.get('Authorization');
  const searchParams = request.nextUrl.searchParams;
  const recipeId = searchParams.get('recipeID');
  
  if (!authHeader) {
    return NextResponse.json(
      { error: 'Authorization header is required' },
      { status: 401 }
    );
  }

  if (!recipeId) {
    return NextResponse.json(
      { error: 'Recipe ID is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/users/${username}/favorites?recipeID=${recipeId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': authHeader,
        },
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
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    );
  }
}

// Remove a recipe from favorites
export async function DELETE(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  const username = params.username;
  const authHeader = request.headers.get('Authorization');
  const searchParams = request.nextUrl.searchParams;
  const recipeId = searchParams.get('recipeID');
  
  if (!authHeader) {
    return NextResponse.json(
      { error: 'Authorization header is required' },
      { status: 401 }
    );
  }

  if (!recipeId) {
    return NextResponse.json(
      { error: 'Recipe ID is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/users/${username}/favorites?recipeID=${recipeId}`,
      {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': authHeader,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `API responded with status: ${response.status}` },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}
