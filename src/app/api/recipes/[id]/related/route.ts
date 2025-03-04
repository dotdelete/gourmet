import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://gourmet.cours.quimerch.com';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}/related`, {
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

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching related recipes for ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch related recipes' },
      { status: 500 }
    );
  }
}
