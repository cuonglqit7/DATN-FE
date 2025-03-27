export const formatRating = (rating: number) => {
  const formattedNumber = Math.round(rating * 10) / 10;
  return formattedNumber;
};
