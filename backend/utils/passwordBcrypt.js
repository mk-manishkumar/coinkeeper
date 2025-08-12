import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// Function to hash password
export async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
}

// Function to compare passwords
export async function comparePassword(userPassword, hashedPassword) {
  try {
    return await bcrypt.compare(userPassword, hashedPassword);
  } catch (error) {
    throw new Error("Error comparing password");
  }
}
