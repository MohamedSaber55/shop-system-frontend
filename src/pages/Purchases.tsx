import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { CSVLink } from "react-csv";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Stack, TableFooter, TextField } from '@mui/material';
import { BiImport } from 'react-icons/bi';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useTheme } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { deletePurchase, getAllPurchases } from '../store/slices/purchaseSlice';
import { FaTrash } from 'react-icons/fa';

interface PurchaseItem {
    id: number;
    purchaseId: number;
    productName: string;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
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
interface HeadCell {
    id: keyof Purchase;
    label: string;
}

const headCells: readonly HeadCell[] = [
    { id: 'id', label: 'ID' },
    { id: 'merchantId', label: 'Merchant' },
    { id: 'totalAmount', label: 'Total amount (EGP)' },
    { id: 'orderDate', label: 'Order Date' },
    { id: 'notes', label: 'Notes' },
];

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Purchase) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: boolean;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property: keyof Purchase) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox" align='left'>
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all purchases' }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell key={headCell.id} align={'left'} padding={'normal'}>
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? (!order ? 'asc' : 'desc') : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
                <TableCell>
                    Actions
                </TableCell>
            </TableRow>
        </TableHead>
    );
}

interface EnhancedTableToolbarProps {
    numSelected: number;
    purchasesData: Purchase[];
    selected: number[];
    onSearch: (query: string) => void;
}


function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected, selected, purchasesData, onSearch } = props;
    const [searchQuery, setSearchQuery] = React.useState('');
    const dispatch = useDispatch<AppDispatch>();
    const userState = useSelector((state: RootState) => state.users);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchQuery(value);
        onSearch(value);
    };

    const handleBulkAction = (action: string) => {
        if (action === 'delete') {
            dispatch(deletePurchase({ token: userState.token, ids: selected })).then(() => {
                dispatch(getAllPurchases({ token: userState.token }))
            })
        }
    };

    const csvHeaders = [
        { label: 'ID', key: 'id' },
        { label: 'Merchant', key: 'merchantId' },
        { label: 'Total Amount', key: 'totalAmount' },
        { label: 'Notes', key: 'notes' },
        { label: 'Order Date', key: 'orderDate' },
    ];

    return (
        <Toolbar
            sx={[
                { pl: { sm: 0 }, pr: { xs: 0, sm: 1 } },
                numSelected > 0 && {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                },
            ]}
        >
            {numSelected > 0 ? (
                <Typography sx={{ flex: '1 1 100%', pl: 2 }} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography sx={{ flex: '1 1 100%' }} variant="h5" id="tableTitle" component="div">
                    Purchases
                </Typography>
            )}
            {numSelected > 0 ? (
                <IconButton color="error" onClick={() => handleBulkAction('delete')}>
                    <FaTrash />
                </IconButton>
            ) : (
                <Stack direction="row" justifyContent="center" alignItems="center" gap={2}>
                    <Tooltip title="Export CSV">
                        <IconButton sx={{ color: 'primary.main' }}>
                            <CSVLink
                                data={purchasesData}
                                headers={csvHeaders}
                                filename="purchases_data.csv"
                                style={{ color: 'inherit', padding: 0, display: 'flex', alignItems: 'center' }}
                            >
                                <BiImport size={24} />
                            </CSVLink>
                        </IconButton>
                    </Tooltip>
                    <Button
                        variant="outlined"
                        sx={{
                            textTransform: 'none',
                            fontSize: "16px",
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            '&:hover': {
                                backgroundColor: 'primary.light',
                                borderColor: 'primary.dark',
                                color: 'white',
                            },
                        }}
                    >
                        <Link to={"/purchases/add"} style={{ color: "inherit", textDecoration: 'none', whiteSpace: "nowrap" }}>Add Purchase</Link>
                    </Button>
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                        <TextField
                            id="search-purchases"
                            size="small"
                            value={searchQuery}
                            onChange={handleSearch}
                            label="Search..."
                            variant="outlined"
                        />
                    </FormControl>
                </Stack>
            )}
        </Toolbar>
    );
}


interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

