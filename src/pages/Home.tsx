import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import CONFIG from '../config';
import TotalExpense from '../components/TotalExpense';
import Card from '../components/Card';
import {
  CategoryResponseType,
  ExpenseResponseType,
  ExpenseType,
} from '../type';
import './Home.scss';
import GlobalStateContext from '../GlobalStateContext';

const categoryNames = [
  'Housing',
  'Food',
  'Transportation',
  'Personal Spending',
];

const Home = () => {
  const { currentPage, categoryIdSelect, minPrice, maxPrice } =
    useContext(GlobalStateContext);

  const [expenseResponse, setExpenseResponse] =
    useState<ExpenseResponseType | null>(null);
  const [expenseArray, setExpenseArray] = useState<ExpenseType[]>([]);
  let [categoryIds, setCategoryIds] = useState(['', '', '', '']);

  const getExpenseData = async () => {
    const categoryParam = categoryIdSelect.state
      ? `&category_id=${categoryIdSelect.state}`
      : '';

    const minPriceParam =
      minPrice.state > 0 ? `&min_price=${minPrice.state}` : '';
    const maxPriceParam =
      maxPrice.state > 0 ? `&max_price=${maxPrice.state}` : '';

    await fetch(
      `${CONFIG.API_URL}/expenses?page=${
        currentPage.state
      }&limit=${4}${categoryParam}${minPriceParam}${maxPriceParam}`
    )
      .then((res) => res.json())
      .then((resJson) =>
        setExpenseResponse(() => {
          setExpenseArray(resJson.data);
          return resJson;
        })
      );
  };

  const handleMinChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value) || 0;

    minPrice.setState(newValue);
    currentPage.setState(1);
  };

  const handleMaxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value) || 0;
    maxPrice.setState(newValue);
    currentPage.setState(1);
  };

  useEffect(() => {
    getExpenseData();
  }, [
    categoryIdSelect.state,
    minPrice.state,
    maxPrice.state,
    currentPage.state,
  ]);

  useEffect(() => {
    fetch(`${CONFIG.API_URL}/expenses/category`)
      .then((res) => res.json())
      .then((resJson) => {
        resJson.forEach((element: CategoryResponseType) => {
          const index = categoryNames.indexOf(element.name);
          let temp = categoryIds;

          temp[index] = element.id;
          setCategoryIds(temp);
        });
      });
  }, []);

  const handlePagination = (paginationText: number | string) => {
    if (
      typeof paginationText == 'string' &&
      (paginationText == '<' || paginationText == '>')
    ) {
      switch (paginationText) {
        case '<':
          currentPage.setState(currentPage.state - 1);
          break;
        case '>':
          currentPage.setState(currentPage.state + 1);
          break;
      }
    } else if (typeof paginationText == 'number') {
      currentPage.setState(paginationText);
    }
  };

  const createPaginationFiveAndMore = () => {
    const leftArrow = '<';
    const rightArrow = '>';

    if (expenseResponse) {
      if (expenseResponse.paging.pageCount > 5) {
        const secondLastPage = expenseResponse.paging.pageCount - 1;
        const firstLastPage = expenseResponse.paging.pageCount;

        let paginationArray = [];
        if (
          expenseResponse.paging.page == 1 ||
          expenseResponse.paging.page == 2 ||
          expenseResponse.paging.page == secondLastPage ||
          expenseResponse.paging.page == firstLastPage
        ) {
          paginationArray = [1, 2, '...', secondLastPage, firstLastPage];
        } else {
          paginationArray.push(1);

          if (currentPage.state - 1 != 2) {
            paginationArray.push('...');
          }

          paginationArray.push(
            currentPage.state - 1,
            currentPage.state,
            currentPage.state + 1
          );

          if (currentPage.state + 1 != secondLastPage) {
            paginationArray.push('...');
          }

          paginationArray.push(firstLastPage);
        }

        if (expenseResponse.paging.hasPreviousPage) {
          paginationArray.unshift(leftArrow);
        }
        if (expenseResponse.paging.hasNextPage) {
          paginationArray.push(rightArrow);
        }

        return paginationArray.map((text, index) => {
          let pageStyle = null;

          if (expenseResponse.paging.page == text) {
            pageStyle = 'btn-dark';
          } else {
            pageStyle = 'btn-light';
          }

          return (
            <button
              key={index}
              className={`btn ${pageStyle} pagination-btn text-center`}
              onClick={() => handlePagination(text)}
            >
              {text}
            </button>
          );
        });
      } else if (expenseResponse.paging.pageCount == 1) {
        return (
          <button className='btn btn-dark pagination-btn text-center'>1</button>
        );
      } else {
        const paginationArray = [];

        for (let i = 1; i <= expenseResponse.paging.pageCount; i++) {
          paginationArray.push(i);
        }

        if (expenseResponse.paging.hasPreviousPage) {
          paginationArray.unshift(leftArrow);
        }
        if (expenseResponse.paging.hasNextPage) {
          paginationArray.push(rightArrow);
        }

        return paginationArray.map((text, index) => {
          let pageStyle = null;

          if (expenseResponse.paging.page == text) {
            pageStyle = 'btn-dark';
          } else {
            pageStyle = 'btn-light';
          }

          return (
            <button
              key={index}
              className={`btn ${pageStyle} pagination-btn text-center`}
              onClick={() => handlePagination(text)}
            >
              {text}
            </button>
          );
        });
      }
    }
  };

  return (
    <div id='main-app'>
      <div className='card-container'>
        {expenseArray && expenseArray.length > 0
          ? expenseArray.map((data) => {
              return (
                <Card
                  key={data.id}
                  expenseId={data.id}
                  category={data.category.name}
                  amount={data.amount}
                />
              );
            })
          : null}
      </div>

      <TotalExpense />

      <div className='container card'>
        <div id='category-filter'>
          <p>Filters</p>
          {categoryNames.map((categoryName, index) => {
            let emoji = '🛒';
            switch (categoryName.toLowerCase()) {
              case 'housing':
                emoji = '🏠';
                break;
              case 'food':
                emoji = '🍽️';
                break;
              case 'transportation':
                emoji = '🚗';
                break;
              case 'personal spending':
                emoji = '😋';
                break;
            }

            if (categoryIds[index] == categoryIdSelect.state) {
              return (
                <label
                  key={index}
                  className='form-check-label'
                  onClick={() => {
                    categoryIdSelect.setState(categoryIds[index]);
                    currentPage.setState(1);
                  }}
                >
                  <input
                    className='form-check-input'
                    type='radio'
                    name='categoryName'
                    checked
                  />
                  {emoji + categoryName}
                </label>
              );
            } else {
              return (
                <label
                  key={index}
                  className='form-check-label'
                  onClick={() => {
                    categoryIdSelect.setState(categoryIds[index]);
                    currentPage.setState(1);
                  }}
                >
                  <input
                    className='form-check-input'
                    type='radio'
                    name='categoryName'
                  />
                  {emoji + categoryName}
                </label>
              );
            }
          })}
        </div>

        <hr />

        <div>
          <p>Filter by expenses range</p>

          <div id='min-max-filter-container'>
            <div className='min-max-flex'>
              <label>Min</label>
              <input
                className='min-max-input-filter'
                type='number'
                value={minPrice.state}
                onChange={handleMinChange}
              />
            </div>

            <div id='max-filter-div' className='min-max-flex'>
              <label>Max</label>
              <input
                className='min-max-input-filter'
                type='number'
                value={maxPrice.state}
                onChange={handleMaxChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div id='pagination-container'>
        {expenseResponse && expenseResponse.paging
          ? createPaginationFiveAndMore()
          : null}
      </div>
    </div>
  );
};

export default Home;
