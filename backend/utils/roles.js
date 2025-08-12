import userModel from "../models/User.model.js";
import Guest from "../models/Guest.model.js";

export const getUserForRole = async (role, username) => {
  if (role === "guest") {
    return await Guest.findOne({ username });
  } else {
    return await userModel.findOne({ username });
  }
};
