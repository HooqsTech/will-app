import { FormControl, MenuItem, Select } from '@mui/material'

interface ICustomSelectProps {
    label: string;
    options: string[];
    onChange: (text: string) => void;
    value: string
}

const CustomSelect: React.FC<ICustomSelectProps> = ({ label, options, onChange, value }) => {
    return (
        <div className='space-y-1 w-full'>
            <p className='text-slate-600'>{label}</p>
            <Select
                required
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className='bg-gray-50 w-full'
                size='small'
            >
                {
                    options.map(opt => (
                        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))
                }

            </Select>
        </div>
    )
}

export default CustomSelect