import useSWR from "swr";
import React, { useMemo, useState } from "react";

import CustomModal from "@/components/custom-modal";
import createNotification from "@/common/create-notification";
import { axiosApiRequest } from "@/utils/api";
import { useClients } from "@/context/context-collection";

import style from "./index.module.scss";

// =============================
// Self-contained UI (no extra UI libs)
// - Plain TailwindCSS
// - Lightweight custom Modal & Badge
// - Uses your own createNotification({ type, message })
// - Axios for all API calls via axiosApiRequest
// =============================

// TYPES
export type EmployeeOption = { value: string; label: string };

export type ScheduledNotification = {
  id: number;
  employeecode: string;
  title: string;
  body: string;
  day_of_week: string; // <— now stored as comma string e.g. "1,2,3" or "7"
  send_time: string; // HH:mm
  timezone: string;
  is_recurring: boolean;
  last_sent_at?: string | null;
  status: "active" | "paused";
  created_at?: string;
  updated_at?: string;
};

// The form uses an array for UI, converted to string on submit
type FormState = Omit<
  ScheduledNotification,
  "id" | "created_at" | "updated_at" | "last_sent_at" | "day_of_week"
> & {
  day_of_week: number[]; // [0..6] or [7] for Everyday
};

const DOW: { value: number; label: string }[] = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];
const DOW_WITH_EVERYDAY = [...DOW, { value: 7, label: "Every day" }];

const dowLabel = (n: number) => DOW_WITH_EVERYDAY.find((d) => d.value === n)?.label ?? String(n);

// --- Helpers to convert day strings <-> arrays ---
function parseDaysString(s: string | undefined | null): number[] {
  if (!s) return [];
  return s
    .split(",")
    .map((x) => parseInt(x.trim(), 10))
    .filter((n) => Number.isInteger(n));
}

// If 7 is selected, we send exactly "7"; otherwise join unique 0..6
function stringifyDays(arr: number[]): string {
  if (arr.includes(7)) return "7";
  const uniq = Array.from(new Set(arr.filter((n) => n >= 0 && n <= 6))).sort((a, b) => a - b);
  return uniq.join(",");
}

// Human-readable label for table cell
function labelFromDaysString(s: string): string {
  const arr = parseDaysString(s);
  if (arr.includes(7)) return "Every day";
  if (!arr.length) return "-";
  return arr.map(dowLabel).join(", ");
}

const emptyForm: FormState = {
  employeecode: "",
  title: "",
  body: "",
  day_of_week: [1], // Monday default
  send_time: "09:30",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  is_recurring: true,
  status: "active",
};

// Axios helpers
const swrFetcher = async (url: string) => {
  const res = await axiosApiRequest({ method: "get", url });
  return (res && (res.data ?? res)) as any;
};

async function api<T>(
  method: "get" | "post" | "patch" | "put" | "delete",
  url: string,
  data?: any,
): Promise<T> {
  const res = await axiosApiRequest({ method, url, data });
  return (res && res) as T;
}

