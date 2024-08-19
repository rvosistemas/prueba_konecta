export const formatSalary = (salary) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(salary);
};

export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

export const formatDateToDDMMYYYY = (dateString) => {
  const [year, month, day] = dateString.split('-');
  const date = new Date(Date.UTC(year, month - 1, day));

  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return date.toLocaleDateString('en-GB', options);
};

export const formatStatus = (isActive) => {
  return isActive ? 'Active' : 'Inactive';
};

export const formatDateToYYYYMMDD = (dateString) => {
  const date = new Date(dateString);
  let month = '' + (date.getMonth() + 1),
    day = '' + date.getDate(),
    year = date.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
};
