import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse('Not Found', { status: 404 });
  }

  try {
    const { slug } = await params;
    const filePath = path.join(process.cwd(), ...slug);
    
    // Safety check: ensure the path is within the project
    if (!filePath.startsWith(process.cwd())) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const content = await fs.readFile(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse('Not Found', { status: 404 });
  }

  try {
    const { slug } = await params;
    const filePath = path.join(process.cwd(), ...slug);
    
    if (!filePath.startsWith(process.cwd())) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const body = await request.json();
    
    // Format JSON with 2 spaces for readability
    await fs.writeFile(filePath, JSON.stringify(body, null, 2), 'utf-8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error writing file:', error);
    return NextResponse.json({ error: 'Failed to write file' }, { status: 500 });
  }
}
