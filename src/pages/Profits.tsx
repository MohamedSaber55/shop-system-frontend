import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Toolbar,
    Typography,
} from "@mui/material";
import { format } from "date-fns";
import { getAllOrdersProfits } from "../store/slices/orderSlice";

interface OrderProfit {
    orderId: string;
    profit: number;
    orderDate: string;
}
const Profits = () => {
    const userState = useSelector((state: RootState) => state.users);
    const state = useSelector((state: RootState) => state.orders);
    const dispatch = useDispatch<AppDispatch>();
    const profits: OrderProfit[] = state.profits || [];

    useEffect(() => {
        dispatch(getAllOrdersProfits({ token: userState.token }));
    }, [dispatch, userState.token]);
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        return format(new Date(dateString), "yyyy-MM-dd hh:mm:ss a");
    };
    return (
        <>
            <Toolbar
                sx={[
                    { pl: { sm: 0 }, pr: { xs: 0, sm: 1 } },
                ]}
            >
                <Typography sx={{ flex: '1 1 100%' }} variant="h5" id="tableTitle" component="div">
                    Orders Profits
                </Typography>
            </Toolbar>
            <TableContainer component={Paper} elevation={0}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Profit (EGP)</strong></TableCell>
                            <TableCell><strong>Order Date</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {profits.map((profit: OrderProfit) => (
                            <TableRow key={profit.orderId}>
                                <TableCell>{profit.orderId}</TableCell>
                                <TableCell>{profit.profit}</TableCell>
                                <TableCell>{formatDate(profit.orderDate)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default Profits;
