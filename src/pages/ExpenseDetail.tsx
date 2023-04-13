import React, { useEffect, useState } from 'react';
import './ExpenseDetail.scss';
import CONFIG from '../config';
import { Link, useParams } from 'react-router-dom';

const ExpenseDetail = () => {
  const { expenseId } = useParams();
  console.log(expenseId);

  const [expenseData, setExpenseData] = useState(null);
  const [emoji, setEmoji] = useState('🛒');
  const [expenseName, setExpenseName] = useState(null);
  const [price, setPrice] = useState(0);
  const [id, setId] = useState(null);
  const [category, setCategory] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [notes, setNotes] = useState(null);

  const getDetailData = () => {
    fetch(`${CONFIG.API_URL}/expenses/${expenseId}`)
      .then((res) => res.json())
      .then((resJson) => {
        setExpenseData(resJson);
        setExpenseName(resJson.name);
        setPrice(resJson.amount);
        setId(resJson.id);
        setCategory(resJson.category.name);

        const date = new Date(resJson.created_at);
        const dateArray = date.toString().split(' ');
        const timeZone = `${dateArray[6].replace('(', '')} ${
          dateArray[7]
        } ${dateArray[8].replace(')', '')}`;
        console.log(timeZone);
        let hour: number | string = date.getHours();
        let minute: number | string = date.getMinutes();
        if (hour < 10) {
          hour = `0${hour}`;
        }
        if (minute < 10) {
          minute = `0${minute}`;
        }
        setTime(`${date.toDateString()}, ${hour}:${minute} ${timeZone}`);

        setNotes(resJson.description);

        switch (resJson.category.name.toLowerCase()) {
          case 'housing':
            setEmoji('🏠');
            break;
          case 'food':
            setEmoji('🍽️');
            break;
          case 'transportation':
            setEmoji('🚗');
            break;
          case 'personal spending':
            setEmoji('😋');
            break;
        }
      });
  };

  const linkStyle = {
    color: 'black',
    fontSize: '2rem',
    fontWeight: 'bold',
  };

  useEffect(() => {
    getDetailData();
  }, []);

  return (
    <div>
      <Link to='/' style={linkStyle}>
        Back
      </Link>
      <div id='expense-detail' className='card'>
        <h1 id='expense-name'>
          {emoji}
          {expenseName}
        </h1>
        <h2 id='price'>💵{price}</h2>

        <div id='transaction-details'>
          <hr />
          <h4>Transaction Details</h4>
          <div className='content'>
            <p>ID</p>
            <p className='align-right'>{id}</p>
            <p>Type</p>
            <p className='align-right'>{category}</p>
            <p>Time</p>
            <p className='align-right'>{time}</p>
          </div>
        </div>

        <div id='notes'>
          <hr />
          <h4>Notes</h4>
          <p>{notes}</p>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetail;
