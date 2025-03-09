import { Button } from '@mui/material'
import NextIcon from '@mui/icons-material/ArrowForward';

interface INextButtonProps {
    onClick: () => void
    loading?: boolean
    label?: string
    className?: string
}

const NextButton: React.FC<INextButtonProps> = ({ onClick, loading, label, className }) => {
    return (
        <Button endIcon={<NextIcon />} onClick={onClick} loading={loading} variant="contained" sx={{
            borderRadius: 0,
            boxShadow: "none",
        }} className={`${className} mt-5`}>
            {
                label ?? "Save & Next"
            }
        </Button>
    )
}

export default NextButton