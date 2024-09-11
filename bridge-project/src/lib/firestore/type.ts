import { DocumentReference, Timestamp } from 'firebase/firestore';

export type FamilyDoc = {
  name: string;
  cellArr: DocumentReference[];
};

export type CellDoc = {
  name: string;
  memberArr: DocumentReference[];
};

export type PrayerRequestDoc = {
  content: string[];
  date: Timestamp;
  user: DocumentReference;
};
