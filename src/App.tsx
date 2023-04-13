import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Card from './components/Card';
// import Checkbox from './components/Checkbox';
import CONFIG from './config';
import { useEffect, useState } from 'react';
import TotalExpense from './components/TotalExpense';
import Home from './pages/Home';
import './App.scss';
import ExpenseDetail from './pages/ExpenseDetail';

const App = () => {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/expense' element={<Home />} />
          <Route path='/expense/:expenseId' element={<ExpenseDetail />} />
        </Routes>
        {/* <Home /> */}
        {/* <ExpenseDetail expenseId='b0a396cf-0813-4ad6-bf61-246b0aa1b645' /> */}
      </div>
    </Router>
  );
};

export default App;
