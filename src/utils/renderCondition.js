export default function renderCondition(text) {
  if (!text) return "-";
  switch (text) {
    case "normal":
      return "Норма";
    case "defect":
      return "Брак";

    default:
      return text;
  }
}
