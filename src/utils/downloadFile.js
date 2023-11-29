export default function downloadFile(blob) {
  const href = window.URL.createObjectURL(blob);
  window.open(href, "_blank");
}
