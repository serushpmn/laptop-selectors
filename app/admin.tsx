"use client";

import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Helpers
type ColumnDef<T> = {
  key: keyof T;
  label: string;
  type?: string;
  options?: any[];
};

type TableProps<T> = {
  title: string;
  data: T[];
  onAdd: (item: Partial<T>) => void;
  addFields: { key: keyof T; label: string; type?: string; options?: any[] }[];
  columns?: ColumnDef<T>[];
  pageSize?: number;
  totalCount?: number;
  serverSearch?: string;
  onServerSearchChange?: (search: string) => void;
  onEdit?: (id: any, row: any, done?: any) => void | Promise<void>;
  onDelete?: (id: any) => void | Promise<void>;
};

function deriveColumns<T>(rows: T[]): ColumnDef<T>[] {
  if (!rows || rows.length === 0) return [] as any;
  const keys = Object.keys(rows[0] as any);
  const ordered = [
    ...keys.filter((k) => k === "id"),
    ...keys.filter((k) => k !== "id"),
  ];
  return ordered.map((k) => ({ key: k as keyof T, label: String(k) }));
}

function SimpleTable<T extends { id?: any }>(
  props: TableProps<T> & {
    page?: number;
    pageCount?: number;
    onPageChange?: (page: number) => void;
    serverSearch?: string;
    onServerSearchChange?: (s: string) => void;
    onEdit?: (id: any, row: any, done?: any) => void | Promise<void>;
    onDelete?: (id: any) => void | Promise<void>;
  }
) {
  const {
    title,
    data,
    onAdd,
    addFields,
    columns,
    pageSize = 0,
    page = 0,
    pageCount = 1,
    onPageChange,
    serverSearch,
    onServerSearchChange,
    totalCount = 0,
  } = props;
  const [addRow, setAddRow] = useState<Partial<T>>({});
  const [editingId, setEditingId] = useState<any>(null);
  const [editRow, setEditRow] = useState<Partial<T>>({});
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState(serverSearch ?? "");
  useEffect(() => {
    if (serverSearch !== undefined) setSearch(serverSearch);
  }, [serverSearch]);
  const cols = useMemo<ColumnDef<T>[]>(
    () => columns ?? deriveColumns<T>(data),
    [columns, data]
  );
  // Filter by name if search is set (client-side only when serverSearch is undefined)
  const filtered = useMemo(() => {
    if (serverSearch !== undefined) return data;
    if (!search) return data;
    const nameCol = cols.find((c) => c.key === "name");
    if (!nameCol) return data;
    return data.filter((row) => {
      const val = (row as any)["name"];
      return val && val.toString().toLowerCase().includes(search.toLowerCase());
    });
  }, [search, data, cols, serverSearch]);
  // Sort
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a: any, b: any) => {
      const va = a[sortKey as keyof T];
      const vb = b[sortKey as keyof T];
      if (va == null) return 1;
      if (vb == null) return -1;
      if (va === vb) return 0;
      if (sortDir === "asc") return va > vb ? 1 : -1;
      return va < vb ? 1 : -1;
    });
  }, [filtered, sortKey, sortDir]);

  const renderCell = (value: any) => {
    if (value == null) return "";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  return (
    <div className="mb-10 bg-white rounded-xl shadow p-6">
      <h2 className="font-bold text-xl mb-4 text-gray-800">{title}</h2>
      {/* Add section moved to top */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {addFields.map((field) => {
          // For searchable select
          const [search, setSearch] = React.useState("");
          const [showDropdown, setShowDropdown] = React.useState(false);
          let filteredOptions = field.options;
          if (field.type === "select" && search.length >= 2) {
            filteredOptions = field.options?.filter((opt: any) =>
              (opt.name ?? opt)
                .toString()
                .toLowerCase()
                .includes(search.toLowerCase())
            );
          }
          return (
            <span key={String(field.key)} className="relative">
              {field.type === "select" ? (
                <>
                  <input
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-w-[120px]"
                    placeholder={field.label + " (جستجو...)"}
                    value={
                      search.length > 0
                        ? search
                        : (addRow[field.key] as any) ?? ""
                    }
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                  />
                  {showDropdown && search.length >= 2 && (
                    <div className="absolute z-10 bg-white border rounded shadow w-full max-h-40 overflow-auto text-xs mt-1">
                      {filteredOptions?.length ? (
                        filteredOptions.map((opt: any) => (
                          <div
                            key={String(opt.id ?? opt)}
                            className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                            onMouseDown={() => {
                              setAddRow((r) => ({
                                ...r,
                                [field.key]: opt.id ?? opt,
                              }));
                              setSearch("");
                              setShowDropdown(false);
                            }}
                          >
                            {String(opt.name ?? opt)}
                          </div>
                        ))
                      ) : (
                        <div className="px-2 py-1 text-gray-400">یافت نشد</div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <input
                  className="h-8 rounded-md border border-input bg-background px-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  type={field.type || "text"}
                  placeholder={field.label}
                  value={(addRow[field.key] as any) ?? ""}
                  onChange={(e) =>
                    setAddRow((r) => ({ ...r, [field.key]: e.target.value }))
                  }
                />
              )}
            </span>
          );
        })}
        <button
          className="h-10 px-6 rounded-lg bg-green-500 text-white text-sm font-semibold shadow hover:bg-green-600 transition"
          onClick={() => {
            onAdd(addRow);
            setAddRow({});
          }}
        >
          افزودن
        </button>
      </div>
      {/* Search section below add section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 border-b pb-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="جستجو..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (onServerSearchChange) onServerSearchChange(e.target.value);
              }}
            />
          </div>
          <button className="h-10 px-4 rounded-lg border border-gray-200 bg-white text-gray-600 flex items-center gap-1 text-sm hover:bg-gray-100">
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
            فیلتر
          </button>
          <button className="h-10 px-4 rounded-lg border border-gray-200 bg-white text-gray-600 flex items-center gap-1 text-sm hover:bg-gray-100">
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
            مرتب‌سازی
          </button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {cols.map((c) => (
                <TableHead
                  key={String(c.key)}
                  className="whitespace-nowrap cursor-pointer select-none px-4 py-2 text-gray-700 text-sm font-semibold border-b border-gray-100"
                  onClick={() => {
                    if (sortKey === c.key)
                      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                    else {
                      setSortKey(c.key);
                      setSortDir("asc");
                    }
                  }}
                >
                  {c.label}
                  {sortKey === c.key && (sortDir === "asc" ? " ▲" : " ▼")}
                </TableHead>
              ))}
              <TableHead className="text-gray-700 text-sm font-semibold border-b border-gray-100">
                عملیات
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((row, i) => {
              const isEditing = editingId === (row as any).id;
              return (
                <TableRow key={(row as any).id ?? i}>
                  {cols.map((c) => (
                    <TableCell key={String(c.key)}>
                      {isEditing ? (
                        <input
                          className="h-7 rounded border px-1 text-xs min-w-[60px]"
                          type={
                            typeof (row as any)[c.key] === "number"
                              ? "number"
                              : "text"
                          }
                          value={editRow[c.key] ?? (row as any)[c.key] ?? ""}
                          onChange={(e) =>
                            setEditRow((r) => ({
                              ...r,
                              [c.key]: e.target.value,
                            }))
                          }
                          disabled={c.key === "id"}
                        />
                      ) : (
                        renderCell((row as any)[c.key as any])
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    {isEditing ? (
                      <div className="flex gap-1">
                        <button
                          className="h-8 w-8 flex items-center justify-center rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition"
                          title="ذخیره"
                          onClick={async () => {
                            if (!editRow) return;
                            if (typeof (row as any).id !== "undefined") {
                              await props.onEdit?.(
                                (row as any).id,
                                editRow,
                                () => setEditingId(null)
                              );
                            }
                          }}
                        >
                          <svg
                            width="18"
                            height="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </button>
                        <button
                          className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                          title="لغو"
                          onClick={() => {
                            setEditingId(null);
                            setEditRow({});
                          }}
                        >
                          <svg
                            width="18"
                            height="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <button
                          className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                          title="ویرایش"
                          onClick={() => {
                            setEditingId((row as any).id);
                            setEditRow(row);
                          }}
                        >
                          <svg
                            width="18"
                            height="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" />
                          </svg>
                        </button>
                        <button
                          className="h-8 w-8 flex items-center justify-center rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition"
                          title="حذف"
                          onClick={async () => {
                            if (
                              window.confirm(
                                "آیا برای حذف این مورد مطمئن هستید؟"
                              )
                            ) {
                              if (typeof (row as any).id !== "undefined") {
                                await props.onDelete?.((row as any).id);
                              }
                            }
                          }}
                        >
                          <svg
                            width="18"
                            height="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {sorted.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={cols.length + 1 || 1}
                  className="text-center text-xs text-muted-foreground"
                >
                  داده‌ای یافت نشد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableCaption className="text-[11px]">
            نمایش اطلاعات جدول
          </TableCaption>
        </Table>
      </div>
      {pageSize > 0 && pageCount > 1 && (
        <div className="flex items-center justify-between gap-2 my-2 text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <button
              className="h-8 w-8 flex items-center justify-center rounded-md border bg-white shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={page === 0}
              onClick={() => onPageChange && onPageChange(page - 1)}
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
            <span>
              Page <span className="font-semibold">{page + 1}</span> of{" "}
              <span className="font-semibold">{pageCount}</span>
            </span>
            <button
              className="h-8 w-8 flex items-center justify-center rounded-md border bg-white shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={page >= pageCount - 1}
              onClick={() => onPageChange && onPageChange(page + 1)}
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <select className="h-8 rounded-md border bg-white px-2 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-300">
              <option>10 rows</option>
              <option>20 rows</option>
              <option>50 rows</option>
              <option>100 rows</option>
            </select>
            <span className="text-xs font-semibold">
              {totalCount.toLocaleString()} records
            </span>
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2 mt-6">
        {addFields.map((field) => {
          // For searchable select
          const [search, setSearch] = React.useState("");
          const [showDropdown, setShowDropdown] = React.useState(false);
          let filteredOptions = field.options;
          if (field.type === "select" && search.length >= 2) {
            filteredOptions = field.options?.filter((opt: any) =>
              (opt.name ?? opt)
                .toString()
                .toLowerCase()
                .includes(search.toLowerCase())
            );
          }
          return (
            <span key={String(field.key)} className="relative">
              {field.type === "select" ? (
                <>
                  <input
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-w-[120px]"
                    placeholder={field.label + " (جستجو...)"}
                    value={
                      search.length > 0
                        ? search
                        : (addRow[field.key] as any) ?? ""
                    }
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                  />
                  {showDropdown && search.length >= 2 && (
                    <div className="absolute z-10 bg-white border rounded shadow w-full max-h-40 overflow-auto text-xs mt-1">
                      {filteredOptions?.length ? (
                        filteredOptions.map((opt: any) => (
                          <div
                            key={String(opt.id ?? opt)}
                            className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                            onMouseDown={() => {
                              setAddRow((r) => ({
                                ...r,
                                [field.key]: opt.id ?? opt,
                              }));
                              setSearch("");
                              setShowDropdown(false);
                            }}
                          >
                            {String(opt.name ?? opt)}
                          </div>
                        ))
                      ) : (
                        <div className="px-2 py-1 text-gray-400">یافت نشد</div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <input
                  className="h-8 rounded-md border border-input bg-background px-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  type={field.type || "text"}
                  placeholder={field.label}
                  value={(addRow[field.key] as any) ?? ""}
                  onChange={(e) =>
                    setAddRow((r) => ({ ...r, [field.key]: e.target.value }))
                  }
                />
              )}
            </span>
          );
        })}
        <button
          className="h-10 px-6 rounded-lg bg-green-500 text-white text-sm font-semibold shadow hover:bg-green-600 transition"
          onClick={() => {
            onAdd(addRow);
            setAddRow({});
          }}
        >
          افزودن
        </button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const PAGE_SIZE = 20;
  const [cpus, setCpus] = useState<any[]>([]); // current page
  const [cpuCount, setCpuCount] = useState(0);
  const [cpuPage, setCpuPage] = useState(0);
  const [gpus, setGpus] = useState<any[]>([]); // current page
  const [gpuCount, setGpuCount] = useState(0);
  const [gpuPage, setGpuPage] = useState(0);
  const [programs, setPrograms] = useState<any[]>([]);
  const [laptops, setLaptops] = useState<any[]>([]);
  const [tab, setTab] = useState<"cpu" | "gpu" | "programs" | "laptops">("cpu");
  const [cpuSearch, setCpuSearch] = useState("");
  const [gpuSearch, setGpuSearch] = useState("");
  // For select/autocomplete fields: always fetch all CPUs/GPUs for options
  const [allCpus, setAllCpus] = useState<any[]>([]);
  const [allGpus, setAllGpus] = useState<any[]>([]);

  // Fetch all CPUs/GPUs for select fields (only once)
  useEffect(() => {
    (async () => {
      const { data: allCpuData } = await supabase.from("cpus").select("*");
      setAllCpus(allCpuData ?? []);
      const { data: allGpuData } = await supabase.from("gpus").select("*");
      setAllGpus(allGpuData ?? []);
    })();
  }, []);
  // Server-side pagination for CPUs
  useEffect(() => {
    if (tab !== "cpu") return;
    (async () => {
      const from = cpuPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      let query = supabase.from("cpus").select("*", { count: "exact" });
      if (cpuSearch) query = query.ilike("name", `%${cpuSearch}%`);
      const { data, count } = await query.range(from, to);
      setCpus(data ?? []);
      setCpuCount(count ?? 0);
    })();
  }, [cpuPage, tab, cpuSearch]);

  // Server-side pagination for GPUs
  useEffect(() => {
    if (tab !== "gpu") return;
    (async () => {
      const from = gpuPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      let query = supabase.from("gpus").select("*", { count: "exact" });
      if (gpuSearch) query = query.ilike("name", `%${gpuSearch}%`);
      const { data, count } = await query.range(from, to);
      setGpus(data ?? []);
      setGpuCount(count ?? 0);
    })();
  }, [gpuPage, tab, gpuSearch]);

  // Programs and Laptops (no server-side pagination needed)
  useEffect(() => {
    (async () => {
      const [progRes, lapRes] = await Promise.all([
        supabase.from("programs").select("*"),
        supabase.from("laptops").select("*"),
      ]);
      setPrograms(progRes.data ?? []);
      setLaptops(lapRes.data ?? []);
    })();
  }, []);

  const addCpu = async (row: any) => {
    if (!row.name) return;
    const toNumber = (v: any) => (v === "" || v == null ? null : Number(v));
    const payload: any = {
      name: row.name,
      benchmark_cpu: toNumber(row.benchmark_cpu),
      integrated_gpu_id: toNumber(row.integrated_gpu_id),
      rank_cpu: toNumber(row.rank_cpu),
    };
    Object.keys(payload).forEach(
      (k) => payload[k] === undefined && delete payload[k]
    );
    await supabase.from("cpus").insert([payload]);
    // Refresh current page
    const from = cpuPage * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data, count } = await supabase
      .from("cpus")
      .select("*", { count: "exact" })
      .range(from, to);
    setCpus(data ?? []);
    setCpuCount(count ?? 0);
  };
  const addGpu = async (row: any) => {
    if (!row.name) return;
    const toNumber = (v: any) => (v === "" || v == null ? null : Number(v));
    const payload: any = {
      name: row.name,
      benchmark_gpu: toNumber(row.benchmark_gpu),
      rank_gpu: toNumber(row.rank_gpu),
    };
    Object.keys(payload).forEach(
      (k) => payload[k] === undefined && delete payload[k]
    );
    await supabase.from("gpus").insert([payload]);
    // Refresh current page
    const from = gpuPage * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data, count } = await supabase
      .from("gpus")
      .select("*", { count: "exact" })
      .range(from, to);
    setGpus(data ?? []);
    setGpuCount(count ?? 0);
  };
  const addProgram = async (row: any) => {
    if (!row.name) return;
    const toNumber = (v: any) => (v === "" || v == null ? null : Number(v));
    const payload: any = {
      name: row.name,
      version: row.version,
      category: row.category,
      cpu_min: toNumber(row.cpu_min),
      cpu_rec: toNumber(row.cpu_rec),
      gpu_min: toNumber(row.gpu_min),
      gpu_rec: toNumber(row.gpu_rec),
      ram_min_gb: toNumber(row.ram_min_gb),
      ram_rec_gb: toNumber(row.ram_rec_gb),
    };
    Object.keys(payload).forEach(
      (k) => payload[k] === undefined && delete payload[k]
    );
    const { data } = await supabase.from("programs").insert([payload]).select();
    if (data) setPrograms((prev) => [...prev, ...data]);
  };
  const addLaptop = async (row: any) => {
    if (!row.name || !row.url) return;
    const { data } = await supabase.from("laptops").insert([row]).select();
    if (data) setLaptops((prev) => [...prev, ...data]);
  };

  // --- CRUD handlers ---
  async function handleAdd(
    table: string,
    data: any[],
    form: any,
    setForm: (f: any) => void,
    fetchData: () => void,
    supabase: any
  ) {
    if (!data[0]) return;
    const insertData: any = {};
    Object.keys(data[0]).forEach((key) => {
      if (
        key !== "id" &&
        key !== "created_at" &&
        form[key] !== undefined &&
        form[key] !== ""
      ) {
        insertData[key] = form[key];
      }
    });
    if (Object.keys(insertData).length === 0) {
      alert("لطفا حداقل یک مقدار وارد کنید.");
      return;
    }
    const { error } = await supabase.from(table).insert([insertData]);
    if (!error) {
      setForm({});
      fetchData();
    } else {
      console.error("Error adding data:", error);
      alert(`Error adding: ${error.message}`);
    }
  }

  async function handleEdit(
    table: string,
    id: number,
    form: any,
    setEditingId: (id: number | null) => void,
    setForm: (f: any) => void,
    fetchData: () => void,
    supabase: any
  ) {
    const updateData = { ...form };
    delete updateData.id;
    delete updateData.created_at;
    const { error } = await supabase
      .from(table)
      .update(updateData)
      .eq("id", id);
    if (!error) {
      setEditingId(null);
      setForm({});
      fetchData();
    } else {
      console.error("Error updating data:", error);
      alert(`Error updating: ${error.message}`);
    }
  }

  async function handleDelete(
    table: string,
    id: number,
    fetchData: () => void,
    supabase: any
  ) {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (!error) {
      fetchData();
    } else {
      console.error("Error deleting data:", error);
      alert(`Error deleting: ${error.message}`);
    }
  }
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">پنل مدیریت</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={`inline-flex h-8 items-center justify-center rounded-md border px-3 text-xs font-medium shadow-sm ${
            tab === "cpu"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
          onClick={() => setTab("cpu")}
        >
          CPU
        </button>
        <button
          className={`inline-flex h-8 items-center justify-center rounded-md border px-3 text-xs font-medium shadow-sm ${
            tab === "gpu"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
          onClick={() => setTab("gpu")}
        >
          GPU
        </button>
        <button
          className={`inline-flex h-8 items-center justify-center rounded-md border px-3 text-xs font-medium shadow-sm ${
            tab === "programs"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
          onClick={() => setTab("programs")}
        >
          Programs
        </button>
        <button
          className={`inline-flex h-8 items-center justify-center rounded-md border px-3 text-xs font-medium shadow-sm ${
            tab === "laptops"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
          onClick={() => setTab("laptops")}
        >
          Laptops
        </button>
      </div>

      {tab === "cpu" && (
        <SimpleTable
          title="پردازنده‌ها (CPU)"
          columns={[
            { key: "id" as any, label: "ID" },
            { key: "name" as any, label: "نام" },
            { key: "benchmark_cpu" as any, label: "امتیاز بنچمارک CPU" },
            { key: "integrated_gpu_id" as any, label: "GPU یکپارچه" },
            { key: "rank_cpu" as any, label: "رتبه CPU" },
          ]}
          data={cpus}
          onAdd={addCpu}
          addFields={[
            { key: "name" as any, label: "نام" },
            {
              key: "benchmark_cpu" as any,
              label: "امتیاز بنچمارک CPU",
              type: "number",
            },
            {
              key: "integrated_gpu_id" as any,
              label: "GPU یکپارچه",
              type: "select",
              options: allGpus,
            },
            { key: "rank_cpu" as any, label: "رتبه CPU", type: "number" },
          ]}
          pageSize={PAGE_SIZE}
          page={cpuPage}
          pageCount={Math.max(1, Math.ceil(cpuCount / PAGE_SIZE))}
          totalCount={cpuCount}
          onPageChange={setCpuPage}
          serverSearch={cpuSearch}
          onServerSearchChange={(s) => {
            setCpuSearch(s);
            setCpuPage(0);
          }}
          onEdit={async (id, row, done) => {
            // ویرایش CPU
            const toNumber = (v: any) =>
              v === "" || v == null ? null : Number(v);
            const payload: any = {
              name: row.name,
              benchmark_cpu: toNumber(row.benchmark_cpu),
              integrated_gpu_id: toNumber(row.integrated_gpu_id),
              rank_cpu: toNumber(row.rank_cpu),
            };
            await supabase.from("cpus").update(payload).eq("id", id);
            // Refresh current page
            const from = cpuPage * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;
            const { data, count } = await supabase
              .from("cpus")
              .select("*", { count: "exact" })
              .range(from, to);
            setCpus(data ?? []);
            setCpuCount(count ?? 0);
            done?.();
          }}
          onDelete={async (id) => {
            await supabase.from("cpus").delete().eq("id", id);
            // Refresh current page
            const from = cpuPage * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;
            const { data, count } = await supabase
              .from("cpus")
              .select("*", { count: "exact" })
              .range(from, to);
            setCpus(data ?? []);
            setCpuCount(count ?? 0);
          }}
        />
      )}

      {tab === "gpu" && (
        <SimpleTable
          title="کارت گرافیک (GPU)"
          columns={[
            { key: "id" as any, label: "ID" },
            { key: "name" as any, label: "نام" },
            { key: "benchmark_gpu" as any, label: "امتیاز بنچمارک GPU" },
            { key: "rank_gpu" as any, label: "رتبه GPU" },
          ]}
          data={gpus}
          onAdd={addGpu}
          addFields={[
            { key: "name" as any, label: "نام" },
            {
              key: "benchmark_gpu" as any,
              label: "امتیاز بنچمارک GPU",
              type: "number",
            },
            { key: "rank_gpu" as any, label: "رتبه GPU", type: "number" },
          ]}
          pageSize={PAGE_SIZE}
          page={gpuPage}
          pageCount={Math.max(1, Math.ceil(gpuCount / PAGE_SIZE))}
          totalCount={gpuCount}
          onPageChange={setGpuPage}
          serverSearch={gpuSearch}
          onServerSearchChange={(s) => {
            setGpuSearch(s);
            setGpuPage(0);
          }}
          onEdit={async (id, row, done) => {
            const toNumber = (v: any) =>
              v === "" || v == null ? null : Number(v);
            const payload: any = {
              name: row.name,
              benchmark_gpu: toNumber(row.benchmark_gpu),
              rank_gpu: toNumber(row.rank_gpu),
            };
            await supabase.from("gpus").update(payload).eq("id", id);
            // Refresh current page
            const from = gpuPage * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;
            const { data, count } = await supabase
              .from("gpus")
              .select("*", { count: "exact" })
              .range(from, to);
            setGpus(data ?? []);
            setGpuCount(count ?? 0);
            done?.();
          }}
          onDelete={async (id) => {
            await supabase.from("gpus").delete().eq("id", id);
            // Refresh current page
            const from = gpuPage * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;
            const { data, count } = await supabase
              .from("gpus")
              .select("*", { count: "exact" })
              .range(from, to);
            setGpus(data ?? []);
            setGpuCount(count ?? 0);
          }}
        />
      )}

      {tab === "programs" && (
        <SimpleTable
          title="برنامه‌ها (Programs)"
          columns={[
            { key: "id" as any, label: "ID" },
            { key: "name" as any, label: "نام" },
            { key: "version" as any, label: "ورژن" },
            { key: "category" as any, label: "دسته‌بندی" },
            { key: "cpu_min" as any, label: "حداقل CPU" },
            { key: "cpu_rec" as any, label: "پیشنهادی CPU" },
            { key: "gpu_min" as any, label: "حداقل GPU" },
            { key: "gpu_rec" as any, label: "پیشنهادی GPU" },
            { key: "ram_min_gb" as any, label: "حداقل RAM (GB)" },
            { key: "ram_rec_gb" as any, label: "پیشنهادی RAM (GB)" },
          ]}
          data={programs}
          onAdd={addProgram}
          addFields={[
            { key: "name" as any, label: "نام" },
            { key: "version" as any, label: "ورژن" },
            { key: "category" as any, label: "دسته‌بندی" },
            {
              key: "cpu_min" as any,
              label: "حداقل CPU",
              type: "select",
              options: allCpus,
            },
            {
              key: "cpu_rec" as any,
              label: "پیشنهادی CPU",
              type: "select",
              options: allCpus,
            },
            {
              key: "gpu_min" as any,
              label: "حداقل GPU",
              type: "select",
              options: allGpus,
            },
            {
              key: "gpu_rec" as any,
              label: "پیشنهادی GPU",
              type: "select",
              options: allGpus,
            },
            {
              key: "ram_min_gb" as any,
              label: "حداقل RAM (GB)",
              type: "number",
            },
            {
              key: "ram_rec_gb" as any,
              label: "پیشنهادی RAM (GB)",
              type: "number",
            },
          ]}
          pageSize={20}
          totalCount={programs.length}
          onEdit={async (id, row, done) => {
            const toNumber = (v: any) =>
              v === "" || v == null ? null : Number(v);
            const payload: any = {
              name: row.name,
              version: row.version,
              category: row.category,
              cpu_min: toNumber(row.cpu_min),
              cpu_rec: toNumber(row.cpu_rec),
              gpu_min: toNumber(row.gpu_min),
              gpu_rec: toNumber(row.gpu_rec),
              ram_min_gb: toNumber(row.ram_min_gb),
              ram_rec_gb: toNumber(row.ram_rec_gb),
            };
            await supabase.from("programs").update(payload).eq("id", id);
            const { data } = await supabase.from("programs").select("*");
            setPrograms(data ?? []);
            done?.();
          }}
          onDelete={async (id) => {
            await supabase.from("programs").delete().eq("id", id);
            const { data } = await supabase.from("programs").select("*");
            setPrograms(data ?? []);
          }}
        />
      )}

      {tab === "laptops" && (
        <SimpleTable
          title="لپ‌تاپ‌ها (Laptops)"
          columns={[
            { key: "id" as any, label: "ID" },
            { key: "name" as any, label: "نام" },
            { key: "url" as any, label: "URL" },
            { key: "cpu_min" as any, label: "حداقل CPU" },
            { key: "gpu_min" as any, label: "حداقل GPU" },
          ]}
          data={laptops}
          onAdd={addLaptop}
          addFields={[
            { key: "name" as any, label: "نام" },
            { key: "url" as any, label: "URL" },
            {
              key: "cpu_min" as any,
              label: "حداقل CPU",
              type: "select",
              options: allCpus,
            },
            {
              key: "gpu_min" as any,
              label: "حداقل GPU",
              type: "select",
              options: allGpus,
            },
          ]}
          totalCount={laptops.length}
          onEdit={async (id, row, done) => {
            const payload: any = {
              name: row.name,
              url: row.url,
              cpu_min: row.cpu_min,
              gpu_min: row.gpu_min,
            };
            await supabase.from("laptops").update(payload).eq("id", id);
            const { data } = await supabase.from("laptops").select("*");
            setLaptops(data ?? []);
            done?.();
          }}
          onDelete={async (id) => {
            await supabase.from("laptops").delete().eq("id", id);
            const { data } = await supabase.from("laptops").select("*");
            setLaptops(data ?? []);
          }}
        />
      )}
    </div>
  );
}
