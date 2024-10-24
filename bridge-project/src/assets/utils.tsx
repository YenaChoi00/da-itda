export function dateFormat(date: Date) {
  const dateFormat2 =
    date.getFullYear() +
    '-' +
    (date.getMonth() + 1 < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
    '-' +
    (date.getDate() < 9 ? '0' + date.getDate() : date.getDate());
  return dateFormat2;
}
