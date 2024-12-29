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
import { visuallyHidden } from '@mui/utils';
// import { users } from "./../data/users.json";
import { CSVLink } from "react-csv";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Menu, MenuItem, Stack, TableFooter, TextField } from '@mui/material';
import { BiImport } from 'react-icons/bi';
import { FaArchive, FaEdit, FaRegEdit, FaTrash } from "react-icons/fa";
import { blue, green, red } from '@mui/material/colors';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { deleteUser, getAllUsers } from '../store/slices/accountSlice';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: number;
}

// const data: User[] = users;

function descendingComparator(a: User, b: User, orderBy: keyof User) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof User>(
    order: Order,
    orderBy: Key
): (a: User, b: User) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof User;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    { id: 'id', numeric: false, disablePadding: false, label: 'ID' },
    { id: 'firstName', numeric: false, disablePadding: false, label: 'FirstName' },
    { id: 'lastName', numeric: false, disablePadding: false, label: 'LastName' },
    { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
    { id: 'phone', numeric: false, disablePadding: false, label: 'Phone' },
    { id: 'role', numeric: false, disablePadding: false, label: 'Role' },
];

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof User) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property: keyof User) => (event: React.MouseEvent<unknown>) => {
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
                        inputProps={{ 'aria-label': 'select all users' }}
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
                <TableCell>
                    Actions
                </TableCell>
            </TableRow>
        </TableHead>
    );
}

interface EnhancedTableToolbarProps {
    numSelected: number;
    usersData: User[];
    onSearch: (query: string) => void;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected, usersData, onSearch } = props;
    const [searchQuery, setSearchQuery] = React.useState(''); // State to handle the search input
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchQuery(value);
        onSearch(value);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleBulkAction = (action: string) => {
        console.log(`Selected action: ${action}`);
        handleMenuClose();
    };

    const csvHeaders = [
        { label: 'ID', key: 'id' },
        { label: 'FirstName', key: 'firstName' },
        { label: 'LastName', key: 'lastName' },
        { label: 'Email', key: 'email' },
        { label: 'Phone', key: 'phone' },
        { label: 'role', key: 'role' },
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
                    Users
                </Typography>
            )}
            {numSelected > 0 ? (
                <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
                    <Tooltip title="Bulk Actions">
                        <IconButton color="default" onClick={handleMenuOpen}>
                            <FaRegEdit />
                        </IconButton>
                    </Tooltip>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem onClick={() => handleBulkAction('edit')}>
                            <FaEdit style={{ color: blue[500], marginRight: 8 }} />
                            Edit
                        </MenuItem>
                        <MenuItem onClick={() => handleBulkAction('delete')}>
                            <FaTrash style={{ color: red[500], marginRight: 8 }} />
                            Delete
                        </MenuItem>
                        <MenuItem onClick={() => handleBulkAction('archive')}>
                            <FaArchive style={{ color: green[500], marginRight: 8 }} />
                            Archive
                        </MenuItem>
                    </Menu>
                </Stack>
            ) : (
                <Stack direction="row" justifyContent="center" alignItems="center" gap={2}>
                    <Tooltip title="Export CSV">
                        <IconButton sx={{ color: 'primary.main' }}>
                            <CSVLink
                                data={usersData}
                                headers={csvHeaders}
                                filename="users_data.csv"
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
                        <Link to={"/users/add"} style={{ color: "inherit", textDecoration: 'none', whiteSpace: "nowrap" }}>Add User</Link>
                    </Button>

                    <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                        <TextField
                            id="search-users"
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

const Users = () => {
    const [order, setOrder] = React.useState<Order>("asc");
    const [orderBy, setOrderBy] = React.useState<keyof User>("id");
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const [rowToDelete, setRowToDelete] = React.useState<string | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const state = useSelector((state: RootState) => state.users);
    const data = React.useMemo(() => state?.users || [], [state?.users]);

    React.useEffect(() => {
        if (state.token) {
            dispatch(getAllUsers({ token: state.token }));
        }
    }, [dispatch, state.token]);

    const handleDeleteClick = (rowId: string) => {
        setRowToDelete(rowId);
        dispatch(deleteUser({ userId: rowId , token: state.token }));
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
        property: keyof User
    ) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
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

    const handleClick = (_event: React.MouseEvent<unknown>, id: string) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
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

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            [...data]
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [data, order, orderBy, page, rowsPerPage]
    );

    const handleSearch = (searchTerm: string) => {
        console.log(searchTerm);
    };

    return (
        <Paper elevation={0} sx={{ width: "100%", overflow: "hidden" }}>
            <EnhancedTableToolbar
                numSelected={selected.length}
                usersData={data}
                onSearch={handleSearch}
            />
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
                        {visibleRows.map((row, i) => {
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
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            onClick={(event) => handleClick(event, row.id)}
                                            checked={isItemSelected}
                                            inputProps={{ "aria-labelledby": labelId }}
                                        />
                                    </TableCell>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell>{row.firstName}</TableCell>
                                    <TableCell>{row.lastName}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.phone || "N/A"}</TableCell>
                                    <TableCell>{row.role == 1 ? "Admin" : "User"}</TableCell>
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <Stack direction="row" spacing={1}>
                                            <IconButton
                                                component={Link}
                                                to={`/users/${row.id}/update`}
                                                color="primary"
                                                sx={{ border: "1px solid" }}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <MdEdit />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                sx={{ border: "1px solid" }}
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
                                rowsPerPageOptions={[5, 10, 25, { value: data.length, label: "All" }]}
                                count={data.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                slotProps={{
                                    select: {
                                        inputProps: {
                                            "aria-label": "rows per page",
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
                    <Button
                        onClick={handleClose}
                        color="primary"
                        variant="contained"
                        sx={{
                            boxShadow: "none",
                            ":hover": {
                                boxShadow: "none",
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                        sx={{
                            boxShadow: "none",
                            ":hover": {
                                boxShadow: "none",
                            },
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default Users