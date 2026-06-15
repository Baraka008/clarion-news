import { NextRequest, NextResponse } from 'next/server';
import { adminStorage } from '@/lib/server/firebaseAdmin';

export async function POST(request: NextRequest) {
  const { headers } = request;
  const contentType = headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 });
  }

  const bucket = adminStorage.bucket();
  const fileName = `uploads/${Date.now()}-${file.name}`;
  const fileRef = bucket.file(fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fileRef.save(buffer, { contentType: file.type, public: true });
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

  return NextResponse.json({ url: publicUrl });
}