// --- Time validation helpers (HH:mm) ---
function normalizeToHHmm(value: string): string | null {
  if (!value) return null;
  const s = value.trim();

  // 12h strings like "1:36 AM" / "01:36pm"
  const lower = s.toLowerCase();
  const hasAmPm = lower.includes("am") || lower.includes("pm");
  if (hasAmPm) {
    const am = lower.includes("am");
    const cleaned = lower.replace(/am|pm/gi, "").trim();
    const parts = cleaned.split(":");
    if (parts.length < 2) return null;
    let h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    if (!am && h !== 12) h += 12; // PM
    if (am && h === 12) h = 0; // 12 AM -> 00
    if (h < 0 || h > 23 || m < 0 || m > 59) return null;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  // HH:mm[:ss] or H:mm[:ss]
  const parts = s.split(":");
  if (parts.length < 2) return null;
  let h = parseInt(parts[0], 10);
  let m = parseInt(parts[1], 10);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

interface Props {
  employeeOptions?: EmployeeOption[]; // not used (derived from context)
  apiBase?: string; // default "/api"
}

export default function ScheduledNotificationsModule({}: Props) {
  const context = useClients();
  const allEmployees = context ? context?.allEmployees : [];

  const employeeOptions: EmployeeOption[] =
    allEmployees?.map((data: any) => ({
      value: data?.employeecode,
      label: data?.name,
    })) || [];

  const [query, setQuery] = useState<{
    employeecode?: string;
    status?: string;
    day_of_week?: number; // single value for filter (works with FIND_IN_SET)
    page?: number;
    per_page?: number;
  }>({ per_page: 10, page: 1 });

  const listUrl = useMemo(() => {
    const p = new URLSearchParams();
    if (query.employeecode) p.set("employeecode", query.employeecode);
    if (query.status) p.set("status", query.status);
    if (query.day_of_week !== undefined) p.set("day_of_week", String(query.day_of_week));
    if (query.per_page) p.set("per_page", String(query.per_page));
    if (query.page) p.set("page", String(query.page));
    return `/scheduled-notifications?${p.toString()}`;
  }, [query]);

  const { data, isLoading, mutate } = useSWR(listUrl, swrFetcher);

  const items: ScheduledNotification[] = (data ?? data ?? []) as ScheduledNotification[];
  const meta = (data && (data.meta ?? data)) as any;

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ScheduledNotification | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [isDelete, setIsDelete] = useState({ loading: false, id: -1 });

  function resetForm() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(false);
  }

  function onEdit(item: ScheduledNotification) {
    setEditing(item);
    setForm({
      employeecode: item.employeecode,
      title: item.title,
      body: item.body,
      day_of_week: parseDaysString(item.day_of_week), // convert "1,2,3" or "7" -> array
      send_time: item.send_time,
      timezone: item.timezone,
      is_recurring: item.is_recurring,
      status: item.status,
    });
    setOpen(true);
  }

  const onSubmit = async () => {
    try {
      setSubmitting(true);

      // enforce HH:mm
      const cleaned = normalizeToHHmm(form.send_time);
      if (!cleaned) {
        createNotification({ type: "error", message: "Send time must be HH:mm (e.g., 09:30)." });
        setSubmitting(false);
        return;
      }

      // Require at least one selection
      if (!form.day_of_week || form.day_of_week.length === 0) {
        createNotification({ type: "error", message: "Please select at least one day." });
        setSubmitting(false);
        return;
      }

      const payload = {
        ...form,
        send_time: cleaned,
        day_of_week: stringifyDays(form.day_of_week), // "7" or "1,2,3"
      };

      if (editing) {
        await api("patch", `scheduled-notifications/${editing.id}`, payload);
        createNotification({ type: "success", message: "Schedule updated successfully." });
      } else {
        await api("post", `scheduled-notifications`, payload);
        createNotification({ type: "success", message: "Schedule created successfully." });
      }

      resetForm();
      mutate();
    } catch (e: any) {
      createNotification({ type: "error", message: e.message || "Action failed" });
    } finally {
      setSubmitting(false);
    }
  };

  async function onDelete(id: number) {
    try {
      setIsDelete({ id, loading: true });
      await api("delete", `/scheduled-notifications/${id}`);
      createNotification({ type: "success", message: "Schedule deleted." });
      setIsDelete({ id: -1, loading: false });
      mutate();
    } catch (e: any) {
      setIsDelete({ id: -1, loading: false });
      createNotification({ type: "error", message: e.message || "Delete failed" });
    }
  }

  async function onPause(id: number) {
    try {
      await api("patch", `/scheduled-notifications/${id}/pause`);
      createNotification({ type: "success", message: "Schedule paused." });
      mutate();
    } catch (e: any) {
      createNotification({ type: "error", message: e.message || "Pause failed" });
    }
  }

  async function onResume(id: number) {
    try {
      await api("patch", `/scheduled-notifications/${id}/resume`);
      createNotification({ type: "success", message: "Schedule resumed." });
      mutate();
    } catch (e: any) {
      createNotification({ type: "error", message: e.message || "Resume failed" });
    }
  }

  return (
    <div className="mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-normal tracking-tight">Scheduled Notifications</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => mutate()}
            className="rounded-md cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 text-sm font-medium shadow-sm transition-colors duration-200"
          >
            Refresh
          </button>
          <button
            onClick={() => {
              setEditing(null);
              setForm(emptyForm);
              setOpen(true);
            }}
            className="inline-flex items-center cursor-pointer rounded-md bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium shadow-sm transition-colors duration-200"
          >
            New Schedule
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid gap-4 rounded-lg border border-gray-200 bg-white p-4 md:p-6 mb-2 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Employee</label>
            <select
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={query.employeecode ?? ""}
              onChange={(e) =>
                setQuery((q) => ({ ...q, employeecode: e.target.value || undefined, page: 1 }))
              }
            >
              <option value="">All</option>
              {employeeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Status</label>
            <select
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={query.status ?? ""}
              onChange={(e) =>
                setQuery((q) => ({ ...q, status: e.target.value || undefined, page: 1 }))
              }
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
          </div>

          {/* Single-select Filter for Day of Week */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Day of Week</label>
            <select
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={query.day_of_week?.toString() ?? ""}
              onChange={(e) =>
                setQuery((q) => ({
                  ...q,
                  day_of_week: e.target.value ? Number(e.target.value) : undefined,
                  page: 1,
                }))
              }
            >
              <option value="">Any</option>
              {DOW_WITH_EVERYDAY.map((d) => (
                <option key={d.value} value={String(d.value)}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Per page</label>
            <select
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={(query.per_page ?? 10).toString()}
              onChange={(e) =>
                setQuery((q) => ({ ...q, per_page: Number(e.target.value), page: 1 }))
              }
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={String(n)}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div
          className={`${style.classGrid} grid-cols-12 gap-2 px-4 py-3 sm:text-lg text-xs font-medium text-gray-500 border-b border-gray-200`}
        >
          <div className="col-span-3">Employee</div>
          <div className="col-span-2">Title</div>
          <div className="col-span-2">Schedule</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>
        <div className="divide-y divide-gray-200">
          {isLoading && <div className="p-6 text-center text-gray-500">Loading…</div>}
          {!isLoading && items?.length === 0 && (
            <div className="p-6 text-center text-gray-500">No schedules found.</div>
          )}
          {items?.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-2 px-4 py-4 text-sm items-center hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="col-span-3">
                <div className="font-medium">
                  {employeeOptions.find((e) => e.value === item.employeecode)?.label ||
                    item.employeecode}
                </div>
                <div className="text-gray-500 text-xs">{item.employeecode}</div>
              </div>
              <div className="col-span-2">
                <div className="font-medium truncate max-w-[22ch]">{item.title}</div>
                <div className="text-gray-500 text-xs truncate max-w-[36ch]">{item.body}</div>
              </div>
              <div className="col-span-2">
                <div>
                  {labelFromDaysString(item.day_of_week)} • {item.send_time}
                </div>
                <div className="text-gray-500 text-xs">{item.timezone}</div>
              </div>
              <div className="col-span-2 space-x-2">
                {item.status === "active" ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Paused
                  </span>
                )}
                {item.is_recurring ? (
                  <span className="text-xs text-gray-500">Recurring</span>
                ) : (
                  <span className="text-xs text-gray-500">One-time</span>
                )}
                {item.last_sent_at && (
                  <div className="text-xs text-gray-500 mt-1">
                    Last sent: {new Date(item.last_sent_at).toLocaleString()}
                  </div>
                )}
              </div>
              <div className="col-span-3 md:justify-self-end flex gap-2">
                {item.status === "active" ? (
                  <button
                    onClick={() => onPause(item.id)}
                    className="rounded-md cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 text-sm font-medium shadow-sm transition-colors duration-200"
                  >
                    Pause
                  </button>
                ) : (
                  <button
                    onClick={() => onResume(item.id)}
                    className="rounded-md cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 text-sm font-medium shadow-sm transition-colors duration-200"
                  >
                    Resume
                  </button>
                )}
                <button
                  onClick={() => onEdit(item)}
                  className="rounded-md border border-gray-300 cursor-pointer px-3 py-2 text-sm font-medium hover:bg-gray-50 shadow-sm transition-colors duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="rounded-md bg-red-600 cursor-pointer hover:bg-red-700 text-white px-3 py-2 text-sm font-medium shadow-sm transition-colors duration-200"
                >
                  {isDelete?.loading && isDelete?.id === item.id ? "deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
        {meta?.links && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 text-sm">
            <div className="text-gray-500">
              Page {meta.current_page} of {meta.last_page}
            </div>
            <div className="flex gap-2">
              <button
                className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium disabled:opacity-50 cursor-pointer hover:bg-gray-50 shadow-sm transition-colors duration-200"
                disabled={!meta.prev_page_url}
                onClick={() => setQuery((q) => ({ ...q, page: Math.max(1, (q.page ?? 1) - 1) }))}
              >
                Prev
              </button>
              <button
                className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium disabled:opacity-50 cursor-pointer hover:bg-gray-50 shadow-sm transition-colors duration-200"
                disabled={!meta.next_page_url}
                onClick={() => setQuery((q) => ({ ...q, page: (q.page ?? 1) + 1 }))}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <CustomModal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit Schedule" : "New Schedule"}
        footer={
          <>
            <button
              onClick={resetForm}
              className="rounded-md px-4 py-2 text-sm font-medium !cursor-pointer hover:bg-gray-50 shadow-sm transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={submitting}
              className="rounded-md bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium cursor-pointer shadow-sm transition-colors duration-200 disabled:opacity-50"
            >
              {submitting ? "Saving..." : editing ? "Save changes" : "Create schedule"}
            </button>
          </>
        }
      >
        <div className="grid gap-4">
          <div className="grid gap-1">
            <label className="text-sm font-medium text-gray-700">Employee</label>
            <select
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={form.employeecode}
              onChange={(e) => setForm((f) => ({ ...f, employeecode: e.target.value }))}
            >
              <option value="" disabled>
                Select employee
              </option>
              {employeeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-1">
            <label className="text-sm font-medium text-gray-700" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Reminder"
            />
          </div>

          <div className="grid gap-1">
            <label className="text-sm font-medium text-gray-700" htmlFor="body">
              Message
            </label>
            <textarea
              id="body"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              placeholder="Don't forget to submit your report."
            />
          </div>

          {/* Multi-select Day of Week */}
          <div className="grid gap-1">
            <label className="text-sm font-medium text-gray-700">Days of week</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DOW.map((d) => {
                const checked = form.day_of_week.includes(7)
                  ? false
                  : form.day_of_week.includes(d.value);

                return (
                  <label
                    key={d.value}
                    className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={checked}
                      onChange={(e) =>
                        setForm((f) => {
                          const base = f.day_of_week.filter((v) => v !== 7);
                          if (e.target.checked) {
                            return { ...f, day_of_week: Array.from(new Set([...base, d.value])) };
                          } else {
                            return { ...f, day_of_week: base.filter((v) => v !== d.value) };
                          }
                        })
                      }
                    />
                    {d.label}
                  </label>
                );
              })}

              {/* Everyday */}
              <label className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm cursor-pointer select-none col-span-2 sm:col-span-4">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={form.day_of_week.includes(7)}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      day_of_week: e.target.checked ? [7] : [], // selecting Everyday clears others
                    }))
                  }
                />
                Every day
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Select multiple days or choose <strong>Every day</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="grid gap-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="time">
                Time
              </label>
              <input
                id="time"
                type="time"
                step={60}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={form.send_time}
                onChange={(e) => setForm((f) => ({ ...f, send_time: e.target.value }))}
                title="Format: HH:mm (24-hour)"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value as "active" | "paused" }))
                }
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium text-gray-700">Recurring</label>
              <select
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={form.is_recurring ? "true" : "false"}
                onChange={(e) =>
                  setForm((f) => ({ ...f, is_recurring: e.target.value === "true" }))
                }
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
        </div>
      </CustomModal>
    </div>
  );
}
