import { useEffect, useState } from 'react';
import CONFIG from '../config';
import { Link } from 'react-router-dom';

type Props = {
  expenseId: string;
  category: string;
  amount: number;
};

const Card = ({ expenseId, category, amount }: Props) => {
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

  const linkStyle = {
    textDecoration: 'none',
  };

  useEffect(() => getExpenseName(), []);

  return (
    <Link to={`/expense/${expenseId}`} style={linkStyle}>
      <div className='container card expense-card btn btn-light'>
        <div className='emoji'>{expenseEmoji}</div>
        <p className='card-text category'>{category}</p>
        <p className='card-title name'>{expenseName}</p>
        <p className='money'>💵{amount}</p>
      </div>
    </Link>
  );
};

export default Card;
