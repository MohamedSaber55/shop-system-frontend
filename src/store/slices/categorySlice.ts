import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { apiUrl, tokenBearerKey } from '../../utils/constants'

// Define the types for the parameters and the response
interface GetAllCategoriesParams {
    token: string | null;
    params?: Record<string, unknown>;
}
interface category {
    id?: string;
    name: string;
}
interface AddCategoryResponse {
    message: string;
    data: category;
}
interface AddCategoryParams {
    token: string | null;
    body: category;
}
interface GetCategoryResponse {
    data: category;
    message: string
}
interface MetaData {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}
interface GetAllCategoriesResponse {
    data: {
        items: category[];
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
interface DeleteCategoryResponse {
    message: string;
    data: null | number;
}
interface DeleteCategoryInfoParams {
    token: string | null;
    ids: (number | string)[];
    params?: Record<string, unknown>;
}
interface GetCategoryInfoParams {
    token: string | null;
    categoryId?: string ;
    params?: Record<string, unknown>;
}
interface UpdateCategoryParams {
    token: string | null;
    categoryId: number | string | undefined;
    body: {
        id?: string | number;
        name: string;
    }
}

// Define the async thunk with types
export const getAllCategories = createAsyncThunk<GetAllCategoriesResponse, GetAllCategoriesParams>(
    "categories/getAllCategories",
    async ({ token, params }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetAllCategoriesResponse>(`${apiUrl}/Categories`, {
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
export const getCategoryInfo = createAsyncThunk<GetCategoryResponse, GetCategoryInfoParams>(
    "categories/getCategoryInfo",
    async ({ token, params, categoryId }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetCategoryResponse>(`${apiUrl}/Categories/${categoryId}`, {
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

export const deleteCategory = createAsyncThunk<DeleteCategoryResponse, DeleteCategoryInfoParams>(
    "categories/deleteCategory",
    async ({ token, ids }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            ids?.forEach((id) => formData.append("ids", id.toString()));

            // Send DELETE request with multipart/form-data
            const response = await axios.delete<DeleteCategoryResponse>(
                `${apiUrl}/Categories/delete-multiple`,
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
            console.error("Error deleting categories:", error);
            return rejectWithValue(typedError.response?.errors || "An error occurred");
        }
    }
);

export const updateCategory = createAsyncThunk<AddCategoryResponse, UpdateCategoryParams>(
    "categories/updateCategory",
    async ({ token, categoryId, body }, { rejectWithValue }) => {
        try {
            const response = await axios.put<AddCategoryResponse>(`${apiUrl}/Categories/${categoryId}`, body, {
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
export const addCategory = createAsyncThunk<AddCategoryResponse, AddCategoryParams>(
    "categories/addCategory",
    async ({ token, body }, { rejectWithValue }) => {
        try {
            const response = await axios.post<AddCategoryResponse>(`${apiUrl}/Categories`, body, {
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
interface categoriesState {
    categories: category[];
    category: category | null;
    loading: boolean;
    metaData: MetaData;
    message: string;
    rowsEffected: number | null;
    error: string | null;
}

// Initial state
const initialState: categoriesState = {
    categories: [],
    category: {
        id: '',
        name: '',
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
const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //------------------------------- getAllCategories------------------------------------------
            .addCase(getAllCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCategories.fulfilled, (state, action: PayloadAction<GetAllCategoriesResponse>) => {
                state.loading = false;
                state.categories = action.payload.data.items;
                state.metaData.pageNumber = action.payload.data.pageNumber;
                state.metaData.pageSize = action.payload.data.pageSize;
                state.metaData.totalCount = action.payload.data.totalCount;
                state.metaData.totalPages = action.payload.data.totalPages;
            })
            .addCase(getAllCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- getCategoryInfo------------------------------------------
            .addCase(getCategoryInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCategoryInfo.fulfilled, (state, action: PayloadAction<GetCategoryResponse>) => {
                state.loading = false;
                state.message = action.payload.message
                state.category = action.payload.data;
            })
            .addCase(getCategoryInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- addCategory------------------------------------------
            .addCase(addCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCategory.fulfilled, (state, action: PayloadAction<AddCategoryResponse>) => {
                state.loading = false;
                state.message = action.payload.message
                state.category = action.payload.data;
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- deleteCategory------------------------------------------
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<DeleteCategoryResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
                state.rowsEffected = action.payload.data;
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- updateCategory------------------------------------------
            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCategory.fulfilled, (state, action: PayloadAction<AddCategoryResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
                state.category = action.payload.data;
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});


export default categoriesSlice.reducer;
