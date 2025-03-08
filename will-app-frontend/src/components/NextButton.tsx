import { Button } from '@mui/material'
import NextIcon from '@mui/icons-material/ArrowForward';

interface INextButtonProps {
    onClick: () => void
    loading?: boolean
}

const NextButton: React.FC<INextButtonProps> = ({ onClick, loading }) => {
    return (
        <Button endIcon={<NextIcon />} onClick={onClick} loading={loading} variant="contained" sx={{
            borderRadius: 0,
            boxShadow: "none"
        }} className="mt-5">
            Save & Next
        </Button>
    )
}

export default NextButton