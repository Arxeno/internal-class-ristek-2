import { Request, Response } from 'express';
import {
  expensesData,
  categoriesId,
  currentExpense,
  expensesDetail,
} from '../data';
import { makeId } from '../utils/helpers';

let expensesData2 = expensesData;
const categoriesId2 = categoriesId;
const currentExpense2 = currentExpense;
let expensesDetail2 = expensesDetail;

export const getAllExpenses = (
  req: Request<string | number>,
  res: Response
) => {
  const { category_id } = req.query;
  let { min_price, max_price, page, limit } = req.query;

  min_price = min_price || '-1';
  max_price = max_price || '-1';
  page = page || '1';
  limit = limit || '10';

  // search category name
  let categoryName = '';
  for (let i = 0; i < categoriesId2.length; i++) {
    if (category_id == categoriesId2[i].id) {
      categoryName = categoriesId2[i].name;
      break;
    }
  }

  console.log(min_price);

  console.log('NUMBER');
  const minPriceNumber = Number(min_price) || undefined;
  console.log(`min price ${minPriceNumber}`);
  const maxPriceNumber = Number(max_price) || undefined;
  console.log(`max price ${maxPriceNumber}`);
  const pageNumber = Number(page) || undefined;
  console.log(`page ${pageNumber}`);
  const limitNumber = Number(limit) || undefined;
  console.log(`limit ${limitNumber}`);

  // check min price
  if (!minPriceNumber) {
    res.status(400).json({
      statusCode: 400,
      message: ['min_price must be an integer number'],
      error: 'Bad Request',
    });
    return;
  }

  // check max price
  if (!maxPriceNumber) {
    res.status(400).json({
      statusCode: 400,
      message: ['max_price must be an integer number'],
      error: 'Bad Request',
    });
    return;
  }

  // check page
  if (!pageNumber || pageNumber < 1) {
    res.status(400).json({
      statusCode: 400,
      message: [
        'page must not be less than 1',
        'page must be an integer number',
      ],
      error: 'Bad Request',
    });
    return;
  }

  // check limit
  if (!limitNumber || limitNumber > 20 || limitNumber < 1) {
    res.status(400).json({
      statusCode: 400,
      message: [
        'limit must not be greater than 20',
        'limit must not be less than 1',
        'limit must be an integer number',
      ],
      error: 'Bad Request',
    });
    return;
  }

  let dataFiltered = [];

  const indeksAwal = limitNumber * (pageNumber - 1);
  const indeksAkhir = indeksAwal + limitNumber - 1;

  let itemCount = 0;

  for (let i = 0; i < expensesData2.length; i++) {
    if (expensesData2[i].category == categoryName || categoryName == '') {
      if (minPriceNumber == -1 || expensesData2[i].amount >= minPriceNumber) {
        if (maxPriceNumber == -1 || expensesData2[i].amount <= maxPriceNumber) {
          dataFiltered.push(expensesData2[i]);
          itemCount++;
        }
      }
    }
  }

  let data = [];

  console.log(`indeks awal ${indeksAwal}`);
  console.log(`indeks akhir ${indeksAkhir}`);

  for (let i = indeksAwal; i < indeksAkhir + 1; i++) {
    data.push(dataFiltered[i]);
  }

  console.log(`panjang data ${data.length}`);

  const pageCount = Math.ceil(itemCount / limitNumber);
  const hasPreviousPage = pageNumber != 1 ? true : false;
  const hasNextPage = pageNumber != pageCount ? true : false;

  const result = {
    data,
    paging: {
      page: pageNumber,
      limit: limitNumber,
      itemCount,
      pageCount,
      hasPreviousPage,
      hasNextPage,
    },
  };

  res.json(result);
};

export const getAllCategories = (req: Request, res: Response) => {
  res.json(categoriesId2);
};

export const getTotalExpense = (req: Request, res: Response) => {
  res.json(categoriesId2);
};

export const getExpenseDetail = (req: Request, res: Response) => {
  const { id } = req.params;

  for (const expenseDetail of expensesDetail2) {
    if (id == expenseDetail.id) {
      res.json(expenseDetail);
      break;
    }
  }

  res.status(500).json({
    statusCode: 500,
    message: 'Internal server error',
  });
};

export const createNewExpense = (req: Request, res: Response) => {
  const { body } = req;

  currentExpense2.total_expenses += body.amount;

  const newId = `${makeId(8)}-${makeId(4)}-${makeId(4)}-${makeId(4)}-${makeId(
    12
  )}`;

  let categoryName = '';
  for (const categoryId of categoriesId2) {
    if (categoryId.id == body.category) {
      categoryName = categoryId.name;
      break;
    }
  }

  const newExpenseData = {
    id: newId,
    name: body.name,
    category: categoryName,
    amount: body.amount,
  };

  expensesData2.push(newExpenseData);

  const newExpenseDetail = {
    id: newId,
    name: body.name,
    category: {
      id: body.category,
      name: categoryName,
    },
    amount: body.amount,
  };

  expensesDetail2.push(newExpenseDetail);

  res.json(newExpenseDetail);

  console.log(expensesData2);
  console.log('=============================================');
  console.log(expensesDetail2);
};

export const deleteExpense = (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedData = expensesData2.filter(
    (currentValue) => currentValue.id == id
  );

  currentExpense2.total_expenses -= deletedData[0].amount;

  expensesData2 = expensesData2.filter((currentValue) => currentValue.id != id);
  expensesDetail2 = expensesDetail2.filter(
    (currentValue) => currentValue.id != id
  );

  res.send(
    'Success delete expense with id fa8337a7-a4b7-4257-a322-9d51473d9fc3'
  );

  console.log(expensesData2);
  console.log('===============================================');
  console.log(expensesDetail2);
};

export const editExpense = (req: Request, res: Response) => {
  const { id } = req.params;

  const newData = req.body;

  let oldData;
  for (const expenseData of expensesData2) {
    if (id == expenseData.id) {
      oldData = expenseData;
    }
  }

  expensesData2 = expensesData2.filter((currentValue) => currentValue.id != id);
  expensesDetail2 = expensesDetail2.filter(
    (currentValue) => currentValue.id != id
  );

  currentExpense2.total_expenses -= oldData ? oldData.amount : 0;
  currentExpense2.total_expenses += newData.amount;

  let categoryName = '';
  for (const categoryId of categoriesId2) {
    if (categoryId.id == newData.category) {
      categoryName = categoryId.name;
      break;
    }
  }

  const newExpenseData = {
    id: oldData ? oldData.id : '',
    name: newData.name,
    category: categoryName,
    amount: newData.amount,
  };
  const newExpenseDetail = {
    id: oldData ? oldData.id : '',
    name: newData.name,
    category: {
      id: newData.category,
      name: categoryName,
    },
    amount: newData.amount,
  };

  expensesData2.push(newExpenseData);
  expensesDetail2.push(newExpenseDetail);
};
