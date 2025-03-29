import CustomCheckbox from './CustomCheckbox'

interface ICustomCheckboxContainer {
    onChange: () => void
    label: string
    checked: boolean
}

const CheckboxContainer: React.FC<ICustomCheckboxContainer> = ({ label, onChange, checked }) => {
    return (
        <div className="border-[1px] px-2 py-1 border-[#358477]">
            <CustomCheckbox label={label} checked={checked} onChange={() => onChange()} />
        </div>
    )
}

export default CheckboxContainer