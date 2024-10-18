import React from 'react';
import { Button, Typography } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

const CircularButton: React.FC<{ Icon: SvgIconComponent|string, onClick: () => void, ariaLabel?: string }> = ({ Icon, onClick, ariaLabel }) => {
    return (
        <Button
            onClick={onClick}
            aria-label={ariaLabel ?? "button"}
            sx={{
                width: 60,
                height: 60,
                minWidth: 0,
                minHeight: 0,
                borderRadius: '50%',
                padding: 0,
                backgroundColor: '#007bff',
                '&:hover': {
                    backgroundColor: '#0056b3',
                },
            }}
        >
            {typeof(Icon) === "string" ? 
            <Typography fontSize={45} color="#fff">
                {Icon}
            </Typography> 
            :
            <Icon
                sx={{
                    color: '#fff', // Icon color
                    fontSize: 45,  // Icon size
                }} 
            />}
        </Button>
    );
};

export { CircularButton };