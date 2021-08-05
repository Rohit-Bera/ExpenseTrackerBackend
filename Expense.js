const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
  fullName: String,
  expName: String,
  date: String,
  amount: Number,
});

const Expense = mongoose.model("Expense", ExpenseSchema); // Expense is the database in mongoDb and Expenseschema is the schema..

module.exports = Expense;
