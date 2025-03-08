import { Button } from '@mui/material'
import NextIcon from '@mui/icons-material/ArrowForward';

interface INextButtonProps {
    label: string
    onClick: () => void
    loading?: boolean
}

const NextButton: React.FC<INextButtonProps> = ({ onClick, loading, label }) => {
    return (
        <Button endIcon={<NextIcon />} onClick={onClick} loading={loading} variant="contained" sx={{
            borderRadius: 0,
            boxShadow: "none"
        }} className="mt-5">
            {label}
        </Button>
    )
}

export default NextButton