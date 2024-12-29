import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { CSVLink } from "react-csv";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Stack, TableFooter, TablePagination, TextField } from '@mui/material';
import { BiImport } from 'react-icons/bi';
import { FaTrash } from "react-icons/fa";
import AddCategoryModal from '../components/AddCategoryModal';
import { MdDelete, MdEdit } from 'react-icons/md';
import UpdateCategory from '../components/UpdateCategory';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { deleteCategory, getAllCategories } from '../store/slices/categorySlice';
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions';

interface Category {
    id?: number | string;
    name: string;
}
interface HeadCell {
    id: keyof Category;
    label: string;
}

const headCells: readonly HeadCell[] = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Name' },
];

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Category) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    orderBy: string;
    order: boolean;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property: keyof Category) => (event: React.MouseEvent<unknown>) => {
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
                        inputProps={{ 'aria-label': 'select all categories' }}
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
    categoriesData: Category[];
    selected: number[];
    onSearch: (query: string) => void;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected, selected, categoriesData, onSearch } = props;
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isModalOpen, setModalOpen] = React.useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const userState = useSelector((state: RootState) => state.users);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchQuery(value);
        onSearch(value);
    };

    const handleBulkAction = (action: string) => {
        if (action === 'delete') {
            dispatch(deleteCategory({ token: userState.token, ids: selected })).then(() => {
                dispatch(getAllCategories({ token: userState.token }))
            })
        }
    };

    const csvHeaders = [
        { label: 'ID', key: 'id' },
        { label: 'Name', key: 'name' },
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
                    Categories
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
                                data={categoriesData}
                                headers={csvHeaders}
                                filename="categories_data.csv"
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
                            textWrap: "nowrap"
                        }}
                        onClick={() => setModalOpen(true)}
                    >
                        Add Category
                    </Button>
                    <AddCategoryModal
                        open={isModalOpen}
                        handleClose={() => setModalOpen(false)}
                    />

                    <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                        <TextField
                            id="search-categories"
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

const Categories = () => {
    const [order, setOrder] = React.useState<boolean>(true);
    const [orderBy, setOrderBy] = React.useState<keyof Category>('id');
    const [pageNumber, setPageNumber] = React.useState<number>(0);
    const [pageSize, setPageSize] = React.useState<number>(10);
    const [searchTerm, setSearchTerm] = React.useState<string>("");
    const [selected, setSelected] = React.useState<number[]>([]);
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const [rowToDelete, setRowToDelete] = React.useState<number | undefined | string>(undefined);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);
    const state = useSelector((state: RootState) => state.categories);
    const userState = useSelector((state: RootState) => state.users);
    const dispatch = useDispatch<AppDispatch>();
    const data: Category[] = state?.categories;
    const totalCount = state.metaData.totalCount
    React.useEffect(() => {
        const params = {
            PageNumber: pageNumber + 1,
            PageSize: pageSize,
            Search: searchTerm,
            SortField: orderBy,
            SortDescending: order,
        }
        dispatch(getAllCategories({ token: userState.token, params }))
    }, [dispatch, order, orderBy, pageNumber, pageSize, searchTerm, userState.token])

    const handleEditClick = (merchant: Category) => {
        setSelectedCategory(merchant);
        setIsUpdateModalOpen(true);
    };

    // Function to handle closing the modal
    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false);
        setSelectedCategory(null);
    };
    const handleDeleteClick = (rowId: number | undefined | string) => {
        setRowToDelete(rowId);
        setOpenDeleteModal(true);
    };

    const handleClose = () => {
        setOpenDeleteModal(false);
        setRowToDelete(undefined);
    };

    const handleConfirmDelete = () => {
        if (rowToDelete !== undefined) {
            dispatch(deleteCategory({ token: userState.token, ids: [rowToDelete] })).then(() => {
                dispatch(getAllCategories({ token: userState.token }))
            })
        }
        handleClose();
    };

    const handleRequestSort = (
        _event: React.MouseEvent<unknown>,
        property: keyof Category,
    ) => {
        const isAsc = orderBy === property && order === false;
        setOrder(isAsc ? true : false);
        setOrderBy(property);
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
        dispatch(getAllCategories({ token: userState.token, params }))
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPageSize(parseInt(event.target.value, 10));
        setPageNumber(0);
    };

    return (
        <Paper elevation={0} sx={{ width: '100%', overflow: 'hidden' }}>
            <EnhancedTableToolbar numSelected={selected.length} selected={selected} categoriesData={data} onSearch={handleSearch} />
            <TableContainer sx={{ border: "1px solid #eee" }}>
                <Table stickyHeader aria-label="sticky table">
                    <EnhancedTableHead
                        numSelected={selected.length}
                        orderBy={orderBy}
                        order={order}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={data.length}
                    />
                    <TableBody>
                        {data.map((row, i) => {
                            const isItemSelected = selected.indexOf(Number(row.id) || -1) !== -1;
                            // const isItemSelected = selected.indexOf(row.id) !== -1;
                            const labelId = `enhanced-table-checkbox-${row.id}`;
                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.id?.toString()}
                                    selected={isItemSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            onClick={(event) => handleClick(event, Number(row.id))}
                                            checked={isItemSelected}
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {/* {row.id?.toString()} */}
                                        {i + 1}
                                    </TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <Stack direction="row" spacing={1}>
                                            <IconButton
                                                color="primary"
                                                sx={{
                                                    border: "1px solid"
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditClick(row);
                                                }}                                                          >
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
                        <UpdateCategory
                            open={isUpdateModalOpen}
                            onClose={handleCloseUpdateModal}
                            categoryData={selectedCategory || null}
                        />
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

export default Categories