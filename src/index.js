import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("App issue : ", error);
      throw error;
    });
    app.listen(process.env.PORT, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });

// (async () => {
//   try {
//     mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
//     app.on("error", () => {
//       console.log("ERR:", error);
//       throw error;
//     });
//     app.listen(process.env.PORT , () => {
//         console.log(`App is Listening on Port ${process.env.PORT}`);

//     })
//   } catch (error) {
//     console.error("ERROR: ", error);
//     throw err;
//   }
// })();
