import { TPage } from "./Page.type";

export type TPaging = {
  pagesCount : number;
  itemsCount : number;
  first : TPage;
  prev? : TPage;
  current : TPage;
  next? : TPage;
  last : TPage;
}