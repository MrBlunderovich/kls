export const BASE_URL = import.meta.env.VITE_APP_API_URL;

export const ENDPOINTS = {
  login: "/users/login/",
  productSearchTips: "/products/clue-products",
  defectProductSearchTips: "/products/clue-defect-products",
  historySearchTips: "transactions/clue-products-sold",
};

export const UNITS = [
  { value: "item", label: "Шт" },
  { value: "kilogram", label: "Кг" },
  { value: "liter", label: "Литр" },
];

export const CATEGORIES = [
  { value: "Алкогольное", label: "Алкогольное" },
  { value: "Безалкогольное", label: "Безалкогольное" },
  { value: "Оборудование", label: "Оборудование" },
];

export const PATHS = {
  products: "/warehouse",
  productsArchive: "/warehouse/archive",
  productsCreate: "/warehouse/create",
  productsEdit: "/warehouse/edit",
  distributors: "/distributors",
  distributorsProfile: "/distributors/profile",
  distributorsArchive: "/distributors/archive",
  distributorsEdit: "/distributors/edit",
  distributorsCreate: "/distributors/create",
  order: "/distributors/order",
  return: "/distributors/return",
  notFound: "/not-found",
  logIn: "/login",
  logOut: "/logout",
};

export const TRY_AGAIN_ERROR = "Request failed with status code 400";
export const ACCESS_DENIED_ERROR = "Request failed with status code 429";

export const SEARCH_DEBOUNCE_DELAY = 700;

export const ALLOW_SCROLL_QUANTITY_CONTROL = false;

//-------------------TABLES---------------------
export const S_INDEX_WIDTH = 40;
export const S_UID_WIDTH = 90;
export const S_UNIT_WIDTH = 40;
export const S_QCONTROL_WIDTH = 80;
export const S_PRICE_WIDTH = 50;
export const S_SUM_WIDTH = 50;
export const S_ACTION_WIDTH = 45;
export const S_DATE_WIDTH = "10%";
