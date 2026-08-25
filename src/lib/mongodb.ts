import mongoose from "mongoose";

const mongoUrl =
  process.env.MONGO_DATABASE_URL ||
  "mongodb://127.0.0.1:27017/school-inventory";

let isConnected = false;

export async function connectToMongo(): Promise<typeof mongoose> {
  if (!isConnected) {
    await mongoose.connect(mongoUrl, {
      dbName: "school-inventory",
    });
    isConnected = true;
    console.log("Koneksi ke MongoDB (mongoose) berhasil!");
  }
  return mongoose;
}

// Inventory schema & model
const inventorySchema = new mongoose.Schema(
  {
    noData: { type: String },
    jenisBarang: { type: String, default: "-" },
    indukNoBarang: { type: String, default: "-" },
    indukHurufBarang: { type: String, default: "-" },
    subJenisBarang: { type: String, default: "-" },
    merkTipe: { type: String, default: "-" },
    subKodeJenis: { type: String, default: "-" },
    urutSubBarang: { type: String, default: "-" },
    sumberDana: { type: String, default: "-" },
    urutBarangDana: { type: String, default: "-" },
    areaRuang: { type: String, default: "-" },
    subAreaRuang: { type: String, default: "-" },
    tanggalPengadaan: { type: Date, default: null },
    supplier: { type: String, default: "-" },
    harga: { type: Number, default: 0 },
    statusPengadaan: { type: String, default: "-" },
    statusBarang: { type: String, default: "aktif" },
    tanggalHapus: { type: Date, default: null },
    kodeVerifikasiBarang: { type: String, default: "-" },
    kodeVerifikasiDana: { type: String, default: "-" },
    kodeRekapTotal: { type: String, default: "-" },
    kodeRekapHapus: { type: String, default: "-" },
    kodeRekapDana: { type: String, default: "-" },
    jumlah: { type: Number, default: 1 },
    satuan: { type: String, default: "buah" },
    kondisi: { type: String, default: "Baik" },
    keterangan: { type: String, default: "-" },
  },
  { timestamps: true }
);

export const Inventory =
  mongoose.models.Inventory || mongoose.model("Inventory", inventorySchema);
export function getInventoryModel() {
  return Inventory;
}

// User schema & model
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true }
);

export const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);
export function getUserModel() {
  return UserModel;
}
