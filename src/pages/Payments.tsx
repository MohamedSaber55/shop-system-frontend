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
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import { payments } from "./../data/payments.json";
import { CSVLink } from "react-csv";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Stack, TableFooter, TextField } from '@mui/material';
import { BiImport } from 'react-icons/bi';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useTheme } from '@mui/material/styles';
import { Link } from "react-router-dom"
import { MdDelete, MdEdit } from 'react-icons/md';

interface Payment {
    id: number;
    customer_id: string;
    amount: number;
    date: string;
    info: string;
}

const data: Payment[] = payments;

function descendingComparator(a: Payment, b: Payment, orderBy: keyof Payment) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof Payment>(
    order: Order,
    orderBy: Key
): (a: Payment, b: Payment) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Payment;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    { id: 'id', numeric: false, disablePadding: false, label: 'ID' },
    { id: 'amount', numeric: false, disablePadding: false, label: 'Amount (EGP)' },
    { id: 'customer_id', numeric: true, disablePadding: false, label: 'Customer' },
    { id: 'date', numeric: true, disablePadding: false, label: 'Date' },
    { id: 'info', numeric: true, disablePadding: false, label: 'Info' },
];

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Payment) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property: keyof Payment) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all payments' }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                <TableCell
                    align={'left'}
                >
                    Actions
                </TableCell>
            </TableRow>
        </TableHead>
    );
}

interface EnhancedTableToolbarProps {
    numSelected: number;
    paymentsData: Payment[];
    onSearch: (query: string) => void;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected, paymentsData, onSearch } = props;
    const [searchQuery, setSearchQuery] = React.useState('');

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchQuery(value);
        onSearch(value);
    };

    const csvHeaders = [
        { label: 'ID', key: 'id' },
        { label: 'Amount', key: 'name' },
        { label: 'Customer', key: 'customer_id' },
        { label: 'Date', key: 'date' },
        { label: 'Info', key: 'info' },
    ];

    return (
        <Toolbar
            sx={[
                { pl: { sm: 0 }, pr: { xs: 0, sm: 0 } },
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
                    Payments
                </Typography>
            )}
            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Stack direction="row" justifyContent="center" alignItems="center" gap={2}>
                    {/* CSV Export Button */}
                    <Tooltip title="Export CSV" arrow>
                        <IconButton sx={{ color: 'primary.main' }}>
                            <CSVLink
                                data={paymentsData}
                                headers={csvHeaders}
                                filename="payments_data.csv"
                                style={{ color: 'inherit', padding: 0, display: 'flex', alignItems: 'center' }}
                            >
                                <BiImport size={24} />
                            </CSVLink>
                        </IconButton>
                    </Tooltip>

                    <Button
                        variant="outlined"
                        component={Link}
                        to={`/payments/add`}
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
                            textWrap: "nowrap"
                        }}
                    >
                        Add Payment
                    </Button>

                    <FormControl variant="outlined" size="small" sx={{ minWidth: 250 }}>
                        <TextField
                            id="search-payments"
                            size="small"
                            value={searchQuery}
                            onChange={handleSearch}
                            label="Search..."
                            variant="outlined"
                            sx={{
                                '& .MuiInputLabel-root': {
                                    fontSize: 14,
                                },
                            }}
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

const Payments = () => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Payment>('id');
    const [selected, setSelected] = React.useState<readonly number[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const [rowToDelete, setRowToDelete] = React.useState<number | null>(null);

    const handleDeleteClick = (rowId: number) => {
        setRowToDelete(rowId);
        setOpenDeleteModal(true);
    };

    const handleClose = () => {
        setOpenDeleteModal(false);
        setRowToDelete(null);
    };

    const handleConfirmDelete = () => {
        console.log("Deleted row with ID:", rowToDelete);
        handleClose();
    };

    const handleRequestSort = (
        _event: React.MouseEvent<unknown>,
        property: keyof Payment,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = data.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (_event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly number[] = [];

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

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            [...data]
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage],
    );

    const handleSearch = (searchTerm: string) => {
        console.log(searchTerm);
    }

    return (
        <Paper elevation={0} sx={{ width: '100%', overflow: 'hidden' }}>
            <EnhancedTableToolbar numSelected={selected.length} paymentsData={data} onSearch={handleSearch} />
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
                        {visibleRows.map((row) => {
                            const isItemSelected = selected.indexOf(row.id) !== -1;
                            const labelId = `enhanced-table-checkbox-${row.id}`;

                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.id}
                                    selected={isItemSelected}
                                >
                                    <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                        <Checkbox
                                            color="primary"
                                            onClick={(event) => handleClick(event, row.id)}
                                            checked={isItemSelected}
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </TableCell>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.amount}</TableCell>
                                    <TableCell>{row.customer_id}</TableCell>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>{row.info}</TableCell>
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <Stack direction="row" spacing={1}>
                                            <IconButton
                                                component={Link}
                                                to={`/payments/${row.id}/update`}
                                                color="primary"
                                                sx={{
                                                    border: "1px solid"
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}                                            >
                                                <MdEdit />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                sx={{
                                                    border: "1px solid"
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClick(row.id);
                                                }}
                                            >
                                                <MdDelete />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { value: data.length, label: 'All' }]}
                                count={data.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
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
        </Paper>
    );
};

export default Payments;
