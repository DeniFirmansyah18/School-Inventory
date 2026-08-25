import bcrypt from 'bcryptjs';
import { connectToMongo, getUserModel } from '@/lib/mongodb';
import type { User as UserType } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ success: false, message: 'Email dan password harus diisi.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await connectToMongo();
    const User = getUserModel();

    // Cari user berdasarkan email
    const user = await User.findOne({ email });

    if (!user) {
      return new Response(JSON.stringify({ success: false, message: 'Email atau password salah.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Bandingkan password
    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ success: false, message: 'Email atau password salah.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Kalau sukses, kembalikan data user (tanpa password)
    const { password: _, ...userData } = user.toObject();

    return new Response(JSON.stringify({ success: true, user: userData }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, message: 'Gagal login user.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
