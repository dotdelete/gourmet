import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://gourmet.cours.quimerch.com';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader) {
    return NextResponse.json(
      { error: 'Authorization header is required' },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': authHeader,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `API responded with status: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}
