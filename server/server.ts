import { Request, Response } from 'express';
import express from 'express';
import dotenv from 'dotenv';
import {
  expensesData,
  categoriesId,
  currentExpense,
  expensesDetail,
} from './data';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.get('/expense', (req: Request<string | number>, res: Response) => {
  const { category_id } = req.query;
  let { min_price, max_price, page, limit } = req.query;

  min_price = min_price || '-1';
  max_price = max_price || '-1';
  page = page || '1';
  limit = limit || '10';

  // search category name
  let categoryName = '';
  for (let i = 0; i < categoriesId.length; i++) {
    if (category_id == categoriesId[i].id) {
      categoryName = categoriesId[i].name;
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

  for (let i = 0; i < expensesData.length; i++) {
    if (expensesData[i].category.name == categoryName || categoryName == '') {
      if (minPriceNumber == -1 || expensesData[i].amount >= minPriceNumber) {
        if (maxPriceNumber == -1 || expensesData[i].amount <= maxPriceNumber) {
          dataFiltered.push(expensesData[i]);
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
});

app.get('/expense/category', (req: Request, res: Response) => {
  res.json(categoriesId);
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
