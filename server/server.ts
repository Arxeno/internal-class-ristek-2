import express from 'express';
import dotenv from 'dotenv';
import {
  createNewExpense,
  deleteExpense,
  editExpense,
  getAllCategories,
  getAllExpenses,
  getExpenseDetail,
  getTotalExpense,
} from './controllers/expense';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

// GET
app.get('/expense', getAllExpenses);

app.get('/expense/category', getAllCategories);

app.get('/expense/total', getTotalExpense);

app.get('/expense/:id', getExpenseDetail);

// POST
app.post('/expense', createNewExpense);

// DELETE
app.delete('/expense/:id', deleteExpense);

// PUT
app.put('/expense/:id', editExpense);

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
