export const convertToUTC = (date: string | Date) => {
    const utcDate = new Date(date).toISOString();
    return utcDate;
  };