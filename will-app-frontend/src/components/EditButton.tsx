import { Button } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';

interface IEditButtonProps {
    onClick: () => void
    loading?: boolean
    label?: string
    className?: string
}

const EditButton: React.FC<IEditButtonProps> = ({ onClick, loading, className }) => {
    return (
        <Button endIcon={<EditIcon />} onClick={onClick} loading={loading} variant="contained" sx={{
            borderRadius: 0,
            boxShadow: "none",
        }} className={`${className}`}>
            {
                "Edit"
            }
        </Button>
    )
}

export default EditButton