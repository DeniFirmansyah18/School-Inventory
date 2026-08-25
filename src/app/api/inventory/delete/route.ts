import { NextRequest, NextResponse } from 'next/server';
import { connectToMongo, getInventoryModel } from '@/lib/mongodb';

export async function DELETE(request: NextRequest) {
  try {
    await connectToMongo();
    const Inventory = getInventoryModel();
    const { noDataIds } = await request.json();

    if (!noDataIds || noDataIds.length === 0) {
      return NextResponse.json(
        { error: 'No IDs provided' },
        { status: 400 }
      );
    }

    const result = await Inventory.deleteMany({ noData: { $in: noDataIds } });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete inventory items' },
      { status: 500 }
    );
  }
}