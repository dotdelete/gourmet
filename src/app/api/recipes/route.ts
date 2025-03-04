import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://gourmet.cours.quimerch.com';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes`, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `API responded with status: ${response.status}` },
        { status: response.status }
      );
    }

    console.log('API response:', response);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}
