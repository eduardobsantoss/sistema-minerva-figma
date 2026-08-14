import { reactive, readonly } from 'vue';

export type ToastType = 'error' | 'warning' | 'success' | 'info';

export interface ToastAction {
  label: string;
  onClick?: () => void;
}

export interface ToastInput {
  message: string;
  action?: ToastAction;
  duration?: number | null;
}

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  action?: ToastAction;
  count: number;
  createdAt: number;
}

const toasts = reactive<ToastItem[]>([]);
const timers = new Map<string, ReturnType<typeof setTimeout>>();
let seq = 0;

const DEFAULT_DURATION: Record<ToastType, number | null> = {
  error: null,
  warning: 8000,
  success: 5000,
  info: 5000,
};

function normalize(input: string | ToastInput): ToastInput {
  return typeof input === 'string' ? { message: input } : input;
}

function scheduleDismiss(id: string, duration: number | null) {
  const prev = timers.get(id);
  if (prev) clearTimeout(prev);
  timers.delete(id);
  if (duration == null) return;
  timers.set(
    id,
    setTimeout(() => {
      dismiss(id);
    }, duration),
  );
}

function push(type: ToastType, input: string | ToastInput): string {
  const opts = normalize(input);
  const duration = opts.duration === undefined ? DEFAULT_DURATION[type] : opts.duration;
  const existing = toasts.find((t) => t.type === type && t.message === opts.message);

  if (existing) {
    existing.count += 1;
    existing.createdAt = Date.now();
    if (opts.action) existing.action = opts.action;
    scheduleDismiss(existing.id, duration);
    return existing.id;
  }

  const id = `toast-${++seq}`;
  toasts.push({
    id,
    type,
    message: opts.message,
    action: opts.action,
    count: 1,
    createdAt: Date.now(),
  });
  scheduleDismiss(id, duration);
  return id;
}

function dismiss(id: string) {
  const i = toasts.findIndex((t) => t.id === id);
  if (i >= 0) toasts.splice(i, 1);
  const timer = timers.get(id);
  if (timer) clearTimeout(timer);
  timers.delete(id);
}

function dismissAll() {
  toasts.splice(0, toasts.length);
  for (const timer of timers.values()) clearTimeout(timer);
  timers.clear();
}

export function useToast() {
  return {
    toasts: readonly(toasts),
    error: (input: string | ToastInput) => push('error', input),
    warn: (input: string | ToastInput) => push('warning', input),
    success: (input: string | ToastInput) => push('success', input),
    info: (input: string | ToastInput) => push('info', input),
    dismiss,
    dismissAll,
  };
}
