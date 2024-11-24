export function toSqlDate(data: Date) {
  const year = data.getFullYear();
  let month: string | number = data.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  let day: string | number = data.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  return year + '-' + month + '-' + day;
}
