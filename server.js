import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { initClient } from "messagebird";
const messagebird = initClient(process.env.MESSAGEBIRD_API_KEY);

const app = express();
app.use(express.json());
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const formattedPhoneNumber = `+91${req?.body?.phoneNumber}`;

    const params = {
      template: "Hello, I'm Hamza and your code is: %token",
      timeout: 3600,
    };

    messagebird.verify.create(formattedPhoneNumber, params, (err, response) => {
      if (err) {
        throw err;
      } else {
        res.json({
          message: "Successfully sent OTP to user",
          ...response,
        });
      }
    });
  } catch (err) {
    res.json({ ...err });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const {id, token} = req?.body

    messagebird.verify.verify(id, token, (err, response) => {
      if (err) {
        throw err;
      } else {
        res.json({
          message: "Successfully verified user",
          ...response,
        });
      }
    });
  } catch (err) {
    res.json({ ...err });
  }
});

app.use("/", router);

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server is running on ${process.env.PORT || 5000}`)
);
