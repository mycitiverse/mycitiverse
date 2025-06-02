export const getCityUpdates = () => {
  const data = localStorage.getItem("cityUpdates");
  return data ? JSON.parse(data) : [];
};

export const saveCityUpdate = (update) => {
  const current = getCityUpdates();
  current.push(update);
  localStorage.setItem("cityUpdates", JSON.stringify(current));
};
