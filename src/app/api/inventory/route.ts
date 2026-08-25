import { connectToMongo, getInventoryModel } from '@/lib/mongodb';
import type { InventoryItem } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToMongo();
    const Inventory = getInventoryModel();
    const items = await Inventory.find({});
    return NextResponse.json(items);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToMongo();
    const Inventory = getInventoryModel();
    const item: InventoryItem = await req.json();
    delete (item as any)._id; // pastikan _id tidak ikut disimpan
    await Inventory.create(item);
    return NextResponse.json({ message: 'Data berhasil disimpan' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToMongo();
    const Inventory = getInventoryModel();
    const { noDataIds }: { noDataIds: string[] } = await req.json();
    await Inventory.deleteMany({ noData: { $in: noDataIds } });
    return NextResponse.json({ message: `${noDataIds.length} data berhasil dihapus` });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Gagal menghapus data' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToMongo();
    const Inventory = getInventoryModel();
    const item: InventoryItem = await req.json();

    if (!item.noData) {
      return NextResponse.json({ error: 'noData harus diisi' }, { status: 400 });
    }

    // Hapus _id agar tidak error duplicate
    delete (item as any)._id;

    const result = await Inventory.updateOne(
      { noData: item.noData },
      { $set: item }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Data tidak ditemukan, tidak diupdate.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Data berhasil diupdate' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Gagal update data' }, { status: 500 });
  }
}
