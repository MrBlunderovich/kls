export default function formatPhone(input, addCountryCode = false) {
  if (!input) return "";
  const string = input.toString().replace(/^\+996/, "");
  const result = [];
  string.split("").forEach((char, index) => {
    if (index !== 0 && index % 3 === 0) {
      result.push(" ");
    }
    result.push(char);
  });
  const output = result.join("");
  return addCountryCode ? `+996 ${output}` : output;
}
