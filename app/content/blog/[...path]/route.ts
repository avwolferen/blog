import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Map file extensions to MIME types
const mimeTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.avif': 'image/avif',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;
  const filePath = path.join(process.cwd(), 'content', 'blog', ...pathSegments);

  // Security: Prevent directory traversal
  const resolvedPath = path.resolve(filePath);
  const contentDir = path.resolve(process.cwd(), 'content', 'blog');
  
  if (!resolvedPath.startsWith(contentDir)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Check if file exists
  if (!fs.existsSync(resolvedPath)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // Check if it's a file (not directory)
  const stat = fs.statSync(resolvedPath);
  if (!stat.isFile()) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // Get file extension and MIME type
  const ext = path.extname(resolvedPath).toLowerCase();
  const mimeType = mimeTypes[ext] || 'application/octet-stream';

  // Read and return the file
  const fileBuffer = fs.readFileSync(resolvedPath);
  
  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': mimeType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
