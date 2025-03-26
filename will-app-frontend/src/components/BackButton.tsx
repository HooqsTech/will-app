import React from 'react'
import { Button } from '@mui/material'
import BackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';

interface IBackButtonProps {
    label: string
    loading?: boolean
}

const BackButton: React.FC<IBackButtonProps> = ({ loading, label }) => {
    const navigate = useNavigate();
    return (
        <Button startIcon={<BackIcon />} onClick={() => navigate(-1)} loading={loading} variant="contained" sx={{
            borderRadius: 0,
            boxShadow: "none"
        }} className="mt-5">
            {label}
        </Button>
    )
}

export default BackButton