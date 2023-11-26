export default function formatPhone(input) {
  if (!input) return "";
  const string = input.toString().replace(/^\+996/, "");
  const result = [];
  string.split("").forEach((char, index) => {
    if (index !== 0 && index % 3 === 0) {
      result.push(" ");
    }
    result.push(char);
  });
  return result.join("");
}
