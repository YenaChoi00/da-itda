import { TabModel } from '../../model/tabModel';

const FAMILY_ID = '';

export async function getTabModels(): Promise<TabModel[]> {
  try {
    const tabModels: TabModel[] = [];

    // TODO: get family with FAMILY_ID
    // family collection has name(string), cellArr(reference array to cell collection)
    // cell collection has name(string), memberArr(reference array to user collection)
    // prayer request collection has content(string array), date(timestamp), user(reference to user collection)
    // TODO: load every prayer request which is included in this family
    // TODO: convert prayer request to Info[]
    // TabModel is about cell
    // TODO: push Info[] to tabModels with cell id, cell name

    return tabModels;
  } catch (error) {
    console.error('Error fetching tab models:', error);
    throw error;
  }
}
