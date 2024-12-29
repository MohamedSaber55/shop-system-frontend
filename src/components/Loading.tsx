import { Box, Typography } from '@mui/material';
import loadingSvg from "./../assets/svgicons/loader.svg"
const Loading = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                backgroundColor: '#f5f5f5',
            }}
        >
            <img src={loadingSvg} alt="loader" />
            <Typography variant="h6" sx={{ marginTop: 2, color: '#333' }}>
                Loading, please wait...
            </Typography>
        </Box>
    );
};

export default Loading;
