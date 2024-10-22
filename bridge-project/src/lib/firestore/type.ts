import { DocumentReference, Timestamp } from 'firebase/firestore';

export type FamilyDoc = {
  name: string;
  cellArr: DocumentReference[];
};

export type CellDoc = {
  name: string;
  memberArr: DocumentReference[];
};

export type Cell = {
  name: string;
  memberArr: UserDoc[];
};

export type UserDoc = {
  name: string;
  level: number;
  alive: boolean;
};

export type UserInfo = UserDoc & {
  cell: string;
};

export type PrayerRequestDoc = {
  content: string[];
  date: Timestamp;
  user: DocumentReference;
  alive: boolean;
};

export type CategoryInfo = {
  fname: string;
  fid: string;
  cellArr: {
    cname: string;
    cid: string;
  }[];
};
