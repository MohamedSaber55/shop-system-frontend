import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { apiUrl, tokenBearerKey } from '../../utils/constants'

// Define the types for the parameters and the response
interface GetAllUsersParams {
    token: string | null;
    params?: Record<string, unknown>;
}

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: number;
}
interface GetUserResponse {
    data: User;
    message: string
}

interface GetAllUsersResponse {
    data: User[];
}
interface RegisterResponse {
    message: string;
}

interface AxiosError {
    response?: {
        errors?: string[];
    };
}

export interface LoginResponse {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    token: string;
    role: number;
    image: string | null;
    imageFile: string | null;
}

export interface LoginBody {
    body: {
        email: string;
        password: string;
    }
}
export interface ForgetPassResponse {
    message: string;
}

export interface ForgetPassBody {
    body: {
        email: string;
    }
}

export interface VerifyOtpResponse {
    message: string;
}

export interface VerifyOtpBody {
    body: {
        email: string;
        otp: string;
    }
}

export interface ResetPassResponse {
    message: string;
}
export interface ResetPassBody {
    body: {
        email: string;
        password: string;
        confirmPassword: string;
    }
}

interface GetUserInfoParams {
    token: string | null;
    userId?: string;
    params?: Record<string, unknown>;
}
interface UpdateUserParams {
    token: string | null;
    userId: string | undefined;
    body: {
        firstName: string;
        lastName: string;
    }
}

// Define the async thunk with types
export const getAllUsers = createAsyncThunk<GetAllUsersResponse, GetAllUsersParams>(
    "users/getAllUsers",
    async ({ token, params }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetAllUsersResponse>(`${apiUrl}/Account/getUsers`, {
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
export const getUserInfo = createAsyncThunk<GetUserResponse, GetUserInfoParams>(
    "users/getUserInfo",
    async ({ token, params, userId }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetUserResponse>(`${apiUrl}/Account/getUserInfo/${userId}`, {
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
export const deleteUser = createAsyncThunk<ResetPassResponse, GetUserInfoParams>(
    "users/deleteUser",
    async ({ token, userId }, { rejectWithValue }) => {
        try {
            const response = await axios.delete<ResetPassResponse>(`${apiUrl}/Account/deleteUser/${userId}`, {
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
export const updateUser = createAsyncThunk<ResetPassResponse, UpdateUserParams>(
    "users/deleteUser",
    async ({ token, userId, body }, { rejectWithValue }) => {
        try {
            const response = await axios.put<ResetPassResponse>(`${apiUrl}/Account/deleteUser/${userId}`, body, {
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
export const register = createAsyncThunk<RegisterResponse>("users/register", async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post<RegisterResponse>(`${apiUrl}/Account/register`, data);
        return response.data;
    } catch (error) {
        const typedError = error as AxiosError;
        return rejectWithValue(typedError.response?.errors || "An error occurred");
    }
});
export const login = createAsyncThunk<LoginResponse, LoginBody>("users/login", async ({ body }, { rejectWithValue }) => {
    try {
        const response = await axios.post<LoginResponse>(`${apiUrl}/Account/login`, body);
        localStorage.setItem("shoptkn", response.data.token)
        return response.data;
    } catch (error) {
        const typedError = error as AxiosError;
        return rejectWithValue(typedError.response?.errors || "An error occurred");
    }
});
export const forgetPass = createAsyncThunk<ForgetPassResponse, ForgetPassBody>("users/forget-password", async ({ body }, { rejectWithValue }) => {
    try {
        const response = await axios.post<ForgetPassResponse>(`${apiUrl}/Account/forgetPassword`, null, {
            headers: body
        });
        return response.data;
    } catch (error) {
        const typedError = error as AxiosError;
        return rejectWithValue(typedError.response?.errors || "An error occurred");
    }
});
export const verifyOtp = createAsyncThunk<VerifyOtpResponse, VerifyOtpBody>("users/verify-otp", async ({ body }, { rejectWithValue }) => {
    try {
        const response = await axios.post<VerifyOtpResponse>(`${apiUrl}/Account/verfiyOtp`, null, {
            headers: body
        });
        return response.data;
    } catch (error) {
        const typedError = error as AxiosError;
        return rejectWithValue(typedError.response?.errors || "An error occurred");
    }
});
export const resetPass = createAsyncThunk<ResetPassResponse, ResetPassBody>("users/reset-pass", async ({ body }, { rejectWithValue }) => {
    try {
        const response = await axios.post<ResetPassResponse>(`${apiUrl}/Account/resetPassword`, null, {
            headers: body
        });
        return response.data;
    } catch (error) {
        const typedError = error as AxiosError;
        return rejectWithValue(typedError.response?.errors || "An error occurred");
    }
});

// Define the initial state type
interface UserState {
    users: User[];
    user: User | null;
    token: string | null;
    loading: boolean;
    message: string;
    error: string | null;
}

// Initial state
const initialState: UserState = {
    users: [],
    user: {
        id: "",
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 0
    },
    token: localStorage.getItem("shoptkn") || "",
    message: "",
    loading: false,
    error: null,
};

// Create the slice
const accountSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("shoptkn")
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action: PayloadAction<GetAllUsersResponse>) => {
                state.loading = false;
                state.users = action.payload.data;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- register------------------------------------------
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action: PayloadAction<RegisterResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- login------------------------------------------
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
                state.loading = false;
                state.message = "Login Success";
                state.token = action.payload.token;
                if (state.user) {
                    state.user.id = action.payload.id;
                    state.user.email = action.payload.email;
                    state.user.firstName = action.payload.firstName;
                    state.user.lastName = action.payload.lastName;
                    state.user.role = action.payload.role;
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- forgetPass------------------------------------------
            .addCase(forgetPass.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgetPass.fulfilled, (state) => {
                state.loading = false;
                state.message = "Check your email for reset password Otp";
            })
            .addCase(forgetPass.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- getUserInfo------------------------------------------
            .addCase(getUserInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserInfo.fulfilled, (state, action: PayloadAction<GetUserResponse>) => {
                state.loading = false;
                state.message = action.payload.message
                state.user = action.payload.data;
            })
            .addCase(getUserInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export const { logout } = accountSlice.actions;

export default accountSlice.reducer;
