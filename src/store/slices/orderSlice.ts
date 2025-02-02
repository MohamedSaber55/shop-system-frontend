import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { apiUrl, tokenBearerKey } from '../../utils/constants'

// Define the types for the parameters and the response
interface GetAllOrdersParams {
    token: string | null;
    params?: Record<string, unknown>;
}
interface OrderItem {
    productId: number;
    productName: number;
    quantity: number;
    discount: number;
    subtotal: number;
}
interface Profit {
    orderId: string;
    profit: number;
    orderDate: string;
}

interface Order {
    id?: string;
    orderDate?: string;
    userId?: string;
    notes?: string;
    user?: {
        id?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
    };
    totalDiscount?: number;
    totalAmount?: number;
    customer: {
        id: number;
        name: string;
        phone: string;
    };
    orderItems: OrderItem[];
}
interface AddOrderResponse {
    message: string;
    data: Order;
}
interface AddOrderParams {
    token: string | null;
    body: {
        customerId: string | null;
        orderItems: {
            productId: string;
            quantity: number;
            discount: number;
            subTotal: number;
        }[];
    };
}
interface GetOrderResponse {
    data: Order;
    message: string
}
interface MetaData {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}
interface GetAllOrdersResponse<T> {
    data: {
        items: T[];
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
interface GetTodayOrdersResponse {
    message: string;
    data: Order[];
}
interface DeleteOrderResponse {
    message: string;
    data: null | number;
}
interface DeleteOrderInfoParams {
    token: string | null;
    ids: (number | string)[];
    params?: Record<string, unknown>;
}
interface GetOrderInfoParams {
    token: string | null;
    orderId?: string;
    params?: Record<string, unknown>;
}

interface UpdateOrderParams {
    token: string | null;
    orderId: number | string | undefined;
    body: {
        customerId: string | null;
        orderDate: string;
        notes: string;
        orderItems: {
            productId: string;
            quantity: number;
            discount: number;
            subTotal: number;
        }[];
    };
}

// Define the async thunk with types
export const getAllOrders = createAsyncThunk<GetAllOrdersResponse<Order>, GetAllOrdersParams>(
    "Orders/getAllOrders",
    async ({ token, params }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetAllOrdersResponse<Order>>(`${apiUrl}/Order`, {
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
export const getAllOrdersProfits = createAsyncThunk<GetAllOrdersResponse<Profit>, GetAllOrdersParams>(
    "Orders/getAllOrdersProfits",
    async ({ token, params }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetAllOrdersResponse<Profit>>(`${apiUrl}/Admin/profits`, {
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
export const getTodayOrders = createAsyncThunk<GetTodayOrdersResponse, GetAllOrdersParams>(
    "Orders/getTodayOrders",
    async ({ token, params }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetTodayOrdersResponse>(`${apiUrl}/Admin/todayOrders`, {
                headers: {
                    Authorization: `${tokenBearerKey}${token}`,
                },
                params: params,
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
export const getOrderInfo = createAsyncThunk<GetOrderResponse, GetOrderInfoParams>(
    "Orders/getOrderInfo",
    async ({ token, orderId }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetOrderResponse>(`${apiUrl}/Order/${orderId}`, {
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
export const getTotalRevenue = createAsyncThunk<DeleteOrderResponse, GetAllOrdersParams>(
    "Orders/getTotalRevenue",
    async ({ token }, { rejectWithValue }) => {
        try {
            const response = await axios.get<DeleteOrderResponse>(`${apiUrl}/Order/sumofamountofallorders`, {
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
export const getOrderTotalAmount = createAsyncThunk<DeleteOrderResponse, GetOrderInfoParams>(
    "Orders/getOrderTotalAmount",
    async ({ token, orderId }, { rejectWithValue }) => {
        try {
            const response = await axios.get<DeleteOrderResponse>(`${apiUrl}/Order/${orderId}/calculate-total`, {
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
export const getInvoiceInfo = createAsyncThunk<DeleteOrderResponse, GetOrderInfoParams>(
    "Orders/getInvoiceInfo",
    async ({ token, orderId }, { rejectWithValue }) => {
        try {
            const response = await axios.get<DeleteOrderResponse>(`${apiUrl}/Order/${orderId}/invoice`, {
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
export const printInvoice = createAsyncThunk<void, GetOrderInfoParams>(
    "Orders/printInvoice",
    async ({ token, orderId }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${apiUrl}/Order/generate/${orderId}`, {
                headers: {
                    Authorization: `${tokenBearerKey}${token}`,
                },
                responseType: "blob",
            });
            // Extract the filename from content-disposition header
            const contentDisposition = response.headers['content-disposition'];
            const filename = contentDisposition
                ?.split('filename=')[1]
                ?.split(';')[0]
                ?.replace(/"/g, "") || "invoice.pdf";

            // Create a Blob and download the file
            const blob = new Blob([response.data], { type: "application/pdf" });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            return response.data;
        } catch (error) {
            const typedError = error as AxiosError;
            return rejectWithValue(typedError.response?.errors || "An error occurred");
        }
    }
);

// export const deleteOrder = createAsyncThunk<DeleteOrderResponse, DeleteOrderInfoParams>(
//     "Orders/deleteOrder",
//     async ({ token, ids }, { rejectWithValue }) => {
//         try {
//             const formData = new FormData();
//             ids?.forEach((id) => formData.append("ids", id.toString()));

//             const response = await axios.delete<DeleteOrderResponse>(
//                 `${apiUrl}/Order`,
//                 {
//                     data: formData,
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                         Authorization: `${tokenBearerKey}${token}`,
//                     },
//                 }
//             );

//             return response.data;
//         } catch (error) {
//             const typedError = error as AxiosError;
//             console.error("Error deleting Orders:", error);
//             return rejectWithValue(typedError.response?.errors || "An error occurred");
//         }
//     }
// );

export const deleteOrder = createAsyncThunk<DeleteOrderResponse, DeleteOrderInfoParams>(
    "Orders/deleteOrder",
    async ({ token, ids }, { rejectWithValue }) => {
        try {
            const response = await axios.delete<DeleteOrderResponse>(
                `${apiUrl}/Order`,
                {
                    data: ids,
                    headers: {
                        Authorization: `${tokenBearerKey}${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            const typedError = error as AxiosError;
            return rejectWithValue(
                typedError.response?.errors || "An error occurred while deleting orders."
            );
        }
    }
);

export const updateOrder = createAsyncThunk<AddOrderResponse, UpdateOrderParams>(
    "Orders/updateOrder",
    async ({ token, orderId, body }, { rejectWithValue }) => {
        try {
            const response = await axios.put<AddOrderResponse>(`${apiUrl}/Order/${orderId}`, body, {
                headers: {
                    Authorization: `${tokenBearerKey}${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.log(error);
            const typedError = error as AxiosError;
            return rejectWithValue(typedError.response?.errors || "An error occurred");
        }
    }
);

export const addOrder = createAsyncThunk<AddOrderResponse, AddOrderParams>(
    "Orders/addOrder",
    async ({ token, body }, { rejectWithValue }) => {
        try {
            const response = await axios.post<AddOrderResponse>(`${apiUrl}/Order`, body, {
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
interface OrdersState {
    orders: Order[];
    profits: Profit[];
    today_orders: Order[];
    order: Order | null;
    loading: boolean;
    metaData: MetaData;
    message: string;
    total_revenue: number | null;
    rowsEffected: number | null;
    error: string | null;
}

// Initial state
const initialState: OrdersState = {
    orders: [],
    profits: [],
    today_orders: [],
    order: {
        id: '',
        customer: {
            id: 0,
            name: '',
            phone: '',
        },
        orderDate: '',
        orderItems: [],
        userId: "",
        totalAmount: 0,
        totalDiscount: 0,
    },
    metaData: {
        pageNumber: 0,
        pageSize: 0,
        totalCount: 0,
        totalPages: 0
    },
    message: "",
    rowsEffected: 0,
    total_revenue: 0,
    loading: false,
    error: null,
};

// Create the slice
const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //------------------------------- getAllOrders------------------------------------------
            .addCase(getAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllOrders.fulfilled, (state, action: PayloadAction<GetAllOrdersResponse<Order>>) => {
                state.loading = false;
                state.orders = action.payload.data.items;
                state.metaData.pageNumber = action.payload.data.pageNumber;
                state.metaData.pageSize = action.payload.data.pageSize;
                state.metaData.totalCount = action.payload.data.totalCount;
                state.metaData.totalPages = action.payload.data.totalPages;
            })
            .addCase(getAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- getAllOrdersProfits------------------------------------------
            .addCase(getAllOrdersProfits.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllOrdersProfits.fulfilled, (state, action: PayloadAction<GetAllOrdersResponse<Profit>>) => {
                state.loading = false;
                state.profits = action.payload.data.items;
                state.metaData.pageNumber = action.payload.data.pageNumber;
                state.metaData.pageSize = action.payload.data.pageSize;
                state.metaData.totalCount = action.payload.data.totalCount;
                state.metaData.totalPages = action.payload.data.totalPages;
            })
            .addCase(getAllOrdersProfits.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- getTodayOrders------------------------------------------
            .addCase(getTodayOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTodayOrders.fulfilled, (state, action: PayloadAction<GetTodayOrdersResponse>) => {
                state.loading = false;
                state.today_orders = action.payload.data;
            })
            .addCase(getTodayOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- getOrderInfo------------------------------------------
            .addCase(getOrderInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrderInfo.fulfilled, (state, action: PayloadAction<GetOrderResponse>) => {
                state.loading = false;
                state.message = action.payload.message
                state.order = action.payload.data;
            })
            .addCase(getOrderInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- getTotalRevenue------------------------------------------
            .addCase(getTotalRevenue.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTotalRevenue.fulfilled, (state, action: PayloadAction<DeleteOrderResponse>) => {
                state.loading = false;
                state.message = action.payload.message
                state.total_revenue = action.payload.data;
            })
            .addCase(getTotalRevenue.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- addOrder------------------------------------------
            .addCase(addOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addOrder.fulfilled, (state, action: PayloadAction<AddOrderResponse>) => {
                state.loading = false;
                state.message = action.payload.message
                state.order = action.payload.data;
            })
            .addCase(addOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- deleteOrder------------------------------------------
            .addCase(deleteOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOrder.fulfilled, (state, action: PayloadAction<DeleteOrderResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
                state.rowsEffected = action.payload.data;
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- updateOrder------------------------------------------
            .addCase(updateOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrder.fulfilled, (state, action: PayloadAction<AddOrderResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
                state.order = action.payload.data;
            })
            .addCase(updateOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});


export default ordersSlice.reducer;
