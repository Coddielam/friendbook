const validateRegisterForm = (formData: FormData): string => {
  const requiredFields = [
    "name",
    "profile_pic",
    "company",
    "phone",
    "password",
    "repeat_password",
  ];

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

  // check include all required fields
  const missingFields = requiredFields.filter((field) => {
    return !Object.keys(dataObj).includes(field);
  });
  if (missingFields.length) {
    return `${missingFields
      .map(
        (field) =>
          field.charAt(0).toUpperCase() + field.replace("_", " ").slice(1)
      )
      .join(", ")} are required`;
  }

  // check if company name is > 3 letters or longer
  if (dataObj.company.length < 3) {
    return "Company name has to be longer than 3 letters"
  }

  // check if password and repeat password matches
  if (dataObj.password !== dataObj.repeat_password) {
    return "Please make sure password and repeat password matches";
  }

  return "";
};

export default validateRegisterForm;
