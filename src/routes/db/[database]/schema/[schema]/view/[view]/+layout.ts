import {
  getTableColumns
} from '$lib/services/db-service.js';
import type { Column } from '$lib/types.js';

export const load = async ({ params }) => {
  let columns: Column[] = [];

  try {
    columns = await getTableColumns(params);
  } catch {}

  return { columns };
};
