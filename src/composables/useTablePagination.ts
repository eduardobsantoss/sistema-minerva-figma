import { computed, ref, watch, type MaybeRefOrGetter, toValue } from 'vue';

export const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 25, 50] as const;

export function useTablePagination<T>(
  source: MaybeRefOrGetter<readonly T[]>,
  options?: {
    defaultPageSize?: number;
  },
) {
  const page = ref(1);
  const pageSize = ref(options?.defaultPageSize ?? 10);

  const total = computed(() => toValue(source).length);
  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)));
  const clampedPage = computed(() => Math.min(page.value, totalPages.value));
  const pageItems = computed(() => {
    const list = toValue(source);
    const start = (clampedPage.value - 1) * pageSize.value;
    return list.slice(start, start + pageSize.value) as T[];
  });
  const rangeLabel = computed(() => {
    if (total.value === 0) return '0–0';
    const start = (clampedPage.value - 1) * pageSize.value + 1;
    const end = Math.min(clampedPage.value * pageSize.value, total.value);
    return `${start}–${end}`;
  });

  watch(total, () => {
    if (page.value > totalPages.value) page.value = totalPages.value;
  });

  function setPage(next: number) {
    page.value = Math.min(totalPages.value, Math.max(1, next));
  }

  function setPageSize(next: number) {
    pageSize.value = next;
    page.value = 1;
  }

  return {
    page,
    pageSize,
    total,
    totalPages,
    clampedPage,
    pageItems,
    rangeLabel,
    setPage,
    setPageSize,
  };
}
