import { Button } from "@mui/material"

interface ICustomButtonProps {
    label: string
    onClick: () => void
    loading?: boolean
}

const CustomButton: React.FC<ICustomButtonProps> = ({ label, onClick, loading }) => {
    return (
        <Button onClick={onClick} loading={loading} variant="contained" sx={{
            borderRadius: 0,
            boxShadow: "none"
        }} className="mt-5 font-[frank] normal-case">
            {label}
        </Button>
    )
}

export default CustomButton