import { createContext, useState } from 'react';
import { GlobalStateType } from './type';

const defaultValue: GlobalStateType = {
  currentPage: {
    state: 1,
    setState: (page: number) => {},
  },
  categoryIdSelect: {
    state: null,
    setState: (categoryId: string) => {},
  },
  minPrice: {
    state: 0,
    setState: (x: number) => {},
  },
  maxPrice: {
    state: 0,
    setState: (x: number) => {},
  },
};

const GlobalStateContext = createContext(defaultValue);

type Props = {
  children: JSX.Element;
};

const GlobalStateProvider = ({ children }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryIdSelect, setCategoryIdSelect] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  const valueToShare = {
    currentPage: {
      state: currentPage,
      setState: (page: number) => {
        setCurrentPage(page);
      },
    },
    categoryIdSelect: {
      state: categoryIdSelect,
      setState: (categoryId: string) => {
        setCategoryIdSelect(categoryId);
      },
    },
    minPrice: {
      state: minPrice,
      setState: (x: number) => {
        setMinPrice(x);
      },
    },
    maxPrice: {
      state: maxPrice,
      setState: (x: number) => {
        setMaxPrice(x);
      },
    },
  };

  return (
    <GlobalStateContext.Provider value={valueToShare}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export { GlobalStateProvider };
export default GlobalStateContext;
