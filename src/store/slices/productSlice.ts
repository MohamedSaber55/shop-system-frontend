import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { apiUrl, tokenBearerKey } from '../../utils/constants'

// Define the types for the parameters and the response
interface GetAllProductsParams {
    token: string | null;
    params?: Record<string, unknown>;
}
interface Product {
    id?: number | string;
    name: string;
    quantity: number | string;
    isStock: boolean;
    purchasePrice: number | string;
    sellingPrice: number | string;
    categoryId: string;
    uniqueNumber: number | string;
    category: {
        id: number | string;
        name: string
    }
}
interface AddProductResponse {
    data: Product,
    message: string,
}
interface AddProductParams {
    token: string | null;
    body: {
        id?: number | string;
        name: string;
        quantity: number | string;
        isStock: boolean;
        purchasePrice: number | string;
        sellingPrice: number | string;
        categoryId: string;
        uniqueNumber: number | string;
    }[];
}
interface GetProductResponse {
    data: Product;
    message: string
}
interface GetCategoryProductsResponse {
    data: Product[];
    message: string
}
interface GetCategoryProductsParams {
    token: string | null;
    categoryId?: string;
}

interface GetAllProductsResponse {
    data: {
        items: Product[];
        totalCount: number;
        pageNumber: number;
        pageSize: number;
        totalPages: number;
    }
}

interface MetaData {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

export interface DeleteProductResponse {
    message: string;
    data: number | null;
}

interface AxiosError {
    response?: {
        errors?: string[];
    };
}

interface DeleteProductInfoParams {
    token: string | null;
    ids: (number | string)[];
    params?: Record<string, unknown>;
}
interface GetProductInfoParams {
    token: string | null;
    productId?: string;
    params?: Record<string, unknown>;
}
interface UpdateProductParams {
    token: string | null;
    productId: string | undefined;
    body: {
        id: number | string;
        name: string;
        quantity: number | string;
        isStock: boolean;
        purchasePrice: number | string;
        sellingPrice: number | string;
        categoryId: string;
        uniqueNumber: number | string;
    }
}

// Define the async thunk with types
export const getAllProducts = createAsyncThunk<GetAllProductsResponse, GetAllProductsParams>(
    "products/getAllProducts",
    async ({ token, params }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetAllProductsResponse>(`${apiUrl}/Products`, {
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
export const getProductInfo = createAsyncThunk<GetProductResponse, GetProductInfoParams>(
    "products/getProductInfo",
    async ({ token, productId }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetProductResponse>(`${apiUrl}/Products/${productId}`, {
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
export const getCategoryProducts = createAsyncThunk<GetCategoryProductsResponse, GetCategoryProductsParams>(
    "products/getCategoryProducts",
    async ({ token, categoryId }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetCategoryProductsResponse>(`${apiUrl}/Products/category/${categoryId}`, {
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
export const getProductStock = createAsyncThunk<GetProductResponse, GetProductInfoParams>(
    "products/getProductStock",
    async ({ token, params, productId }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetProductResponse>(`${apiUrl}/Products/${productId}`, {
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
export const deleteProduct = createAsyncThunk<DeleteProductResponse, DeleteProductInfoParams>(
    "products/deleteProduct",
    async ({ token, ids }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            ids?.forEach((id) => formData.append("ids", id.toString()));

            // Send DELETE request with multipart/form-data
            const response = await axios.delete<DeleteProductResponse>(
                `${apiUrl}/Products/delete-multiple`,
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
export const updateProduct = createAsyncThunk<AddProductResponse, UpdateProductParams>(
    "products/updateProduct",
    async ({ token, productId, body }, { rejectWithValue }) => {
        try {
            const response = await axios.put<AddProductResponse>(`${apiUrl}/Products/${productId}`, body, {
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
export const addProduct = createAsyncThunk<AddProductResponse, AddProductParams>(
    "products/addProduct",
    async ({ token, body }, { rejectWithValue }) => {
        try {
            const response = await axios.post<AddProductResponse>(`${apiUrl}/Products/AddProducts`, body, {
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

// Define the initial state type
interface productState {
    products: Product[];
    product: Product | null;
    metaData: MetaData;
    loading: boolean;
    message: string;
    rowsEffected: null | number;
    error: string | null;
}

// Initial state
const initialState: productState = {
    products: [],
    product: {
        id: '',
        name: '',
        sellingPrice: 0,
        purchasePrice: '',
        categoryId: '',
        quantity: '',
        isStock: true,
        uniqueNumber: "",
        category: {
            id: '',
            name: '',
        }
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
const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //------------------------------- getAllProducts------------------------------------------
            .addCase(getAllProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllProducts.fulfilled, (state, action: PayloadAction<GetAllProductsResponse>) => {
                state.loading = false;
                state.products = action.payload.data.items;
                state.metaData.pageNumber = action.payload.data.pageNumber;
                state.metaData.pageSize = action.payload.data.pageSize;
                state.metaData.totalCount = action.payload.data.totalCount;
                state.metaData.totalPages = action.payload.data.totalPages;
            })
            .addCase(getAllProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- getProductInfo------------------------------------------
            .addCase(getProductInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductInfo.fulfilled, (state, action: PayloadAction<GetProductResponse>) => {
                state.loading = false;
                state.message = action.payload.message
                state.product = action.payload.data;
            })
            .addCase(getProductInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- addProduct------------------------------------------
            .addCase(addProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProduct.fulfilled, (state, action: PayloadAction<AddProductResponse>) => {
                state.loading = false;
                state.message = action.payload.message
                state.product = action.payload.data;
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- updateProduct------------------------------------------
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action: PayloadAction<AddProductResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
                state.product = action.payload.data;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- deleteProduct------------------------------------------
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<DeleteProductResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
                state.rowsEffected = action.payload.data;
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});


export default productSlice.reducer;
