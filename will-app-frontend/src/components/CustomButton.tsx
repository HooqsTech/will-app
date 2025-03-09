import { Button } from "@mui/material"

interface ICustomButtonProps {
    label: string
    onClick: () => void
    loading?: boolean
    className?: string
}

const CustomButton: React.FC<ICustomButtonProps> = ({ label, onClick, loading, className }) => {
    return (
        <Button onClick={onClick} loading={loading} variant="contained" sx={{
            textTransform: "none",
            borderRadius: 0,
            boxShadow: "none"
        }} className={`${className} mt-5 font-[frank] normal-case`}>
            {label}
        </Button>
    )
}

export default CustomButton