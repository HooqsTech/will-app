import React from 'react'
import { Button } from '@mui/material'
import BackIcon from '@mui/icons-material/ArrowBack';

interface IBackButtonProps {
    label: string
    onClick: () => void
    loading?: boolean
}

const BackButton: React.FC<IBackButtonProps> = ({ onClick, loading, label }) => {
    return (
        <Button startIcon={<BackIcon />} onClick={onClick} loading={loading} variant="contained" sx={{
            borderRadius: 0,
            boxShadow: "none"
        }} className="mt-5">
            {label}
        </Button>
    )
}

export default BackButton