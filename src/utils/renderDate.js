export default function renderDate(text) {
  if (!text) return "-";
  return new Date(text).toLocaleDateString("rus");
}
