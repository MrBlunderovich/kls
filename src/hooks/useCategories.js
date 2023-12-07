import { useSelector } from "react-redux";

export default function useCategories() {
  const { categories } = useSelector((state) => state.options);
  return Array.isArray(categories) ? categories : [];
}
