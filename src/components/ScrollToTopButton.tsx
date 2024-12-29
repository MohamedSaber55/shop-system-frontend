import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { Button } from '@mui/material';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        isVisible && (
            <Button
                onClick={scrollToTop}
                color='primary'
                variant='contained'
                sx={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex:"999",
                    borderRadius: '50%',
                    minWidth: '50px',
                    height: '50px',
                }}
            >
                <FaArrowUp />
            </Button>
        )
    );
};

export default ScrollToTopButton;
