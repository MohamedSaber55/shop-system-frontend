import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import notFoundImage from "./../assets/404.png"
const NotFound = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundColor: '#f5f5f5',
            }}
        >
            <Box
                component="img"
                src={notFoundImage}
                alt="404 Not Found"
                sx={{ width: '400px', height: 'auto' }}
            />
            <Typography variant="h5" sx={{ marginTop: 2, color: '#333' }}>
                Oops! Page Not Found
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 1, color: '#666' }}>
                The page you are looking for does not exist.
            </Typography>
            <Button
                component={Link}
                to="/"
                variant="contained"
                color="primary"
                sx={{ marginTop: 3, ":hover": { color: "#fff" }, boxShadow: "none" }}
            >
                Go Back Home
            </Button>
        </Box>
    );
}

export default NotFound;
