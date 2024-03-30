import Joi, { ObjectSchema } from "joi";
import passwordComplexity from "joi-password-complexity";

interface RefreshTokenBody {
  refreshToken: string;
  userId: number;
}

export const signUpValidationSchema = (body: any): Joi.ValidationResult => {
  const schema: ObjectSchema<any> = Joi.object({
    userName: Joi.string().required().label("User Name"),
    password: passwordComplexity().required().label("Password"),
    Email: Joi.string().required().label("Email"),
  });
  return schema.validate(body);
};

export const logInValidationSchema = (body: any): Joi.ValidationResult => {
  const schema: ObjectSchema<any> = Joi.object({
    Email: Joi.string().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(body);
};

export const refreshTokenBodyValidation = (
  body: RefreshTokenBody
): Joi.ValidationResult => {
  const schema: ObjectSchema<RefreshTokenBody> = Joi.object({
    refreshToken: Joi.string().required().label("Refresh Token"),
    userId: Joi.number().required().label("User id"),
  });
  return schema.validate(body);
};
