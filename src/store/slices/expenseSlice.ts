import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { apiUrl, tokenBearerKey } from '../../utils/constants'

// Define the types for the parameters and the response
interface GetAllExpensesParams {
    token: string | null;
    params?: Record<string, unknown>;
}
interface MetaData {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

interface Expense {
    id: number;
    amount: number;
    category: string;
    date: string;
    info: string;
}
interface AddExpenseResponse {
    data: Expense,
    message: string,
}
interface AddExpenseParams {
    token: string | null;
    body: {
        id: number,
        amount: string;
        category: number;
        date: string;
        info: string;
    };
}
interface GetExpenseResponse {
    data: Expense;
    message: string
}
interface GetTotalExpenseResponse {
    data: number | null;
    message: string
}

interface GetAllExpensesResponse {
    data: {
        items: Expense[];
        totalCount: number;
        pageNumber: number;
        pageSize: number;
        totalPages: number;
    }
}

export interface DeleteExpenseResponse {
    message: string;
    data: number | null;
}

interface AxiosError {
    response?: {
        errors?: string[];
    };
}

interface DeleteExpenseInfoParams {
    token: string | null;
    ids?: (number | string)[];
    params?: Record<string, unknown>;
}
interface GetExpenseInfoParams {
    token: string | null;
    expenseId?: string;
    params?: Record<string, unknown>;
}
interface UpdateExpenseParams {
    token: string | null;
    expenseId: string | undefined;
    body: {
        id: number | string;
        amount: number | string;
        date: string;
        category: number | string;
        info: string;
    }
}

// Define the async thunk with types
export const getAllExpenses = createAsyncThunk<GetAllExpensesResponse, GetAllExpensesParams>(
    "expenses/getAllExpenses",
    async ({ token, params }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetAllExpensesResponse>(`${apiUrl}/expenses`, {
                headers: {
                    Authorization: `${tokenBearerKey}${token}`,
                },
                params: params,
            });
            return response.data;
        } catch (error) {
            const typedError = error as AxiosError;
            return rejectWithValue(typedError.response?.errors || "An error occurred");
        }
    }
);
export const getExpenseInfo = createAsyncThunk<GetExpenseResponse, GetExpenseInfoParams>(
    "expenses/getExpenseInfo",
    async ({ token, params, expenseId }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetExpenseResponse>(`${apiUrl}/expenses/${expenseId}`, {
                headers: {
                    Authorization: `${tokenBearerKey}${token}`,
                },
                params: params,
            });

            return response.data;
        } catch (error) {
            const typedError = error as AxiosError;
            return rejectWithValue(typedError.response?.errors || "An error occurred");
        }
    }
);
export const getTotalExpenses = createAsyncThunk<GetTotalExpenseResponse, GetExpenseInfoParams>(
    "expenses/getTotalExpenses",
    async ({ token }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetTotalExpenseResponse>(`${apiUrl}/expenses/total`, {
                headers: {
                    Authorization: `${tokenBearerKey}${token}`,
                },
            });

            return response.data;
        } catch (error) {
            const typedError = error as AxiosError;
            return rejectWithValue(typedError.response?.errors || "An error occurred");
        }
    }
);
export const deleteExpense = createAsyncThunk<DeleteExpenseResponse, DeleteExpenseInfoParams>(
    "expenses/deleteExpense",
    async ({ token, ids }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            ids?.forEach((id) => formData.append("ids", id.toString()));

            // Send DELETE request with multipart/form-data
            const response = await axios.delete<DeleteExpenseResponse>(
                `${apiUrl}/Expenses/delete-multiple`,
                {
                    data: formData, // Axios supports data in DELETE requests
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `${tokenBearerKey}${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const typedError = error as AxiosError;
            return rejectWithValue(typedError.response?.errors || "An error occurred");
        }
    }
);
export const updateExpense = createAsyncThunk<AddExpenseResponse, UpdateExpenseParams>(
    "expenses/updateExpense",
    async ({ token, expenseId, body }, { rejectWithValue }) => {
        try {
            const response = await axios.put<AddExpenseResponse>(`${apiUrl}/expenses/${expenseId}`, body, {
                headers: {
                    Authorization: `${tokenBearerKey}${token}`,
                },
            });
            return response.data;
        } catch (error) {
            const typedError = error as AxiosError;
            return rejectWithValue(typedError.response?.errors || "An error occurred");
        }
    }
);
export const addExpense = createAsyncThunk<AddExpenseResponse, AddExpenseParams>(
    "expenses/addExpense",
    async ({ token, body }, { rejectWithValue }) => {
        try {
            const response = await axios.post<AddExpenseResponse>(`${apiUrl}/expenses`, body, {
                headers: {
                    Authorization: `${tokenBearerKey}${token}`,
                },
            });
            return response.data;
        } catch (error) {
            const typedError = error as AxiosError;
            return rejectWithValue(typedError.response?.errors || "An error occurred");
        }
    }
);


// Define the initial state type
interface expenseState {
    expenses: Expense[];
    expense: Expense | null;
    loading: boolean;
    message: string;
    metaData: MetaData;
    total_expenses: null | number;
    rowsEffected: null | number;
    error: string | null;
}

// Initial state
const initialState: expenseState = {
    expenses: [],
    expense: {
        id: 0,
        amount: 0,
        date: '',
        category: '',
        info: ''
    },
    metaData: {
        totalCount: 0,
        pageNumber: 0,
        pageSize: 0,
        totalPages: 0
    },
    message: "",
    rowsEffected: null,
    total_expenses: 0,
    loading: false,
    error: null,
};

// Create the slice
const expenseSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //------------------------------- getAllExpenses------------------------------------------
            .addCase(getAllExpenses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllExpenses.fulfilled, (state, action: PayloadAction<GetAllExpensesResponse>) => {
                state.loading = false;
                state.expenses = action.payload.data.items;
                state.metaData.pageNumber = action.payload.data.pageNumber;
                state.metaData.pageSize = action.payload.data.pageSize;
                state.metaData.totalCount = action.payload.data.totalCount;
                state.metaData.totalPages = action.payload.data.totalPages;
            })
            .addCase(getAllExpenses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- getExpenseInfo------------------------------------------
            .addCase(getExpenseInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getExpenseInfo.fulfilled, (state, action: PayloadAction<GetExpenseResponse>) => {
                state.loading = false;
                state.message = action.payload.message
                state.expense = action.payload.data;
            })
            .addCase(getExpenseInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- getTotalExpenses------------------------------------------
            .addCase(getTotalExpenses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTotalExpenses.fulfilled, (state, action: PayloadAction<GetTotalExpenseResponse>) => {
                state.loading = false;
                state.message = action.payload.message
                state.total_expenses = action.payload.data;
            })
            .addCase(getTotalExpenses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- addExpense------------------------------------------
            .addCase(addExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addExpense.fulfilled, (state, action: PayloadAction<AddExpenseResponse>) => {
                state.loading = false;
                state.message = action.payload.message
                state.expense = action.payload.data;
            })
            .addCase(addExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- updateExpense------------------------------------------
            .addCase(updateExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateExpense.fulfilled, (state, action: PayloadAction<AddExpenseResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
                state.expense = action.payload.data;
            })
            .addCase(updateExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- deleteExpense------------------------------------------
            .addCase(deleteExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteExpense.fulfilled, (state, action: PayloadAction<DeleteExpenseResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
                state.rowsEffected = action.payload.data;
            })
            .addCase(deleteExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});


export default expenseSlice.reducer;
