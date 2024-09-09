import { PAGES } from "./@constants";

export function getHeaderTitle(pathname: string) {
  const page = PAGES.find((page) => page.href === pathname);

  return page?.name;
}
