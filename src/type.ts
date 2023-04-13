export type ExpenseType = {
	id: string;
	amount: number;
	created_at: string;
	category: {
		name: string;
	}
}

export type CategoryResponseType = {
	id: string;
	name: string;
}

export type ExpenseResponseType = {
	data: ExpenseType[];
	paging: {
		page: number;
		limit: 4;
		itemCount: number;
		pageCount: number;
		hasPreviousPage: boolean;
		hasNextPage: boolean
	}
}

export type GlobalStateType = {
  currentPage: {
    state: number;
    setState: (page: number) => void;
  };
  categoryIdSelect: {
    state: string | null;
    setState: (categoryId: string) => void;
  };
  minPrice: {
    state: number;
    setState: (x: number) => void;
  };
  maxPrice: {
    state: number;
    setState: (x: number) => void;
  };
}