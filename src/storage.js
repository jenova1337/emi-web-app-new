export const getPlans = () => {
  const data = localStorage.getItem("emiPlans");
  return data ? JSON.parse(data) : [];
};

export const savePlans = (plans) => {
  localStorage.setItem("emiPlans", JSON.stringify(plans));
};