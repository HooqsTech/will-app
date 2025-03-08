import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'

interface ICustomSelectProps {
    label: string;
    options: string[];
    onChange: (text: string) => void;
    value: string;
    required?: boolean
    helperText?: string
}

const CustomSelect: React.FC<ICustomSelectProps> = ({ label, options, onChange, value, required, helperText }) => {
    return (
        <FormControl error={helperText !== undefined && helperText.length > 0} required={required} fullWidth className='font-[frank]' size='small'>
            <InputLabel>{label}</InputLabel>
            <Select
                required={required}
                value={value}
                label={label}
                className='font-[frank]'
                onChange={(e) => onChange(e.target.value)}
                size='small'
            >
                {
                    options.map(opt => (
                        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))
                }
            </Select>
            <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
    )
}

export default CustomSelect