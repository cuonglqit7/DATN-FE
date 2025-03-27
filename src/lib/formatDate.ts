export const formatDate = (dateTime: Date): string => {
  const date = new Date(dateTime);

  const formattedDate = date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return formattedDate;
};
