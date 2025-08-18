export type Item = { label: string; value: string };
export const CURRENT_YEAR = new Date().getFullYear();
// 상수(불변)로 1회만 생성
export const YEAR_ITEMS: Item[] = Array.from({ length: 121 }, (_, i) => {
  const y = CURRENT_YEAR - i; // 최근 연도가 먼저 보이도록
  return { label: String(y), value: String(y) };
});

export const MONTH_ITEMS: Item[] = Array.from({ length: 12 }, (_, i) => ({
  label: String(i + 1).padStart(2, "0"),
  value: String(i + 1).padStart(2, "0"),
}));
