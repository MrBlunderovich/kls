export default function didFormDataChange(source, target) {
  for (let key in source) {
    if (source[key] !== target[key]) {
      return true;
    }
  }
  return false;
}
