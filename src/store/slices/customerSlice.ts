import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { apiUrl, tokenBearerKey } from '../../utils/constants'

interface CustomerOrder {
    id: number;
    orderDate: string;
    notes: string;
    totalAmount: number;
    totalDiscount: number;
    finalAmount: number;
    customer: {
        id: number;
        name: string;
        phone: string;
    }
    orderItems: {
        productId: number;
        productName: string;
        sellingPrice: number;
        quantity: number;
        discount: number;
        subtotal: number;
    }[];
}
interface GetAllCustomersParams {
    token: string | null;
    params?: Record<string, unknown>;
}
interface GetCustomersPayments {
    token: string | null;
    customerId: string | undefined;
}
interface GetCustomersPaymentsResponse {
    message: string;
    data: [];
}
interface MetaData {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}
interface Customer {
    id: string;
    name: string;
    phone: string;
    moneyOwed: number;
    payments: [] | null;
    orders: [] | null;
    totalPayments: number;
    outstandingBalance: number;
    totalOrderAmount: number;
}
interface AddCustomerParams {
    token: string | null;
    body: {
        id: number,
        name: string;
        phone: string;
        moneyOwed: number;
    };
}
interface GetCustomerResponse {
    data: Customer;
    message: string;
}
interface GetAllCustomersResponse {
    data: {
        items: Customer[],
        totalCount: number;
        pageNumber: number;
        pageSize: number;
        totalPages: number;
    };
}
interface GetCustomerOrdersResponse {
    data: {
        items: CustomerOrder[],
        totalCount: number;
        pageNumber: number;
        pageSize: number;
        totalPages: number;
    };
}
interface AxiosError {
    response?: {
        errors?: string[];
    };
}
interface DeleteCustomerResponse {
    message: string;
    data: null | number;
}
interface DeleteCustomerInfoParams {
    token: string | null;
    ids?: (string | number)[];
    params?: Record<string, unknown>;
}
interface GetCustomerInfoParams {
    token: string | null;
    customerId?: string;
    params?: Record<string, unknown>;
}
interface UpdateCustomerResponse {
    message: string;
    data: Customer;
}
interface UpdateCustomerParams {
    token: string | null;
    customerId: string | undefined;
    body: {
        id: string | number;
        name: string;
        phone: string;
        moneyOwed: number | string;
    }
}

