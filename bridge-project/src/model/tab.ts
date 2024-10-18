import { Info } from './info';

export type FamPageTab = {
  name: string;
  id: string;
  content: Info[];
};

export type CellPageTab = {
  name: string;
  id: string;
  content: Omit<Info, 'content' | 'date' | 'alive'>[];
};
