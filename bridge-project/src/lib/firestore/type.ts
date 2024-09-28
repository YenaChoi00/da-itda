import { DocumentReference, Timestamp } from 'firebase/firestore';

export type FamilyDoc = {
  name: string;
  cellArr: DocumentReference[];
};

export type CellDoc = {
  name: string;
  memberArr: DocumentReference[];
};

export type UserDoc = {
  name: string;
  level: number;
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
