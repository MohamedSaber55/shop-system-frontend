import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { apiUrl, tokenBearerKey } from '../../utils/constants'

// Define the types for the parameters and the response
interface GetAllMerchantsParams {
    token: string | null;
    params?: Record<string, unknown>;
}
interface MetaData {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}
interface Merchant {
    id?: number | string;
    name: string;
    phone: string;
    address: string;
    outstandingBalance: string | number;
}
interface AddMerchantResponse {
    message: string;
    data: Merchant;
}
interface AddMerchantParams {
    token: string | null;
    body: Merchant;
}
interface GetMerchantResponse {
    data: Merchant;
    message: string
}
interface GetMerchantPurchasesResponse {
    data: [];
    message: string
}
interface GetMerchantPurchasesParams {
    token?: string | null;
    merchantId?: string
}

interface GetAllMerchantsResponse {
    data: {
        items: Merchant[];
        totalCount: number;
        pageNumber: number;
        pageSize: number;
        totalPages: number;
    }
}

interface DeleteMerchantResponse {
    message: string;
    data: number | null;
}
interface AxiosError {
    response?: {
        errors?: string[];
    };
}

interface DeleteMerchantInfoParams {
    token: string | null;
    ids?: (number | string)[];
    params?: Record<string, unknown>;
}
interface GetMerchantInfoParams {
    token: string | null;
    merchantId?: string;
    params?: Record<string, unknown>;
}
interface UpdateMerchantParams {
    token: string | null;
    merchantId: number | string | undefined;
    body: {
        id?: number | string;
        name: string;
        phone: string;
        address: string;
        outstandingBalance: string | number;
    }
}

// Define the async thunk with types
export const getAllMerchants = createAsyncThunk<GetAllMerchantsResponse, GetAllMerchantsParams>(
    "merchants/getAllMerchants",
    async ({ token, params }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetAllMerchantsResponse>(`${apiUrl}/Merchant`, {
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
export const getMerchantInfo = createAsyncThunk<GetMerchantResponse, GetMerchantInfoParams>(
    "merchants/getMerchantInfo",
    async ({ token, params, merchantId }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetMerchantResponse>(`${apiUrl}/Merchant/${merchantId}`, {
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
export const getMerchantPurchases = createAsyncThunk<GetMerchantPurchasesResponse, GetMerchantPurchasesParams>(
    "merchants/getMerchantPurchases",
    async ({ token, merchantId }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetMerchantPurchasesResponse>(`${apiUrl}/Merchant/${merchantId}/purchases`, {
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
export const deleteMerchant = createAsyncThunk<DeleteMerchantResponse, DeleteMerchantInfoParams>(
    "merchants/deleteMerchant",
    async ({ token, ids }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            ids?.forEach((id) => formData.append("ids", id.toString()));

            // Send DELETE request with multipart/form-data
            const response = await axios.delete<DeleteMerchantResponse>(
                `${apiUrl}/Merchant/delete-multiple`,
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
            return rejectWithValue(typedError.response?.errors || "An error occurred");
        }
    }
);

export const updateMerchant = createAsyncThunk<AddMerchantResponse, UpdateMerchantParams>(
    "merchants/updateMerchant",
    async ({ token, merchantId, body }, { rejectWithValue }) => {
        try {
            const response = await axios.put<AddMerchantResponse>(`${apiUrl}/Merchant/${merchantId}`, body, {
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
export const addMerchant = createAsyncThunk<AddMerchantResponse, AddMerchantParams>(
    "merchants/addMerchant",
    async ({ token, body }, { rejectWithValue }) => {
        try {
            const response = await axios.post<AddMerchantResponse>(`${apiUrl}/Merchant`, body, {
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
interface merchantState {
    merchants: Merchant[];
    merchant: Merchant | null;
    merchantPurchases: [];
    metaData: MetaData;
    loading: boolean;
    message: string;
    rowsEffected: number | null;
    error: string | null;
}

// Initial state
const initialState: merchantState = {
    merchants: [],
    merchantPurchases: [],
    merchant: {
        id: "",
        name: '',
        phone: '',
        address: '',
        outstandingBalance: "0"
    },
    metaData: {
        pageNumber: 0,
        pageSize: 0,
        totalCount: 0,
        totalPages: 0
    },
    message: "",
    rowsEffected: null,
    loading: false,
    error: null,
};

// Create the slice
const merchantSlice = createSlice({
    name: 'merchants',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //------------------------------- getAllMerchants------------------------------------------
            .addCase(getAllMerchants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllMerchants.fulfilled, (state, action: PayloadAction<GetAllMerchantsResponse>) => {
                state.loading = false;
                state.merchants = action.payload.data.items;
                state.metaData.pageNumber = action.payload.data.pageNumber;
                state.metaData.pageSize = action.payload.data.pageSize;
                state.metaData.totalCount = action.payload.data.totalCount;
                state.metaData.totalPages = action.payload.data.totalPages;
            })
            .addCase(getAllMerchants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- getMerchantInfo------------------------------------------
            .addCase(getMerchantInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMerchantInfo.fulfilled, (state, action: PayloadAction<GetMerchantResponse>) => {
                state.loading = false;
                state.message = action.payload.message
                state.merchant = action.payload.data;
            })
            .addCase(getMerchantInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- getMerchantPurchases------------------------------------------
            .addCase(getMerchantPurchases.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMerchantPurchases.fulfilled, (state, action: PayloadAction<GetMerchantPurchasesResponse>) => {
                state.loading = false;
                state.message = action.payload.message
                state.merchantPurchases = action.payload.data;
            })
            .addCase(getMerchantPurchases.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- deleteMerchant------------------------------------------
            .addCase(deleteMerchant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMerchant.fulfilled, (state, action: PayloadAction<DeleteMerchantResponse>) => {
                state.loading = false;
                state.message = action.payload.message
                state.rowsEffected = action.payload.data;
            })
            .addCase(deleteMerchant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- addMerchant------------------------------------------
            .addCase(addMerchant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addMerchant.fulfilled, (state, action: PayloadAction<AddMerchantResponse>) => {
                state.loading = false;
                state.message = action.payload.message
                state.merchant = action.payload.data;
            })
            .addCase(addMerchant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- updateMerchant------------------------------------------
            .addCase(updateMerchant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMerchant.fulfilled, (state, action: PayloadAction<AddMerchantResponse>) => {
                state.loading = false;
                state.message = action.payload.message
                state.merchant = action.payload.data;
            })
            .addCase(updateMerchant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});


export default merchantSlice.reducer;
