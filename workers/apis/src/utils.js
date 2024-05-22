export const getDateKey = (date, daysToSubtract = 0) => {
  const dateObject = new Date(date);
  dateObject.setDate(dateObject.getDate() - daysToSubtract);
  const startDateFormatDate = dateObject.toISOString().slice(0, 10);
  const startDateKey = Number(startDateFormatDate.replaceAll('-', ''));
  return { key: startDateKey, formattedDate: startDateFormatDate };
};
