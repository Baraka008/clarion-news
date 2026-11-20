export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { adminStorage } from '@/lib/server/firebaseAdmin';
import { requireEditor } from '@/lib/server/auth';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

export async function POST(request: NextRequest) {
  if (!(await requireEditor(request))) {
    return NextResponse.json({ error: 'You must be signed in as an editor to upload media.' }, { status: 401 });
  }

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Expected multipart/form-data.' }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: 'Choose an image file to upload.' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, WebP and AVIF images are accepted.' }, { status: 415 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Image must be 5 MB or smaller.' }, { status: 413 });
    }

    const extension = file.type.split('/')[1].replace('jpeg', 'jpg');
    const fileName = `uploads/${randomUUID()}.${extension}`;
    const bucket = adminStorage.bucket();
    const fileRef = bucket.file(fileName);
    const buffer = Buffer.from(await file.arrayBuffer());

    await fileRef.save(buffer, {
      resumable: false,
      metadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000, immutable',
      },
      public: true,
    });

    return NextResponse.json({
      url: `https://storage.googleapis.com/${bucket.name}/${fileName}`,
    });
  } catch (error) {
    console.error('Image upload failed:', error);
    return NextResponse.json({ error: 'Image upload failed. Check the storage configuration and try again.' }, { status: 500 });
  }
}
