import React from 'react'
import { Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';

interface IAddButtonProps {
    label: string
    onClick: () => void
    loading?: boolean
}

const AddButton: React.FC<IAddButtonProps> = ({ onClick, loading, label }) => {
    return (
        <Button startIcon={<AddIcon />} disableElevation onClick={onClick} loading={loading} variant="contained" className="mt-5 w-full bg-[#358477]">
            {label}
        </Button>
    )
}

export default AddButton