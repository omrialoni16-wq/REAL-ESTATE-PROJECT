import mongoose from "mongoose";

// Two separate databases:
// - propertiesConnection: the existing cluster that holds all property listings.
// - usersConnection: the new cluster where accounts (register/login) live.
export const propertiesConnection = mongoose.createConnection(
  process.env.MONGO_URI_PROPERTIES,
);
export const usersConnection = mongoose.createConnection(
  process.env.MONGO_URI_USERS,
);

const connectDB = () => {
  propertiesConnection.on("connected", () =>
    console.log("Properties DB connected"),
  );
  propertiesConnection.on("error", (err) =>
    console.error("Properties DB error:", err.message),
  );
  usersConnection.on("connected", () => console.log("Users DB connected"));
  usersConnection.on("error", (err) =>
    console.error("Users DB error:", err.message),
  );
};

export default connectDB;
