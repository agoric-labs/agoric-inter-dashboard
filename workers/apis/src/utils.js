import { SUBQUERY_URL } from './constants.js';

export const getDateKey = (date, daysToSubtract = 0) => {
  const dateObject = new Date(date);
  dateObject.setDate(dateObject.getDate() - daysToSubtract);
  const startDateFormatDate = dateObject.toISOString().slice(0, 10);
  const startDateKey = Number(startDateFormatDate.replaceAll('-', ''));
  return { key: startDateKey, formattedDate: startDateFormatDate };
};

export const range = (stop) => [...Object(Array(stop)).keys()];

export const fetchSubquery = async (query) =>
  await fetch(SUBQUERY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(query),
  });

export const parseFromPaginatedData = (key, paginatedData) =>
  Object.entries(paginatedData)
    .filter(([k, _]) => k.split('_')['0'] === key)
    .map(([_, v]) => v.nodes)
    .flat();
