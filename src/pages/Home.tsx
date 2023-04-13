import React, { ChangeEvent, useEffect, useState } from 'react';
import CONFIG from '../config';
import TotalExpense from '../components/TotalExpense';
import Card from '../components/Card';
import {
  CategoryResponseType,
  ExpenseResponseType,
  ExpenseType,
} from '../type';
import './Home.scss';

const categoryNames = [
  'Housing',
  'Food',
  'Transportation',
  'Personal Spending',
];

const Home = () => {
  const [expenseResponse, setExpenseResponse] =
    useState<ExpenseResponseType | null>(null);
  const [expenseArray, setExpenseArray] = useState<ExpenseType[]>([]);
  // const [categoryStatus, setCategoryStatus] = useState(null);
  const [categoryIdSelect, setCategoryIdSelect] = useState<string | null>(null);
  let categoryIds = ['', '', '', ''];
  // const [expenseName, setExpenseName] = useState<string>('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // console.log('---------------------');
  // console.log(categoryStatus);
  // console.log('---------------------');
  console.log('RENDER');
  // console.log(minPrice, 'min price render');
  // console.log(expenseArray);
  console.log(currentPage, 'current page render');

  const getExpenseData = async () => {
    console.log('fetch data!', categoryIdSelect);

    const categoryParam = categoryIdSelect
      ? `&category_id=${categoryIdSelect}`
      : '';

    const minPriceParam = minPrice > 0 ? `&min_price=${minPrice}` : '';
    const maxPriceParam = maxPrice > 0 ? `&max_price=${maxPrice}` : '';

    await fetch(
      `${
        CONFIG.API_URL
      }/expenses?page=${currentPage}&limit=${4}${categoryParam}${minPriceParam}${maxPriceParam}`
    )
      .then((res) => res.json())
      .then((resJson) =>
        setExpenseResponse(() => {
          setExpenseArray(resJson.data);
          return resJson;
        })
      );
  };

  // const getExpenseName = async (id: string) => {
  //   fetch(`${CONFIG.API_URL}/expenses/${id}`)
  //     .then((res) => res.json())
  //     .then((resJson) => setExpenseName(resJson.name));

  //   // const res = await fetch(`${CONFIG.API_URL}/expenses/${id}`);
  //   // const resJson = await res.json();
  // };

  // const handleCheckbox = (text: string) => {
  //   let temp = categoryStatus;

  //   temp[text.toLowerCase()] = !temp[text.toLowerCase()];

  //   setCategoryStatus(temp);
  //   console.log(categoryStatus);
  //   getExpenseData();
  // };

  const handleMinChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log('TYPE EVENT TARGET VALUE', typeof event.target.value);

    const newValue = parseInt(event.target.value) || 0;

    console.log('VALUE', newValue);

    console.log('MIN PRICE BEFORE SET', minPrice);
    setMinPrice(newValue);
    setCurrentPage(1);
    console.log('MIN PRICE AFTER SET', minPrice);
  };

  const handleMaxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value) || 0;
    setMaxPrice(newValue);
    setCurrentPage(1);
  };

  useEffect(() => {
    getExpenseData();
  }, [categoryIdSelect, minPrice, maxPrice, currentPage]);

  fetch(`${CONFIG.API_URL}/expenses/category`)
    .then((res) => res.json())
    .then((resJson) => {
      // console.log(resJson);

      resJson.forEach((element: CategoryResponseType) => {
        const index = categoryNames.indexOf(element.name);
        // console.log(index, element.name, element.id);

        categoryIds[index] = element.id;
      });

      // console.log(categoryIds);
    });

  const handlePagination = (paginationText: number | string) => {
    if (
      typeof paginationText == 'string' &&
      (paginationText == '<' || paginationText == '>')
    ) {
      console.log('arrow');
      switch (paginationText) {
        case '<':
          setCurrentPage(currentPage - 1);
          break;
        case '>':
          setCurrentPage(currentPage + 1);
          break;
      }
    } else if (typeof paginationText == 'number') {
      console.log('hello');
      setCurrentPage(paginationText);
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
          // paginationArray = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', secondLastPage, firstLastPage]
          paginationArray.push(1);

          if (currentPage - 1 != 2) {
            paginationArray.push('...');
          }

          paginationArray.push(currentPage - 1, currentPage, currentPage + 1);

          if (currentPage + 1 != secondLastPage) {
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
        console.log('PGINATION 5 KEBAWAH DAN BUKAN 1');
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
              // getExpenseName(data.id);

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

        {/* <Card category='Food' name='Pizza' cost={50} />
        <Card category='Food' name='Pizza' cost={50} />
        <Card category='Food' name='Pizza' cost={50} />
        <Card category='Food' name='Pizza' cost={50} /> */}
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

            return (
              <label
                key={index}
                className='form-check-label'
                onClick={() => {
                  // handleCheckbox(categoryName);
                  console.log(categoryIds[index]);
                  setCategoryIdSelect(categoryIds[index]);
                  setCurrentPage(1);
                }}
              >
                {/* {categoryStatus[categoryName.toLocaleLowerCase()] ||
                  categoryStatus[categoryName.toLocaleLowerCase()] === null ? (
                    <input
                      id={'radio-' + categoryName.toLowerCase()}
                      className='form-check-input'
                      type='radio'
                    />
                  ) : (
                    <input
                      id={'radio-' + categoryName.toLowerCase()}
                      className='form-check-input'
                      type='radio'
                    />
                  )} */}
                <input
                  className='form-check-input'
                  type='radio'
                  name='categoryName'
                />
                {emoji + categoryName}
              </label>
            );
          })}

          {/* <Checkbox
            text='Housing'
            categoryStatus={categoryStatus}
            setCategoryStatus={setCategoryStatus}
          />
          <Checkbox
            text='Food'
            categoryStatus={categoryStatus}
            setCategoryStatus={setCategoryStatus}
          />
          <Checkbox
            text='Transportation'
            categoryStatus={categoryStatus}
            setCategoryStatus={setCategoryStatus}
          />
          <Checkbox
            text='Personal Spending'
            categoryStatus={categoryStatus}
            setCategoryStatus={setCategoryStatus}
          /> */}
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
                value={minPrice}
                onChange={handleMinChange}
              />
            </div>

            <div id='max-filter-div' className='min-max-flex'>
              <label>Max</label>
              <input
                className='min-max-input-filter'
                type='number'
                value={maxPrice}
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

        {/* <button className='btn btn-light pagination-btn text-center'>
          &lt;
        </button>
        <button className='btn btn-light pagination-btn text-center'>1</button>
        <button className='btn btn-light pagination-btn text-center'>2</button>
        <button className='btn btn-light pagination-btn text-center'>
          ...
        </button>
        <button className='btn btn-light pagination-btn text-center'>5</button>
        <button className='btn btn-light pagination-btn text-center'>6</button>
        <button className='btn btn-light pagination-btn text-center'>
          &gt;
        </button> */}
      </div>
    </div>
  );
};

export default Home;