export const getAllCustomers = createAsyncThunk<GetAllCustomersResponse, GetAllCustomersParams>(
    "customers/getAllCustomers",
    async ({ token, params }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetAllCustomersResponse>(`${apiUrl}/Customers`, {
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
export const getCustomerPayments = createAsyncThunk<GetCustomersPaymentsResponse, GetCustomersPayments>(
    "customers/getCustomerPayments",
    async ({ token, customerId }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetCustomersPaymentsResponse>(`${apiUrl}/Customers/${customerId}/payments`, {
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
export const getCustomerOrders = createAsyncThunk<GetCustomerOrdersResponse, GetCustomersPayments>(
    "customers/getCustomerOrders",
    async ({ token, customerId }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetCustomerOrdersResponse>(`${apiUrl}/Order/customer/${customerId}/orders`, {
                headers: {
                    Authorization: `${tokenBearerKey}${token}`,
                },
            });
            console.log(response.data);

            return response.data;
        } catch (error) {
            console.log(error);

            const typedError = error as AxiosError;
            return rejectWithValue(typedError.response?.errors || "An error occurred");
        }
    }
);

export const getCustomerInfo = createAsyncThunk<GetCustomerResponse, GetCustomerInfoParams>(
    "customers/getCustomerInfo",
    async ({ token, params, customerId }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetCustomerResponse>(`${apiUrl}/Customers/${customerId}`, {
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

export const deleteCustomer = createAsyncThunk<DeleteCustomerResponse, DeleteCustomerInfoParams>(
    "customers/deleteCustomer",
    async ({ token, ids }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            ids?.forEach((id) => formData.append("ids", id.toString()));

            // Send DELETE request with multipart/form-data
            const response = await axios.delete<DeleteCustomerResponse>(
                `${apiUrl}/Customers/delete-multiple`,
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

export const updateCustomer = createAsyncThunk<UpdateCustomerResponse, UpdateCustomerParams>(
    "customers/updateCustomer",
    async ({ token, customerId, body }, { rejectWithValue }) => {
        try {
            const response = await axios.put<UpdateCustomerResponse>(`${apiUrl}/Customers/${customerId}`, body, {
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

export const addCustomer = createAsyncThunk<UpdateCustomerResponse, AddCustomerParams>(
    "customers/addCustomer",
    async ({ token, body }, { rejectWithValue }) => {
        try {
            const response = await axios.post<UpdateCustomerResponse>(`${apiUrl}/Customers`, body, {
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
interface CustomerState {
    customers: Customer[];
    metaData: MetaData;
    customer: Customer | null;
    customer_payments: [];
    customer_orders: CustomerOrder[];
    loading: boolean;
    message: string;
    rowsEffected: number | null;
    error: string | null;
}

// Initial state
const initialState: CustomerState = {
    customers: [],
    customer_payments: [],
    customer_orders: [],
    customer: {
        id: "",
        name: '',
        phone: '',
        moneyOwed: 0,
        orders: [],
        payments: [],
        outstandingBalance: 0,
        totalOrderAmount: 0,
        totalPayments: 0
    },
    metaData: {
        pageNumber: 0,
        pageSize: 0,
        totalCount: 0,
        totalPages: 0
    },
    message: "",
    rowsEffected: 0,
    loading: false,
    error: null,
};

// Create the slice
const customerSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllCustomers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCustomers.fulfilled, (state, action: PayloadAction<GetAllCustomersResponse>) => {
                state.loading = false;
                state.customers = action.payload.data.items;
                state.metaData.pageNumber = action.payload.data.pageNumber;
                state.metaData.pageSize = action.payload.data.pageSize;
                state.metaData.totalCount = action.payload.data.totalCount;
                state.metaData.totalPages = action.payload.data.totalPages;
            })
            .addCase(getAllCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- getCustomerInfo------------------------------------------
            .addCase(getCustomerInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCustomerInfo.fulfilled, (state, action: PayloadAction<GetCustomerResponse>) => {
                state.loading = false;
                state.message = action.payload.message
                state.customer = action.payload.data;
            })
            .addCase(getCustomerInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- getCustomerPayments------------------------------------------
            .addCase(getCustomerPayments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCustomerPayments.fulfilled, (state, action: PayloadAction<GetCustomersPaymentsResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
                state.customer_payments = action.payload.data;
            })
            .addCase(getCustomerPayments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- getCustomerOrders------------------------------------------
            .addCase(getCustomerOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCustomerOrders.fulfilled, (state, action: PayloadAction<GetCustomerOrdersResponse>) => {
                state.loading = false;
                state.customer_orders = action.payload.data?.items;
            })
            .addCase(getCustomerOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- addCustomer------------------------------------------
            .addCase(addCustomer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCustomer.fulfilled, (state, action: PayloadAction<UpdateCustomerResponse>) => {
                state.loading = false;
                state.message = action.payload.message
                state.customer = action.payload.data;
            })
            .addCase(addCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- updateCustomer------------------------------------------
            .addCase(updateCustomer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCustomer.fulfilled, (state, action: PayloadAction<UpdateCustomerResponse>) => {
                state.loading = false;
                state.message = action.payload.message
                state.customer = action.payload.data;
            })
            .addCase(updateCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- deleteCustomer------------------------------------------
            .addCase(deleteCustomer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCustomer.fulfilled, (state, action: PayloadAction<DeleteCustomerResponse>) => {
                state.loading = false;
                state.message = action.payload.message
                state.rowsEffected = action.payload.data;
            })
            .addCase(deleteCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default customerSlice.reducer;
