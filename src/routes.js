import RouteImport from "./hoc/routeImport";

export const LinkList = RouteImport(() => import("./components/LinkList"));
export const CreateLink = RouteImport(() => import("./components/CreateLink"));
export const Header = RouteImport(() => import("./components/Header"));
export const Login = RouteImport(() => import("./components/Login"));
export const Search = RouteImport(() => import("./components/Search"));
