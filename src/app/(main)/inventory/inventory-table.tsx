"use client";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as XLSX from "xlsx";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { InventoryItem } from "@/types";
import { useAuth } from "@/components/auth-provider";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { columns as columnDefs } from "./columns";
import { PlusCircle, SlidersHorizontal, Trash2, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InventoryForm } from "./inventory-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  deleteInventoryItems,
  saveInventoryItemsBatch,
  getAllInventoryItems,
} from "@/lib/inventoryService";
import { useToast } from "@/hooks/use-toast";
import { inventoryItemSchema, headerMapping, headerOrder } from "@/types";

interface InventoryTableProps {
  data: InventoryItem[];
  refreshData: () => void;
}

const parseFlexibleDate = (value: any): Date | null => {
  if (!value || value === "-") return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;

  if (typeof value === "number" && value > 0) {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const jsDate = new Date(excelEpoch.getTime() + value * 86400000);
    return isNaN(jsDate.getTime()) ? null : jsDate;
  }

  if (typeof value === "string") {
    const date = new Date(value);
    if (!isNaN(date.getTime())) return date;
  }

  return null;
};

export function InventoryTable({
  data: initialData,
  refreshData,
}: InventoryTableProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "updatedAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  // Map initial data to add originalIndex
  const initialDataWithIndex = React.useMemo(
    () => initialData.map((item, index) => ({ ...item, originalIndex: index })),
    [initialData]
  );

  const [data, setData] = React.useState<InventoryItem[]>(initialDataWithIndex);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isClient, setIsClient] = React.useState(false);

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<InventoryItem | null>(
    null
  );

  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    React.useState(false);
  const [itemsToDelete, setItemsToDelete] = React.useState<string[]>([]);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setIsClient(true);
    setIsLoading(false);
  }, []);

  // Internal refresh function
  const internalRefreshData = async () => {
    setIsLoading(true);
    try {
      const fetchedData = await getAllInventoryItems();
      // Map fetched data to add originalIndex
      setData(
        fetchedData.map((item, index) => ({ ...item, originalIndex: index }))
      );
    } catch (error) {
      console.error("Gagal memuat data:", error);
      toast({
        variant: "destructive",
        title: "Gagal!",
        description: "Tidak dapat memuat data terbaru.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleAddNewItem = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleDeleteRequest = (itemIds: string[]) => {
    if (!itemIds || itemIds.length === 0) return;
    setItemsToDelete(itemIds.filter((id) => id));
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (itemsToDelete.length > 0) {
        await deleteInventoryItems(itemsToDelete);
        toast({
          title: "Sukses!",
          description: `${itemsToDelete.length} data berhasil dihapus.`,
        });
        table.resetRowSelection();
        await internalRefreshData(); // Refresh data setelah delete
      }
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      toast({
        variant: "destructive",
        title: "Gagal!",
        description: "Terjadi kesalahan saat menghapus data.",
      });
    } finally {
      setIsDeleting(false);
      setItemsToDelete([]);
      setIsConfirmDeleteDialogOpen(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const processAndSaveExcelData = async (fileData: ArrayBuffer) => {
    let importedItemsCount = 0;
    const errorLogs: string[] = [];
    try {
      const data = new Uint8Array(fileData);
      const workbook = XLSX.read(data, { type: "array", cellDates: true });
      const sheetName = workbook.SheetNames[0];
      if (!sheetName)
        throw new Error("File Excel tidak memiliki sheet yang valid.");

      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: null,
        range: 1,
      }) as (string | number | null)[][];

      if (json.length === 0) {
        toast({
          title: "File Kosong",
          description: "File Excel tidak berisi data.",
        });
        return;
      }

      const itemsToSave: InventoryItem[] = [];

      for (const [index, row] of json.entries()) {
        const rowIndex = index + 2;

        const noData = row[0] ? String(row[0]) : `INV-${Date.now()}-${index}`;
        let mappedRow: Partial<InventoryItem> = { noData };

        headerOrder.forEach((key, colIndex) => {
          const rawValue = row[colIndex + 1];
          let value: any;

          if (key === "harga" || key === "jumlah") {
            const numValue = parseFloat(String(rawValue));
            value = isNaN(numValue) ? 0 : numValue;
          } else if (key === "tanggalPengadaan" || key === "tanggalHapus") {
            value = parseFlexibleDate(rawValue);
          } else {
            value =
              rawValue === null ||
              rawValue === undefined ||
              String(rawValue).trim() === ""
                ? "-"
                : String(rawValue);
          }

          mappedRow[key as keyof InventoryItem] = value;
        });

        mappedRow.kondisi = mappedRow.kondisi || "Baik";
        mappedRow.statusBarang = mappedRow.statusBarang || "aktif";
        mappedRow.satuan = mappedRow.satuan || "buah";

        const parsed = inventoryItemSchema.safeParse(mappedRow);

        if (parsed.success) {
          const { data: values } = parsed;
          const finalItem: InventoryItem = {
            ...values,
            kodeVerifikasiBarang: `${values.indukHurufBarang || ""}.${
              values.subKodeJenis || ""
            }.${values.urutSubBarang || ""}`.replace(/^\.+|\.+$/g, ""),
            kodeVerifikasiDana: `${values.sumberDana || ""}.${
              values.urutBarangDana || ""
            }.${values.indukHurufBarang || ""}${
              values.subKodeJenis || ""
            }`.replace(/^\.+|\.+$/g, ""),
            kodeRekapTotal: `${values.indukHurufBarang || ""}${
              values.subKodeJenis || ""
            }`,
            kodeRekapDana: `${values.indukHurufBarang || ""}${
              values.subKodeJenis || ""
            }${values.sumberDana || ""}`,
            kodeRekapHapus:
              values.statusBarang === "dihapus"
                ? `${values.indukHurufBarang || ""}${
                    values.subKodeJenis || ""
                  }-HAPUS`
                : "-",
          };
          itemsToSave.push(finalItem);
        } else {
          const flatErrors = parsed.error.flatten();
          const errorMessages = Object.entries(flatErrors.fieldErrors)
            .map(
              ([field, messages]) =>
                `${(headerMapping as any)[field] || field}: ${messages.join(
                  ", "
                )}`
            )
            .join("; ");
          errorLogs.push(
            `Baris ${rowIndex}: Gagal validasi - ${errorMessages}`
          );
        }
      }

      if (itemsToSave.length > 0) {
        await saveInventoryItemsBatch(itemsToSave);
        importedItemsCount = itemsToSave.length;
      }

      if (errorLogs.length > 0) {
        console.error("Detail Kegagalan Impor:\n" + errorLogs.join("\n"));
        toast({
          variant: "destructive",
          title: "Beberapa Data Gagal Impor",
          description: `Lihat konsol browser (F12) untuk detail ${errorLogs.length} kegagalan.`,
          duration: 10000,
        });
      }

      if (importedItemsCount > 0) {
        toast({
          title: "Impor Selesai",
          description: `${importedItemsCount} dari ${json.length} data berhasil diimpor.`,
        });
      } else if (errorLogs.length === 0) {
        toast({
          variant: "destructive",
          title: "Impor Gagal",
          description:
            "Tidak ada data yang dapat diimpor dari file. Periksa format file Anda.",
        });
      }
    } catch (error: any) {
      console.error("Gagal memproses file:", error);
      toast({
        variant: "destructive",
        title: "Gagal Impor",
        description: error.message || "Terjadi kesalahan yang tidak diketahui.",
      });
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onerror = () => {
      toast({
        variant: "destructive",
        title: "Gagal Membaca File",
        description: "File mungkin rusak atau tidak dapat diakses.",
      });
      setIsImporting(false);
    };

    reader.onload = async (e) => {
      const fileData = e.target?.result;
      if (fileData instanceof ArrayBuffer) {
        await processAndSaveExcelData(fileData);
        await internalRefreshData(); // Refresh setelah import
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal membaca data file.",
        });
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
      setIsImporting(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const columns = React.useMemo<ColumnDef<InventoryItem>[]>(
    () => columnDefs,
    []
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const searchValue = String(filterValue).toLowerCase();
      const jenisBarang = String(
        row.getValue("jenisBarang") || ""
      ).toLowerCase();
      const merkTipe = String(row.getValue("merkTipe") || "").toLowerCase();
      const subJenisBarang = String(
        row.getValue("subJenisBarang") || ""
      ).toLowerCase();

      return (
        jenisBarang.includes(searchValue) ||
        merkTipe.includes(searchValue) ||
        subJenisBarang.includes(searchValue)
      );
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    meta: {
      userRole: user?.role,
      deleteItems: handleDeleteRequest,
      editItem: handleEditItem,
    },
  });

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedItem(null);
    internalRefreshData(); // Refresh data setelah form sukses
  };

  return (
    <div className="w-full flex-1 flex flex-col">
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Cari berdasarkan jenis barang, merk/tipe, atau sub jenis..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        {user?.role === "admin" && (
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              className="hidden"
              accept=".xlsx, .xls"
            />
            <Button
              onClick={handleImportClick}
              variant="outline"
              disabled={isImporting}
            >
              <Upload className="mr-2 h-4 w-4" />
              {isImporting ? "Mengimpor..." : "Impor Data"}
            </Button>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddNewItem}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Tambah Data
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {selectedItem
                      ? "Ubah Data Inventaris"
                      : "Tambah Data Inventaris Baru"}
                  </DialogTitle>
                </DialogHeader>
                <InventoryForm
                  onSuccess={handleFormSuccess}
                  initialData={selectedItem}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Tampilkan Kolom
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-96 overflow-y-auto">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {(headerMapping as Record<string, string>)[column.id] ||
                      column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        {table.getSelectedRowModel().rows.length > 0 &&
          user?.role === "admin" && (
            <Button
              variant="destructive"
              onClick={() => {
                const selectedIds = table
                  .getSelectedRowModel()
                  .rows.map((row) => row.original.noData)
                  .filter((id) => id);
                handleDeleteRequest(selectedIds as string[]);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus ({table.getSelectedRowModel().rows.length})
            </Button>
          )}
      </div>
      <Card className="flex-1">
        <CardContent className="p-0">
          <div className="relative overflow-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className={cn(
                            "whitespace-nowrap px-2 py-2 text-xs",
                            header.id === "select" &&
                              user?.role !== "admin" &&
                              "hidden"
                          )}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={table.getAllColumns().length}
                      className="h-24 text-center"
                    >
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : !isClient ? (
                  <TableRow>
                    <TableCell
                      colSpan={table.getAllColumns().length}
                      className="h-24 text-center"
                    />
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            "whitespace-nowrap px-2 py-1 text-xs",
                            cell.column.id === "select" &&
                              user?.role !== "admin" &&
                              "hidden"
                          )}
                        >
                          {flexRender(cell.column.columnDef.cell, {
                            ...cell.getContext(),
                            rowIndex: index,
                          })}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={table.getAllColumns().length}
                      className="h-24 text-center"
                    >
                      Tidak ada data.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center justify-start gap-4 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Berikutnya
          </Button>
        </div>
        <div
          className={cn(
            "text-sm text-muted-foreground",
            user?.role !== "admin" && "invisible"
          )}
        >
          <span className="ml-4">
            Halaman ke - {table.getState().pagination.pageIndex + 1} dari{" "}
            {table.getPageCount()}
          </span>
        </div>
      </div>
      <AlertDialog
        open={isConfirmDeleteDialogOpen}
        onOpenChange={setIsConfirmDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus {itemsToDelete.length} data barang
              secara permanen. Data yang sudah dihapus tidak dapat dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setIsConfirmDeleteDialogOpen(false)}
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Menghapus..." : "Ya, Hapus Data"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
