import { NextRequest, NextResponse } from 'next/server';
import { connectToMongo, getInventoryModel } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    await connectToMongo();
    const Inventory = getInventoryModel();
    const items = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      );
    }

    const operations = items.map((item: any) => ({
      updateOne: {
        filter: {
          kodeVerifikasiBarang: item.kodeVerifikasiBarang
        },
        update: { $set: item },
        upsert: true
      }
    }));

    const result = await Inventory.bulkWrite(operations);

    return NextResponse.json({
      success: true,
      result,
      summary: {
        received: items.length,
        matched: result.matchedCount,
        modified: result.modifiedCount,
        upserted: result.upsertedCount,
        totalProcessed: result.matchedCount + result.upsertedCount
      }
    });
  } catch (error) {
    console.error('Failed to save inventory items batch:', error);
    return NextResponse.json(
      { error: 'Failed to save inventory items batch' },
      { status: 500 }
    );
  }
}