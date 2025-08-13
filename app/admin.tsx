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

function SimpleTable<T extends { id?: any }>(props: TableProps<T>) {
  const { title, data, onAdd, addFields, columns, pageSize = 0 } = props;
  const [addRow, setAddRow] = useState<Partial<T>>({});
  const [page, setPage] = useState(0);

  const cols = useMemo<ColumnDef<T>[]>(
    () => columns ?? deriveColumns<T>(data),
    [columns, data]
  );
  const pageCount =
    pageSize > 0 ? Math.max(1, Math.ceil(data.length / pageSize)) : 1;
  const paged =
    pageSize > 0 ? data.slice(page * pageSize, (page + 1) * pageSize) : data;

  useEffect(() => {
    if (page > pageCount - 1) setPage(Math.max(0, pageCount - 1));
  }, [pageCount, page]);

  const renderCell = (value: any) => {
    if (value == null) return "";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  return (
    <div className="mb-10">
      <h2 className="font-bold text-lg mb-2">{title}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            {cols.map((c) => (
              <TableHead key={String(c.key)} className="whitespace-nowrap">
                {c.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.map((row, i) => (
            <TableRow key={(row as any).id ?? i}>
              {cols.map((c) => (
                <TableCell key={String(c.key)}>
                  {renderCell((row as any)[c.key as any])}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {paged.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={cols.length || 1}
                className="text-center text-xs text-muted-foreground"
              >
                داده‌ای یافت نشد
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableCaption className="text-[11px]">نمایش اطلاعات جدول</TableCaption>
      </Table>

      {pageSize > 0 && (
        <div className="flex items-center gap-2 my-2">
          <button
            className="btn btn-xs btn-secondary"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            قبلی
          </button>
          <span className="text-xs">
            صفحه {page + 1} از {pageCount}
          </span>
          <button
            className="btn btn-xs btn-secondary"
            disabled={page >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          >
            بعدی
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 mt-3">
        {addFields.map((field) => (
          <span key={String(field.key)}>
            {field.type === "select" ? (
              <select
                className="h-8 rounded-md border border-input bg-background px-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={(addRow[field.key] as any) ?? ""}
                onChange={(e) =>
                  setAddRow((r) => ({ ...r, [field.key]: e.target.value }))
                }
              >
                <option value="">انتخاب کنید</option>
                {field.options?.map((opt: any) => (
                  <option key={String(opt.id ?? opt)} value={opt.id ?? opt}>
                    {String(opt.name ?? opt)}
                  </option>
                ))}
              </select>
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
        ))}
        <button
          className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground shadow hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
  const [cpus, setCpus] = useState<any[]>([]);
  const [gpus, setGpus] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [laptops, setLaptops] = useState<any[]>([]);
  const [tab, setTab] = useState<"cpu" | "gpu" | "programs" | "laptops">("cpu");

  useEffect(() => {
    (async () => {
      const [cpuRes, gpuRes, progRes, lapRes] = await Promise.all([
        supabase.from("cpus").select("*"),
        supabase.from("gpus").select("*"),
        supabase.from("programs").select("*"),
        supabase.from("laptops").select("*"),
      ]);
      setCpus(cpuRes.data ?? []);
      setGpus(gpuRes.data ?? []);
      setPrograms(progRes.data ?? []);
      setLaptops(lapRes.data ?? []);
    })();
  }, []);

  const addCpu = async (row: any) => {
    if (!row.name) return;
    const { data } = await supabase.from("cpus").insert([row]).select();
    if (data) setCpus((prev) => [...prev, ...data]);
  };
  const addGpu = async (row: any) => {
    if (!row.name) return;
    const { data } = await supabase.from("gpus").insert([row]).select();
    if (data) setGpus((prev) => [...prev, ...data]);
  };
  const addProgram = async (row: any) => {
    if (!row.name) return;
    const { data } = await supabase.from("programs").insert([row]).select();
    if (data) setPrograms((prev) => [...prev, ...data]);
  };
  const addLaptop = async (row: any) => {
    if (!row.name || !row.url) return;
    const { data } = await supabase.from("laptops").insert([row]).select();
    if (data) setLaptops((prev) => [...prev, ...data]);
  };

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
          data={cpus}
          onAdd={addCpu}
          addFields={[{ key: "name" as any, label: "نام" }]}
          pageSize={20}
        />
      )}

      {tab === "gpu" && (
        <SimpleTable
          title="کارت گرافیک (GPU)"
          data={gpus}
          onAdd={addGpu}
          addFields={[{ key: "name" as any, label: "نام" }]}
          pageSize={20}
        />
      )}

      {tab === "programs" && (
        <SimpleTable
          title="برنامه‌ها (Programs)"
          columns={[
            { key: "id" as any, label: "ID" },
            { key: "name" as any, label: "نام" },
          ]}
          data={programs}
          onAdd={addProgram}
          addFields={[{ key: "name" as any, label: "نام" }]}
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
              options: cpus,
            },
            {
              key: "gpu_min" as any,
              label: "حداقل GPU",
              type: "select",
              options: gpus,
            },
          ]}
        />
      )}
    </div>
  );
}
