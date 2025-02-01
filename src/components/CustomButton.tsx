interface ICustomButtonProps {
    label: string
    onClick: () => void
}

const CustomButton: React.FC<ICustomButtonProps> = ({ label, onClick }) => {
    return (
        <button onClick={onClick} className="text-white cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
            {label}
        </button>
    )
}

export default CustomButton