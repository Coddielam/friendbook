const validateUpdateUserForm = (formData: FormData): string => {
  const dataObj: any = {};
  for (const [key, value] of formData.entries()) {
    if (key === "profile_pic") {
      if ((value as File).size) {
        dataObj[key] = (value as File).size;
      }
    } else if (value) {
      dataObj[key] = value;
    }
  }

  // check if password and repeat password matches
  if (dataObj.password) {
    if (dataObj.password !== dataObj.repeat_password) {
      return "Please make sure password and repeat password matches";
    }
  }

  return "";
};

export default validateUpdateUserForm;
