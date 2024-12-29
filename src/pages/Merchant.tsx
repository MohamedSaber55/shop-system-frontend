import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useEffect } from "react";
import { getMerchantInfo, getMerchantPurchases } from "../store/slices/merchantSlice";
import { useParams } from "react-router-dom";
import {
    Typography,
    Card,
    CardContent,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
} from "@mui/material";
interface Purchase {
    id: number;
    merchantId: number;
    orderDate: string; // ISO date string
    totalAmount: number;
}

function Merchant() {
    const params = useParams();
    const merchantId = params.id;

    const state = useSelector((state: RootState) => state.merchants);
    const userState = useSelector((state: RootState) => state.users);
    const dispatch = useDispatch<AppDispatch>();

    const merchant = state.merchant;
    const purchases: Purchase[] = state.merchantPurchases;

    useEffect(() => {
        dispatch(getMerchantInfo({ token: userState.token, merchantId }));
        dispatch(getMerchantPurchases({ token: userState.token, merchantId }));
    }, [dispatch, merchantId, userState.token]);

    return (
        <div>
            {merchant ? (
                <Card variant="outlined" sx={{ marginBottom: 4 }}>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>
                            {merchant.name}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1"><strong>Phone:</strong> {merchant.phone}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1"><strong>Address:</strong> {merchant.address}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body1"><strong>Outstanding Balance:</strong> EGP {merchant.outstandingBalance}</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            ) : (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                    <CircularProgress />
                </div>
            )}

            {/* Purchases */}
            <Typography variant="h5" gutterBottom>
                Purchases
            </Typography>
            {purchases && purchases.length > 0 ? (
                <TableContainer component={Paper} elevation={0} sx={{ marginTop: 2,border:"1px solid #E0E0E0" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Order ID</strong></TableCell>
                                <TableCell><strong>Order Date</strong></TableCell>
                                <TableCell><strong>Order Time</strong></TableCell>
                                <TableCell><strong>Total Amount (EGP)</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {purchases.map((purchase) => {
                                const orderDate = new Date(purchase.orderDate);
                                const date = orderDate.toLocaleDateString(); // Extract date in local format
                                const time = orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Extract time in HH:mm:ss format
                                return (
                                    <TableRow key={purchase.id}>
                                        <TableCell>{purchase.id}</TableCell>
                                        <TableCell>{date}</TableCell>
                                        <TableCell>{time}</TableCell>
                                        <TableCell>{purchase.totalAmount.toFixed(2)}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="body1" color="textSecondary" sx={{ marginTop: 2 }}>
                    No purchases found.
                </Typography>
            )}
        </div>
    );
}

export default Merchant;
