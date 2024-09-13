import { collection } from 'firebase/firestore';

import { getDb } from '.';

const USER_COLLECTION_NAME = 'user-dev';

export const getUserCollection = () => collection(getDb(), USER_COLLECTION_NAME);
