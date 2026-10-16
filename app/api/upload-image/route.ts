import { NextRequest, NextResponse } from 'next/server';
import { getAdminStorage } from '@/lib/server/firebaseAdmin';

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
  }

  const storage = getAdminStorage();
  if (!storage) {
    return NextResponse.json(
      { error: 'Uploads need Firebase Storage. Add your Firebase keys to .env.local and restart the server.' },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get('file');
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 });
  }

  const bucket = storage.bucket();
  const fileName = `uploads/${Date.now()}-${file.name.replace(/[^\w.-]+/g, '-')}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await bucket.file(fileName).save(buffer, { contentType: file.type, public: true });

  return NextResponse.json({ url: `https://storage.googleapis.com/${bucket.name}/${fileName}` });
}