const Purchases = () => {
    const [order, setOrder] = React.useState<boolean>(true);
    const [orderBy, setOrderBy] = React.useState<keyof Purchase>('id');
    const [pageNumber, setPageNumber] = React.useState<number>(0);
    const [pageSize, setPageSize] = React.useState<number>(10);
    const [searchTerm, setSearchTerm] = React.useState<string>("");
    const [selected, setSelected] = React.useState<number[]>([]);
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const [rowToDelete, setRowToDelete] = React.useState<number | undefined | string>(undefined);
    const navigate = useNavigate()
    const state = useSelector((state: RootState) => state.purchases);
    const userState = useSelector((state: RootState) => state.users);
    const dispatch = useDispatch<AppDispatch>();
    const data: Purchase[] = state?.purchases;
    const totalCount = state.metaData.totalCount
    React.useEffect(() => {
        const params = {
            PageNumber: pageNumber + 1,
            PageSize: pageSize,
            Search: searchTerm,
            SortField: orderBy,
            SortDescending: order,
        }

        dispatch(getAllPurchases({ token: userState.token, params }))
    }, [dispatch, order, orderBy, pageNumber, pageSize, searchTerm, userState.token])

    const handleDeleteClick = (rowId: number) => {
        setRowToDelete(rowId);
        setOpenDeleteModal(true);
    };

    const handleClose = () => {
        setOpenDeleteModal(false);
        setRowToDelete(undefined);
    };

    const handleConfirmDelete = () => {
        if (rowToDelete !== undefined) {
            dispatch(deletePurchase({ token: userState.token, ids: [rowToDelete] })).then(() => {
                dispatch(getAllPurchases({ token: userState.token }))
            })
        }
        handleClose();
    };
    const handleRowClick = (id: number) => {
        navigate(`/purchases/${id}`);
    };
    const handleRequestSort = (
        _event: React.MouseEvent<unknown>,
        property: keyof Purchase,
    ) => {
        const capitalizeFirstLetter = (str: string) =>
            str.charAt(0).toUpperCase() + str.slice(1);

        const capitalizedProperty = capitalizeFirstLetter(property as string);
        const isAsc = orderBy === capitalizedProperty && order === false;
        setOrder(isAsc ? true : false);
        setOrderBy(capitalizedProperty as keyof Purchase);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = data.map((n) => Number(n.id))
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (_event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };
    const handleSearch = (searchTerm: string) => {
        setSearchTerm(searchTerm)
    }

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPageNumber(newPage);
        const params = {
            PageNumber: pageNumber > 0 ? pageNumber : 1,
            PageSize: pageSize,
            Search: searchTerm,
            SortField: orderBy,
            SortDescending: order,
        }
        dispatch(getAllPurchases({ token: userState.token, params }))
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPageSize(parseInt(event.target.value, 10));
        setPageNumber(0);
    };

    return (
        <Paper elevation={0} sx={{ width: '100%', overflow: 'hidden' }}>
            <EnhancedTableToolbar numSelected={selected.length} selected={selected} purchasesData={data} onSearch={handleSearch} />
            <TableContainer sx={{ border: "1px solid #eee" }}>
                <Table stickyHeader aria-label="sticky table">
                    <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={data.length}
                    />
                    <TableBody>
                        {data.map((row, i) => {
                            const isItemSelected = selected.indexOf(Number(row.id)) !== -1;
                            const labelId = `enhanced-table-checkbox-${row.id}`;

                            return (
                                <TableRow
                                    hover
                                    onClick={() => handleRowClick(Number(row.id))}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.id}
                                    selected={isItemSelected}
                                    sx={{
                                        cursor: "pointer"
                                    }}
                                >
                                    <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                        <Checkbox
                                            color="primary"
                                            onClick={(event) => handleClick(event, Number(row.id))}
                                            checked={isItemSelected}
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {/* {row.id} */}
                                        {i}
                                    </TableCell>
                                    <TableCell>{row?.merchant?.name}</TableCell>
                                    <TableCell>{row.totalAmount}</TableCell>
                                    <TableCell>{new Date(row.orderDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{row.notes}</TableCell>
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <Stack direction="row" spacing={1}>
                                            <IconButton
                                                component={Link}
                                                to={`/purchases/${row.id}/update`}
                                                color="primary"
                                                sx={{
                                                    border: "1px solid"
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <MdEdit />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                sx={{
                                                    border: "1px solid"
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClick(Number(row.id));
                                                }}
                                            >
                                                <MdDelete />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { value: totalCount, label: 'All' }]}
                                count={totalCount}
                                rowsPerPage={pageSize}
                                page={pageNumber}
                                slotProps={{
                                    select: {
                                        inputProps: {
                                            'aria-label': 'rows per page',
                                        },
                                        native: true,
                                    },
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
            {/* Confirmation Dialog */}
            <Dialog open={openDeleteModal} onClose={handleClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this item? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" variant='contained' sx={{
                        boxShadow: "none",
                        ":hover": {
                            boxShadow: "none"
                        }
                    }}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant='contained' sx={{
                        boxShadow: "none",
                        ":hover": {
                            boxShadow: "none"
                        }
                    }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>)
}

export default Purchases