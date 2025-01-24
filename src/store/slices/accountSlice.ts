import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { apiUrl, tokenBearerKey } from '../../utils/constants'

// Define the types for the parameters and the response
interface GetAllUsersParams {
    token: string | null;
    params?: Record<string, unknown>;
}
interface Session {
    userId: string;
    loginTime: string;
    logoutTime: string;
    sessionDuration: string;
}

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: number;
}
interface GetUserResponse {
    data: User;
    message: string
}

interface GetAllUsersResponse {
    data: {
        items: User[];
        totalCount: number;
        pageNumber: number;
        pageSize: number;
        totalPages: number;
    }
}
interface RegisterResponse {
    message: string;
}
interface AddUserParams {
    token: string | null;
    body: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        role: number;
        password: string;
        ConfirmPassword: string;
    }
}

interface AxiosError {
    response?: {
        errors?: string[];
    };
}

export interface LoginResponse {
    data: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        token: string;
        role: number;
        image: string | null;
        imageFile: string | null;
    };
    message: string;
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
export interface GetUsersSessionsResponse {
    message: string;
    data: Session[]
}
export interface ResetPassBody {
    body: {
        email: string;
        password: string;
        confirmPassword: string;
    }
}

interface MetaData {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}
interface GetUserInfoParams {
    token: string | null;
    userId?: string;
    params?: Record<string, unknown>;
}
interface UpdateUserParams {
    token: string | null;
    body: {
        id?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        phoneNumber?: string;
        role?: number;
        password?: string;
        ConfirmPassword?: string;
    }
}
interface DeleteUserParams {
    token: string | null;
    userIds: (string | number)[]
}

// Define the async thunk with types
export const getAllUsers = createAsyncThunk<GetAllUsersResponse, GetAllUsersParams>(
    "users/getAllUsers",
    async ({ token, params }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetAllUsersResponse>(`${apiUrl}/Admin/getUsers`, {
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
export const getUsersSessions = createAsyncThunk<GetUsersSessionsResponse, GetAllUsersParams>(
    "users/getUsersSessions",
    async ({ token }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetUsersSessionsResponse>(`${apiUrl}/Admin/all-users-session-data`, {
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
export const getUserInfo = createAsyncThunk<GetUserResponse, GetUserInfoParams>(
    "users/getUserInfo",
    async ({ token, params, userId }, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetUserResponse>(`${apiUrl}/Admin/getUserInfo/${userId}`, {
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
// export const deleteUser = createAsyncThunk<ResetPassResponse, GetUserInfoParams>(
//     "users/deleteUser",
//     async ({ token, userId }, { rejectWithValue }) => {
//         try {
//             const response = await axios.delete<ResetPassResponse>(`${apiUrl}/Account/deleteUser/${userId}`, {
//                 headers: {
//                     Authorization: `${tokenBearerKey}${token}`,
//                 },
//             });
//             return response.data;
//         } catch (error) {
//             const typedError = error as AxiosError;
//             return rejectWithValue(typedError.response?.errors || "An error occurred");
//         }
//     }
// );
export const deleteUser = createAsyncThunk<ResetPassResponse, DeleteUserParams>(
    "Admin/deleteUser",
    async ({ token, userIds }, { rejectWithValue }) => {

        try {
            const formData = new FormData();
            userIds?.forEach((id) => formData.append("userIds", id.toString()));

            const response = await axios.delete<ResetPassResponse>(
                `${apiUrl}/Admin/deleteUsers`,
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
export const updateUser = createAsyncThunk<ResetPassResponse, UpdateUserParams>(
    "users/updateUserInfo",
    async ({ token, body }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            Object.entries(body).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value as Blob | string);
                }
            });
            const response = await axios.put<ResetPassResponse>(`${apiUrl}/Admin/updateUserInfo`, formData, {
                headers: {
                    Authorization: `${tokenBearerKey}${token}`,
                    "Content-Type": "multipart/form-data",
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
export const addUser = createAsyncThunk<RegisterResponse, AddUserParams>("users/addUser", async ({ body, token }, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        Object.keys(body).forEach((key) => {
            formData.append(key, body[key as keyof typeof body] as string | Blob);
        });

        const response = await axios.post<RegisterResponse>(`${apiUrl}/Admin/register`, formData, {
            headers: {
                Authorization: `${tokenBearerKey}${token}`,
                'Content-Type': 'multipart/form-data',
            }
        });

        return response.data;
    } catch (error) {
        const typedError = error as AxiosError;
        return rejectWithValue(typedError.response?.errors || "An error occurred");
    }
});
export const login = createAsyncThunk<LoginResponse, LoginBody>("users/login", async ({ body }, { rejectWithValue }) => {
    try {
        const response = await axios.post<LoginResponse>(`${apiUrl}/Account/login`, body);
        localStorage.setItem("shoptkn", response.data.data.token)
        return response.data;
    } catch (error) {
        console.log(error);
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
    users_sessions: Session[];
    user: User | null;
    token: string | null;
    metaData: MetaData;
    rowsEffected: number | null;
    loading: boolean;
    message: string;
    error: string | null;
}

// Initial state
const initialState: UserState = {
    users: [],
    users_sessions: [],
    user: {
        id: "",
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        role: 0
    },
    token: localStorage.getItem("shoptkn") || "",
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
                state.users = action.payload.data.items;
                state.metaData.pageNumber = action.payload.data.pageNumber;
                state.metaData.pageSize = action.payload.data.pageSize;
                state.metaData.totalCount = action.payload.data.totalCount;
                state.metaData.totalPages = action.payload.data.totalPages;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- addUser------------------------------------------
            .addCase(addUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUser.fulfilled, (state, action: PayloadAction<RegisterResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //------------------------------- getUsersSessions------------------------------------------
            .addCase(getUsersSessions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUsersSessions.fulfilled, (state, action: PayloadAction<GetUsersSessionsResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
                state.users_sessions = action.payload.data;
            })
            .addCase(getUsersSessions.rejected, (state, action) => {
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
                state.message = action.payload.message;
                state.token = action.payload.data.token;
                if (state.user) {
                    state.user.id = action.payload.data.id;
                    state.user.email = action.payload.data.email;
                    state.user.firstName = action.payload.data.firstName;
                    state.user.lastName = action.payload.data.lastName;
                    state.user.role = action.payload.data.role;
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
