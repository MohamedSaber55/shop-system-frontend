import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import notAuthorizedImage from "./../assets/unauthorized.png";

const NotAuthorized = () => {
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
                src={notAuthorizedImage}
                alt="Not Authorized"
                sx={{ width: '400px', height: 'auto' }}
            />
            <Typography variant="h5" sx={{ marginTop: 2, color: '#333' }}>
                Unauthorized Access
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 1, color: '#666' }}>
                You do not have permission to view this page.
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

export default NotAuthorized;
