import { FormControl, MenuItem, Select } from '@mui/material'

interface ICustomSelectProps {
    label: string;
    options: string[];
    onChange: (text: string) => void;
    value: string
}

const CustomSelect: React.FC<ICustomSelectProps> = ({ label, options, onChange, value }) => {
    return (
        <FormControl className='space-y-1' fullWidth>
            <p className='text-slate-600'>{label}</p>
            <Select
                required
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className='bg-gray-50'
                size='small'
            >
                {
                    options.map(opt => (
                        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))
                }

            </Select>
        </FormControl>
    )
}

export default CustomSelect