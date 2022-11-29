import Joi from "joi";

const baseUserSchema = {
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  repeat_password: Joi.ref("password") as any,
  name: Joi.string().min(3).max(30),
  phone: Joi.string().min(8).max(8),
  profile_pic: Joi.string(),
  company: Joi.string().min(3).max(50),
};

export default baseUserSchema;
