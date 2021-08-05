// Expense tracker...
const { request, response, query } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const Expense = require("./Expense");
const cors = require("cors");
require("dotenv").config();

// //enable resourse sharing (CORS)
// app.use(function (request, response, next) {
//   response.header("Access-Control-Allow-Origin", "http://localhost:3000"); // react loacl host domain name or *
//   response.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

//cors connection
app.use(cors({ origin: "*", methods: "GET,HEAD,PUT,PATCH,POST,DELETE" }));

//connection of mongoDB
mongoose
  .connect(
    "mongodb+srv://RohanNaruto:NeverGiveUp@cluster0.qwi7t.mongodb.net/ExpenseDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((result) => {
    console.log("database got connected Cheers :)");
  })
  .catch((err) => {
    console.log("error occured: ", err);
    console.log("database didnt got connected :(");
  });

app.use(bodyParser.json()); // to pass the data from the ui to ai.

// post api....
app.post(`/addUser`, async (request, response) => {
  try {
    const user = request.body;

    const exist = await Expense.findOne({ fullName: user.fullName });

    // if (exist) {
    //   console.log("data already exist in Database..");
    //   response.json("Data exists with same name..");
    // } else {
    const newUser = new Expense(user);

    await newUser.save();

    console.log("user is added : ", newUser);
    response.json(newUser);
  } catch (error) {
    console.log("error: ", error);
  }
});

//get api...
app.get(`/getUser`, async (request, response) => {
  Expense.find((err, Expense) => {
    if (err) {
      console.log("no databases...");
    } else {
      console.log("Users are :: ", Expense);
      response.json(Expense);
    }
  });
});

//delete api...
app.delete("/deleteUser/:id", async (request, response) => {
  const _id = request.params.id;

  try {
    const user = await Expense.findByIdAndDelete({ _id });

    if (!user) {
      return response.json("no data to delete..");
    }

    response.json(user);
  } catch (error) {
    console.log("error: ", error);
  }
});

//update api..
app.put("/updateUser/:id", async (request, response) => {
  const _id = request.params.id;
  const body = request.body;

  try {
    const user = await Expense.findByIdAndUpdate(
      { _id },
      { $set: body },
      { new: true }
    );

    if (!user) {
      return response.json("user not found");
    }
    response.json(user);
  } catch (error) {
    console.log("error: ", error);
  }
});

if (process.env.NODE_ENV == "production") {
  app.use(express.static("expense-tracker/build"));
}

//--------------------------------------------------------
//listen on port ...
const port = process.env.PORT || 6500;

app.listen(port, () => {
  console.log("server is on port 6500");
});
