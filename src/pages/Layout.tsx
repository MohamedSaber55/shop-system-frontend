import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { MdCategory, MdDashboard } from "react-icons/md";
// import { RiShoppingCartFill, RiBarChart2Fill } from "react-icons/ri";
import { RiBankFill, RiShoppingCartFill } from "react-icons/ri";
import { FaCog, FaShoppingBag, FaSignOutAlt, FaUserLock, FaUsers } from "react-icons/fa";
import { HiOfficeBuilding } from "react-icons/hi";
import { FaUser } from "react-icons/fa6";
import { LuCalculator } from "react-icons/lu";
// import ScrollToTopButton from "../components/ScrollToTopButton";
import { GiProfit } from "react-icons/gi";
// assets--------------------------------------
import logo from "./../assets/mainlogo.png"
import { Avatar, Menu, MenuItem, Stack } from "@mui/material";
import { AiFillProduct } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { logout } from "../store/slices/accountSlice";``
const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
                },
            },
            {
                props: ({ open }) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
                },
            },
        ],
    }),
);

const routes = [
    {
        link: '/',
        title: 'Dashboard',
        icon: <MdDashboard size={22} />,
    },
    {
        link: '/expenses',
        title: 'Expenses',
        icon: <LuCalculator size={22} />,
    },
    {
        link: '/customers',
        title: 'Customers',
        icon: <FaUsers size={22} />,
    },
    {
        link: '/payments',
        title: 'Payments',
        icon: <RiBankFill size={22} />,
    },
    {
        link: '/orders',
        title: 'Orders',
        icon: <RiShoppingCartFill size={22} />,
    },
    {
        link: '/profits',
        title: 'Profits',
        icon: <GiProfit  size={22} />,
    },
    {
        link: '/merchants',
        title: 'Merchants',
        icon: <HiOfficeBuilding size={22} />,
    },
    {
        link: '/purchases',
        title: 'Purchases',
        icon: <FaShoppingBag size={22} />,
    },
    {
        link: '/products',
        title: 'Products',
        icon: <AiFillProduct size={22} />,
    },
    {
        link: '/categories',
        title: 'Categories',
        icon: <MdCategory size={22} />,
    },
    {
        link: '/users',
        title: 'Users',
        icon: <FaUser size={22} />,
    },
    {
        link: '/sessions',
        title: 'Sessions',
        icon: <FaUserLock size={22} />,
    },
];
const Layout = () => {
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(localStorage.getItem("sideNavOpen") == "true" ? true : false);
    const [profileAnchorEl, setProfileAnchorEl] = React.useState<HTMLElement | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setProfileAnchorEl(event.currentTarget as HTMLElement);
    };

    const handleProfileMenuClose = () => {
        setProfileAnchorEl(null);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
        localStorage.setItem("sideNavOpen", "true");
    };

    const handleDrawerClose = () => {
        setOpen(false);
        localStorage.setItem("sideNavOpen", "false");
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login")
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            {/* <ScrollToTopButton /> */}
            <AppBar sx={{ backgroundColor: "#fff", borderBottom: "1px solid #ddd", boxShadow: "none", color: "GrayText" }} position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={[
                            {
                                marginRight: 5,
                            },
                            open && { display: 'none' },
                        ]}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Stack direction="row" alignItems="center" justifyItems="center" gap={1}>
                        <img src={logo} width={40} />
                        {/* <Typography variant="h5" noWrap component="div" color="#FF8C00"> */}
                        <Typography variant="h5" noWrap component="div" color="textPrimary">
                            Shop System
                        </Typography>
                    </Stack>
                    {/* Right side buttons */}
                    <Stack
                        direction="row"
                        alignItems="center"
                        gap={1}
                        sx={{ ml: "auto" }}
                    >

                        {/* Profile Button */}
                        <Box>
                            <IconButton onClick={handleProfileMenuOpen} color="inherit">
                                <Avatar alt="Mohamed Saber" src={"avatarImag"} />
                            </IconButton>
                            <Menu
                                anchorEl={profileAnchorEl}
                                open={Boolean(profileAnchorEl)}
                                onClose={handleProfileMenuClose}
                            >
                                <MenuItem onClick={handleProfileMenuClose}>
                                    <FaUser style={{ marginRight: 8 }} /> Profile
                                </MenuItem>
                                <MenuItem onClick={handleProfileMenuClose}>
                                    <FaCog style={{ marginRight: 8 }} /> Settings
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    <FaSignOutAlt color="#FF0000" style={{ marginRight: 8 }} /> Logout
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Stack>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {routes?.map((route, i) => (
                        <ListItem key={i} disablePadding sx={{ display: 'block' }}>
                            <Link to={route.link}>
                                <ListItemButton
                                    sx={[
                                        {
                                            minHeight: 48,
                                            px: 2.5,
                                            backgroundColor: location.pathname === route.link ? "#1976d250" : 'transparent',
                                            borderLeft: location.pathname === route.link ? "4px solid #1976d2" : '4px solid transparent',
                                            ":hover": {
                                                backgroundColor: location.pathname === route.link ? "#1976d280" : '#cccccc50',
                                                borderLeft: location.pathname === route.link ? "4px solid #1976d2" : '4px solid #cccccc',
                                            },
                                        },
                                        open
                                            ? {
                                                justifyContent: 'initial',
                                            }
                                            : {
                                                justifyContent: 'center',
                                            },
                                    ]}
                                >
                                    <ListItemIcon
                                        sx={[
                                            {
                                                minWidth: 0,
                                                justifyContent: 'center',
                                                color: location.pathname === route.link ? "#1976d2" : 'd',
                                            },
                                            open
                                                ? {
                                                    mr: 3,
                                                }
                                                : {
                                                    mr: 'auto',
                                                },
                                        ]}
                                    >
                                        {route.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        secondary={route.title}
                                        sx={[
                                            open
                                                ? {
                                                    opacity: 1,
                                                }
                                                : {
                                                    opacity: 0,
                                                },
                                        ]}
                                    />
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Outlet />
            </Box>
        </Box >
    )
}

export default Layout