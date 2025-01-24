import { configureStore } from "@reduxjs/toolkit";
import accountSlice from "./slices/accountSlice.ts"
import categoriesSlice from "./slices/categorySlice.ts"
import merchantsSlice from "./slices/merchantSlice.ts"
import purchaseSlice from "./slices/purchaseSlice.ts"
import productSlice from "./slices/productSlice.ts"
import expensesSlice from "./slices/expenseSlice.ts"
import customersSlice from "./slices/customerSlice.ts"
import ordersSlice from "./slices/orderSlice.ts"
import paymentsSlice from "./slices/paymentSlice.ts"

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
    reducer: {
        users: accountSlice,
        categories: categoriesSlice,
        merchants: merchantsSlice,
        purchases: purchaseSlice,
        products: productSlice,
        expenses: expensesSlice,
        customers: customersSlice,
        orders: ordersSlice,
        payments: paymentsSlice,
    }
})

export default store;