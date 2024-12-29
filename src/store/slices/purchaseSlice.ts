import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { apiUrl, tokenBearerKey } from '../../utils/constants'

interface PurchaseItem {
    id: number;
    purchaseId: number;
    productName: string;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
}
interface BodyPurchaseItems {
    productName: string;
    quantity: number;
    pricePerUnit: number;
}
interface Merchant {
    id?: number | string;
    name: string;
    phone: string;
    address: string;
    outstandingBalance: string | number;
}
interface Purchase {
    id?: string;
    merchantId?: string;
    merchant?: Merchant;
    orderDate: string;
    totalAmount: number;
    notes: string;
    purchaseItems: PurchaseItem[];
}

interface GetAllPurchasesParams {
    token: string | null;
    params?: Record<string, unknown>;
}

interface AddPurchaseResponse {
    message: string;
    data: Purchase;
}

interface AddPurchaseParams {
    token: string | null;
    body: {
        merchantId: string;
        orderDate: string;
        notes: string;
        purchaseItems: BodyPurchaseItems[];
    };
}

interface GetPurchaseTotalAMountResponse {
    data: number;
    message: string
}

interface GetPurchaseTotalAMountParams {
    token: string | null;
    PurchaseId?: string;
}

interface GetPurchaseResponse {
    data: Purchase;
    message: string
}

interface MetaData {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

interface GetAllPurchasesResponse {
    data: {
        items: Purchase[];
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
interface DeletePurchaseResponse {
    message: string;
    data: null | number;
}
interface DeletePurchaseInfoParams {
    token: string | null;
    ids: (number | string)[];
    params?: Record<string, unknown>;
}
interface GetPurchaseInfoParams {
    token: string | null;
    PurchaseId?: string;
    params?: Record<string, unknown>;
}
interface UpdatePurchaseParams {
    token: string | null;
    PurchaseId: number | string | undefined;
    body: {
        id?: string;
        merchantId: string;
        orderDate: string;
        notes: string;
        purchaseItems: BodyPurchaseItems[];
    };
}

// Define the async thunk with types
export const getAllPurchases = createAsyncThunk<GetAllPurchasesResponse, GetAllPurchasesParams>(
    "purchases/getAllPurchases",
    async ({ token, params }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetAllPurchasesResponse>(`${apiUrl}/Purchase`, {
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
export const getPurchaseTotalAMount = createAsyncThunk<GetPurchaseTotalAMountResponse, GetPurchaseTotalAMountParams>(
    "purchases/getPurchaseTotalAMount",
    async ({ token, PurchaseId }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetPurchaseTotalAMountResponse>(`${apiUrl}/Purchase/${PurchaseId}/total-amount`, {
                headers: {
                    Authorization: `${tokenBearerKey}${token}`,
                }
            });

            return response.data;
        } catch (error) {
            const typedError = error as AxiosError;
            return rejectWithValue(typedError.response?.errors || "An error occurred");
        }
    }
);
export const getPurchaseInfo = createAsyncThunk<GetPurchaseResponse, GetPurchaseInfoParams>(
    "purchases/getPurchaseInfo",
    async ({ token, params, PurchaseId }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetPurchaseResponse>(`${apiUrl}/Purchase/${PurchaseId}`, {
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
export const deletePurchase = createAsyncThunk<DeletePurchaseResponse, DeletePurchaseInfoParams>(
    "purchases/deletePurchase",
    async ({ token, ids }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            ids?.forEach((id) => formData.append("ids", id.toString()));

            // Send DELETE request with multipart/form-data
            const response = await axios.delete<DeletePurchaseResponse>(
                `${apiUrl}/Purchase/delete-multiple`,
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
            console.error("Error deleting purchases:", error);
            return rejectWithValue(typedError.response?.errors || "An error occurred");
        }
    }
);
export const updatePurchase = createAsyncThunk<AddPurchaseResponse, UpdatePurchaseParams>(
    "purchases/updatePurchase",
    async ({ token, PurchaseId, body }, { rejectWithValue }) => {
        try {
            const response = await axios.put<AddPurchaseResponse>(`${apiUrl}/Purchase/${PurchaseId}`, body, {
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
export const addPurchase = createAsyncThunk<AddPurchaseResponse, AddPurchaseParams>(
    "purchases/addPurchase",
    async ({ token, body }, { rejectWithValue }) => {
        try {
            const response = await axios.post<AddPurchaseResponse>(`${apiUrl}/Purchase`, body, {
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
interface purchasesState {
    purchases: Purchase[];
    Purchase: Purchase | null;
    loading: boolean;
    metaData: MetaData;
    message: string;
    purchaseTotalAmount: number;
    rowsEffected: number | null;
    error: string | null;
}

// Initial state
const initialState: purchasesState = {
    purchases: [],
    Purchase: {
        id: '',
        merchantId: '',
        notes: '',
        orderDate: '',
        totalAmount: 0,
        purchaseItems: []
    },
    metaData: {
        pageNumber: 0,
        pageSize: 0,
        totalCount: 0,
        totalPages: 0
    },
    message: "",
    purchaseTotalAmount: 0,
    rowsEffected: 0,
    loading: false,
    error: null,
};

// Create the slice
const purchasesSlice = createSlice({
    name: 'purchases',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //------------------------------- getAllPurchases------------------------------------------
            .addCase(getAllPurchases.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllPurchases.fulfilled, (state, action: PayloadAction<GetAllPurchasesResponse>) => {
                state.loading = false;
                state.purchases = action.payload.data.items;
                state.metaData.pageNumber = action.payload.data.pageNumber;
                state.metaData.pageSize = action.payload.data.pageSize;
                state.metaData.totalCount = action.payload.data.totalCount;
                state.metaData.totalPages = action.payload.data.totalPages;
            })
            .addCase(getAllPurchases.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- getPurchaseInfo------------------------------------------
            .addCase(getPurchaseInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPurchaseInfo.fulfilled, (state, action: PayloadAction<GetPurchaseResponse>) => {
                state.loading = false;
                state.message = action.payload.message
                state.Purchase = action.payload.data;
            })
            .addCase(getPurchaseInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- getPurchaseTotalAMount------------------------------------------
            .addCase(getPurchaseTotalAMount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPurchaseTotalAMount.fulfilled, (state, action: PayloadAction<GetPurchaseTotalAMountResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
                state.purchaseTotalAmount = action.payload.data;
            })
            .addCase(getPurchaseTotalAMount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- addPurchase------------------------------------------
            .addCase(addPurchase.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPurchase.fulfilled, (state, action: PayloadAction<AddPurchaseResponse>) => {
                state.loading = false;
                state.message = action.payload.message
                state.Purchase = action.payload.data;
            })
            .addCase(addPurchase.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- deletePurchase------------------------------------------
            .addCase(deletePurchase.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePurchase.fulfilled, (state, action: PayloadAction<DeletePurchaseResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
                state.rowsEffected = action.payload.data;
            })
            .addCase(deletePurchase.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- updatePurchase------------------------------------------
            .addCase(updatePurchase.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePurchase.fulfilled, (state, action: PayloadAction<AddPurchaseResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
                state.Purchase = action.payload.data;
            })
            .addCase(updatePurchase.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});


export default purchasesSlice.reducer;
