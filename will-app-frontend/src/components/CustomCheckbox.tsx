import { Checkbox, FormControlLabel } from '@mui/material'
import React from 'react'

interface ICustomCheckboxProps {
    onChange: () => void
    label: string
    checked: boolean
}

const CustomCheckbox: React.FC<ICustomCheckboxProps> = ({ onChange, label, checked }) => {
    return (
        <div className='flex items-center gap-4'>
            <FormControlLabel control={<Checkbox checked={checked} onChange={() => onChange()} />} label={label} />
        </div>
    )
}

export default CustomCheckbox