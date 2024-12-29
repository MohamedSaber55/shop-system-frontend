import React from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Stack,
    Divider,
    Grid,
    TableContainer,
} from "@mui/material";
import { SaveAlt as ExportIcon, Edit as EditIcon } from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { getPurchaseInfo } from "../store/slices/purchaseSlice";
import { getMerchantInfo } from "../store/slices/merchantSlice";

// Dummy purchase data
const purchaseData = {
    id: "purchase_001",
    merchant: { id: "merchant_001", name: "John Doe", phone: "123-456-7890", address: "address" },
    purchase_date: "2024-10-23",
    total_amount: 150.75,
    outstanding_balance: 50.0,
    products: [
        {
            product_name: "Product One",
            quantity: 2,
            price_per_unit: 25.0,
            total_price: 50.0,
        },
        {
            product_name: "Product Two",
            quantity: 3,
            price_per_unit: 33.5,
            total_price: 100.5,
        },
    ],
    notes: "Sample note",
};

const PurchasePage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const userState = useSelector((state: RootState) => state.users);
    const purchaseState = useSelector((state: RootState) => state.purchases);
    const merchantState = useSelector((state: RootState) => state.merchants); // Assuming you have a merchants state
    const purchase = purchaseState.Purchase
    const merchant = merchantState.merchant;
    const params = useParams();
    const purchaseId = params.id;
    React.useEffect(() => {
        if (purchaseId) {
            dispatch(getPurchaseInfo({ token: userState.token, PurchaseId: purchaseId }));
        }
    }, [dispatch, purchaseId, userState.token])

    React.useEffect(() => {
        if (purchase?.merchantId) {
            dispatch(getMerchantInfo({ token: userState.token, merchantId: purchase.merchantId }));
        }
    }, [dispatch, purchase?.merchantId, userState.token])

    // CSV Export Function
    const exportToCSV = () => {
        const csvRows = [];

        // purchase details
        csvRows.push("purchase Details");
        csvRows.push(`purchase ID,${purchase?.id}`);
        csvRows.push(`purchase Date,${purchase?.orderDate}`);
        csvRows.push(`Total Amount,${purchase?.totalAmount}`);
        csvRows.push(`Notes,${purchase?.notes || ""}`);
        csvRows.push("");

        // merchant
        csvRows.push("Merchant Details");
        csvRows.push(`merchant ID,${merchant?.id}`);
        csvRows.push(`merchant Name,${merchant?.name}`);
        csvRows.push(`merchant Phone,${merchant?.phone}`);
        csvRows.push(`merchant Address,${merchant?.address}`);
        csvRows.push("");

        // Products Header
        csvRows.push("Products");
        csvRows.push("Product Name,Quantity,Price per Unit,Total Price");

        // Product rows
        purchase?.purchaseItems.forEach((product) => {
            csvRows.push(
                `${product.productName},${product.quantity},${product.pricePerUnit},${product.totalPrice}`
            );
        });

        // Convert array to CSV string
        const csvString = csvRows.join("\n");
        const blob = new Blob([csvString], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);

        // Create a link and trigger download
        const link = document.createElement("a");
        link.href = url;
        link.download = `purchase_${purchaseData.id}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
    };



    return (
        <Box p={0}>
            {/* Header with Export and Print Buttons */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">Purchase Details</Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        color="success"
                        sx={{
                            textTransform: 'none',
                            boxShadow: "none",
                            fontWeight: 'bold',
                            "&:hover": {
                                boxShadow: "none",
                                backgroundColor: 'success.dark',
                            },
                        }}
                        startIcon={<ExportIcon />}
                        onClick={exportToCSV}
                    >
                        Export as CSV
                    </Button>
                    <Button
                        component={Link}
                        to={`/purchases/${purchase?.id}/update`}
                        variant="contained"
                        color="warning"
                        sx={{
                            textTransform: 'none',
                            boxShadow: "none",
                            fontWeight: 'bold',
                            "&:hover": {
                                boxShadow: "none",
                                backgroundColor: 'warning.dark',
                                color: 'white',
                            },
                        }}
                        startIcon={<EditIcon />}
                    >
                        Update purchase
                    </Button>
                </Stack>
            </Stack>

            <Divider sx={{ marginY: 2 }} />

            {/* purchase and merchant Info */}
            <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6">Purchase Information</Typography>
                    <Divider sx={{ marginY: 2 }} />
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography><strong>Purchase ID:</strong> {purchase?.id}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><strong>Purchase Date:</strong> {new Date(purchase?.orderDate || "").toLocaleDateString()}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><strong>Total Amount:</strong> EGP {purchase?.totalAmount.toFixed(2)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><strong>Notes:</strong> {purchase?.notes}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Grid item md={6}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6">Merchant Information</Typography>
                        <Divider sx={{ marginY: 2 }} />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography><strong>Merchant ID: </strong>{merchant?.id}</Typography>                        </Grid>
                            <Grid item xs={6}>
                                <Typography><strong>Merchant Name:</strong> {merchant?.name}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography><strong>Merchant Phone:</strong> {merchant?.phone}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography><strong>Merchant Address:</strong> {merchant?.address}</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            <TableContainer component={Card} variant="outlined">
                <CardContent>
                    {/* Product Table */}
                    <Typography variant="h6" gutterBottom>
                        Products
                    </Typography>
                    <Divider sx={{ marginY: 2 }} />
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Product Name</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Price per Unit (EGP)</TableCell>
                                <TableCell>Total Price (EGP)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {purchase?.purchaseItems.map((product, i) => (
                                <TableRow key={i}>
                                    <TableCell>{product.productName}</TableCell>
                                    <TableCell>{product.quantity}</TableCell>
                                    <TableCell>{product.pricePerUnit.toFixed(2)}</TableCell>
                                    <TableCell>{product.totalPrice.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </TableContainer>
        </Box>
    );
};

export default PurchasePage;
