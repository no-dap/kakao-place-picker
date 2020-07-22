export const enumerate = (iterable: any[]) => {
  if (iterable === undefined) {
    return [];
  }
  return iterable.map(
    (value, index) => ({ index, value })
  );
};
