export const BASE_URL = "http://134.209.252.52:83/api/v1/";
//export const BASE_URL = "https://beerhouse.vercel.app/api/";

export const ENDPOINTS = {
  login: "/users/login/",
};

export const CATEGORIES = [
  { value: "", label: "Все товары" },
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
  logOut: "/logout",
};

export const TRY_AGAIN_ERROR = "try_again";
export const ACCESS_DENIED_ERROR = "access_denied";

export const SEARCH_DEBOUNCE_DELAY = 700;

//-------------------TABLES---------------------
export const S_INDEX_WIDTH = 40;
export const S_UID_WIDTH = 90;
export const S_UNIT_WIDTH = 40;
export const S_QCONTROL_WIDTH = 80;
export const S_PRICE_WIDTH = 50;
export const S_SUM_WIDTH = 50;
export const S_ACTION_WIDTH = 45;
export const S_DATE_WIDTH = "10%";
