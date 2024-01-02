import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const dbConnect = () => {
  mongoose.connection.once("open", () => console.log("DB connection"));
  return mongoose.connect(
    `mongodb+srv://hamzawq:PXUsHSIruVbztWtQ@cluster0.zvk1ffv.mongodb.net/`,
    { keepAlive: true }
  );
};
