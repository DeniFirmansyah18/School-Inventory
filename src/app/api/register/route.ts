import bcrypt from 'bcryptjs';
import { connectToMongo, getUserModel } from '@/lib/mongodb';
import type { User as UserType } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;
    const role: UserType['role'] = email === 'admin@sekolah.id' ? 'admin' : 'user';

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ success: false, message: 'Semua field harus diisi.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await connectToMongo();
    const User = getUserModel();

    const passwordHash = await bcrypt.hash(password, 10);

    await User.updateOne(
      { email },
      {
        $set: {
          name,
          password: passwordHash,
          role,
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, message: 'Gagal mendaftar user.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}