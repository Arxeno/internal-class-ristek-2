import React, { useEffect, useState } from 'react';
import CONFIG from '../config';

const TotalExpense = () => {
  const [amount, setAmount] = useState<number>(0);

  const getTotalAmountExpense = () => {
    fetch(`${CONFIG.API_URL}/expenses/total`)
      .then((res) => res.json())
      .then((resJson) => setAmount(resJson.total));
  };

  useEffect(() => {
    getTotalAmountExpense();
  }, []);

  return (
    <div className='container card'>
      <p>Current Expenses</p>
      <p>💵{amount}</p>
    </div>
  );
};

export default TotalExpense;
