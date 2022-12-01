import database from "../src/database";
import FormData from "form-data";
import { faker } from "@faker-js/faker";
import request from "request";
import axios from "axios";

const postFakeUser = async () => {
  try {
    const formData = new FormData();
    // name
    const name = faker.name.fullName();
    formData.append("name", faker.name.fullName());
    // company
    formData.append("company", faker.company.name());
    // company
    formData.append(
      "email",
      name.toLowerCase().replace(" ", "_") + "@email.com"
    );
    // password
    formData.append("password", "12341234");
    formData.append("repeat_password", "12341234");
    // phone
    formData.append("phone", faker.phone.number("########").toString());
    // profile_pic
    formData.append("profile_pic", request(faker.image.avatar()));

    console.log(">>> Creating a user via API ...");

    const { data } = await axios.post(
      "http://localhost:4000/user/register",
      formData
    );
    console.log(data);
    console.log("");
  } catch (error: any) {
    console.log(">>> Failed to create user!");
    console.log(error.message);
    console.log("");
    return;
  }
};

export const insertFakeUserIntoDB = async () => {
  try {
    // await database.sync({ alter: true });
    for (let i = 0; i < 15; i++) {
      await postFakeUser();
    }
  } catch (error) {
    throw error;
  }
};
