import mongoose, { Mongoose } from 'mongoose';

const mongoUrl = process.env.MONGO_DATABASE_URL || 'mongodb://127.0.0.1:27017/school-inventory';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */

// Add mongoose to the global type definition
declare global {
  var mongoose: {
    promise: Promise<Mongoose> | null;
    conn: Mongoose | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToMongo(): Promise<typeof mongoose> {
  if (cached.conn) {
    console.log('Menggunakan koneksi MongoDB dari cache.');
    // The return type is `typeof mongoose`, so we return the imported mongoose instance
    // which is already connected.
    return mongoose;
  }

  if (!cached.promise) {
    console.log('Membuat koneksi baru ke MongoDB.');
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(mongoUrl, opts);
  }
  cached.conn = await cached.promise; // The promise resolves to the mongoose instance
  return mongoose;
}

// Inventory schema & model
const inventorySchema = new mongoose.Schema({
  noData: { type: String },
  jenisBarang: { type: String, default: '-' },
  indukNoBarang: { type: String, default: '-' },
  indukHurufBarang: { type: String, default: '-' },
  subJenisBarang: { type: String, default: '-' },
  merkTipe: { type: String, default: '-' },
  subKodeJenis: { type: String, default: '-' },
  urutSubBarang: { type: String, default: '-' },
  sumberDana: { type: String, default: '-' },
  urutBarangDana: { type: String, default: '-' },
  areaRuang: { type: String, default: '-' },
  subAreaRuang: { type: String, default: '-' },
  tanggalPengadaan: { type: Date, default: null },
  supplier: { type: String, default: '-' },
  harga: { type: Number, default: 0 },
  statusPengadaan: { type: String, default: '-' },
  statusBarang: { type: String, default: 'aktif' },
  tanggalHapus: { type: Date, default: null },
  kodeVerifikasiBarang: { type: String, default: '-' },
  kodeVerifikasiDana: { type: String, default: '-' },
  kodeRekapTotal: { type: String, default: '-' },
  kodeRekapHapus: { type: String, default: '-' },
  kodeRekapDana: { type: String, default: '-' },
  jumlah: { type: Number, default: 1 },
  satuan: { type: String, default: 'buah' },
  kondisi: { type: String, default: 'Baik' },
  keterangan: { type: String, default: '-' },
}, { timestamps: true });

export function getInventoryModel() {
  return mongoose.models.Inventory || mongoose.model('Inventory', inventorySchema);
}

// User schema & model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
}, { timestamps: true });

export function getUserModel() {
  return mongoose.models.User || mongoose.model('User', userSchema);
}