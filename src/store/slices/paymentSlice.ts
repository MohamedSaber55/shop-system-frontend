import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { apiUrl, tokenBearerKey } from '../../utils/constants'

// Define the types for the parameters and the response
interface GetAllPaymentsParams {
    token: string | null;
    params?: Record<string, unknown>;
}
interface Payment {
    id?: string;
    amount: number;
    customerId: string;
    date: string;
    info: string;
}
interface AddPaymentResponse {
    message: string;
    data: Payment;
}
interface AddPaymentParams {
    token: string | null;
    body: Payment;
}
interface GetPaymentResponse {
    data: Payment;
    message: string
}
interface MetaData {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}
interface GetAllPaymentsResponse {
    data: {
        items: Payment[];
        totalCount: number;
        pageNumber: number;
        pageSize: number;
        totalPages: number;
    }
}
interface AxiosError {
    response?: {
        errors?: string[];
    };
}
interface DeletePaymentResponse {
    message: string;
    data: null | number;
}
interface DeletePaymentInfoParams {
    token: string | null;
    ids: (number | string)[];
    params?: Record<string, unknown>;
}
interface GetPaymentInfoParams {
    token: string | null;
    paymentId?: string ;
    params?: Record<string, unknown>;
}
interface UpdatePaymentParams {
    token: string | null;
    paymentId: number | string | undefined;
    body: {
        id?: string | number;
        amount: number;
        customerId: string;
        date: string;
        info: string;
    }
}

// Define the async thunk with types
export const getAllPayments = createAsyncThunk<GetAllPaymentsResponse, GetAllPaymentsParams>(
    "payments/getAllPayments",
    async ({ token, params }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetAllPaymentsResponse>(`${apiUrl}/Payments`, {
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
export const getPaymentInfo = createAsyncThunk<GetPaymentResponse, GetPaymentInfoParams>(
    "payments/getPaymentInfo",
    async ({ token, params, paymentId }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetPaymentResponse>(`${apiUrl}/Payments/${paymentId}`, {
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

export const deletePayment = createAsyncThunk<DeletePaymentResponse, DeletePaymentInfoParams>(
    "payments/deletePayment",
    async ({ token, ids }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            ids?.forEach((id) => formData.append("ids", id.toString()));
            const response = await axios.delete<DeletePaymentResponse>(
                `${apiUrl}/Payments/delete-multiple`,
                {
                    data: formData,
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `${tokenBearerKey}${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            const typedError = error as AxiosError;
            console.error("Error deleting payments:", error);
            return rejectWithValue(typedError.response?.errors || "An error occurred");
        }
    }
);

export const updatePayment = createAsyncThunk<AddPaymentResponse, UpdatePaymentParams>(
    "payments/updatePayment",
    async ({ token, paymentId, body }, { rejectWithValue }) => {
        try {
            const response = await axios.put<AddPaymentResponse>(`${apiUrl}/Payments/${paymentId}`, body, {
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
export const addPayment = createAsyncThunk<AddPaymentResponse, AddPaymentParams>(
    "payments/addPayment",
    async ({ token, body }, { rejectWithValue }) => {
        try {
            const response = await axios.post<AddPaymentResponse>(`${apiUrl}/Payments`, body, {
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
interface paymentsState {
    payments: Payment[];
    payment: Payment | null;
    loading: boolean;
    metaData: MetaData;
    message: string;
    rowsEffected: number | null;
    error: string | null;
}

// Initial state
const initialState: paymentsState = {
    payments: [],
    payment: {
        id: '',
        amount: 0,
        customerId: '',
        date: '',
        info: '',
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
const paymentsSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //------------------------------- getAllPayments------------------------------------------
            .addCase(getAllPayments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllPayments.fulfilled, (state, action: PayloadAction<GetAllPaymentsResponse>) => {
                state.loading = false;
                state.payments = action.payload.data.items;
                state.metaData.pageNumber = action.payload.data.pageNumber;
                state.metaData.pageSize = action.payload.data.pageSize;
                state.metaData.totalCount = action.payload.data.totalCount;
                state.metaData.totalPages = action.payload.data.totalPages;
            })
            .addCase(getAllPayments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- getPaymentInfo------------------------------------------
            .addCase(getPaymentInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPaymentInfo.fulfilled, (state, action: PayloadAction<GetPaymentResponse>) => {
                state.loading = false;
                state.message = action.payload.message
                state.payment = action.payload.data;
            })
            .addCase(getPaymentInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- addPayment------------------------------------------
            .addCase(addPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPayment.fulfilled, (state, action: PayloadAction<AddPaymentResponse>) => {
                state.loading = false;
                state.message = action.payload.message
                state.payment = action.payload.data;
            })
            .addCase(addPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- deletePayment------------------------------------------
            .addCase(deletePayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePayment.fulfilled, (state, action: PayloadAction<DeletePaymentResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
                state.rowsEffected = action.payload.data;
            })
            .addCase(deletePayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- updatePayment------------------------------------------
            .addCase(updatePayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePayment.fulfilled, (state, action: PayloadAction<AddPaymentResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
                state.payment = action.payload.data;
            })
            .addCase(updatePayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});


export default paymentsSlice.reducer;
