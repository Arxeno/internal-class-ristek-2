import { useEffect, useState } from 'react';
import CONFIG from '../config';

const Card = ({ expenseId, category, amount }) => {
  const [expenseName, setExpenseName] = useState('');

  const getExpenseName = () => {
    fetch(`${CONFIG.API_URL}/expenses/${expenseId}`)
      .then((res) => res.json())
      .then((resJson) => setExpenseName(resJson.name));
  };

  let expenseEmoji = '🛒';

  switch (category.toLowerCase()) {
    case 'housing':
      expenseEmoji = '🏠';
      break;
    case 'food':
      expenseEmoji = '🍽️';
      break;
    case 'transportation':
      expenseEmoji = '🚗';
      break;
    case 'personal spending':
      expenseEmoji = '😋';
      break;
  }

  useEffect(() => getExpenseName(), []);

  return (
    <div className='container card expense-card btn btn-light'>
      <div className='emoji'>{expenseEmoji}</div>
      <p className='card-text category'>{category}</p>
      <p className='card-title name'>{expenseName}</p>
      <p className='money'>💵{amount}</p>
    </div>
  );
};

export default Card;
