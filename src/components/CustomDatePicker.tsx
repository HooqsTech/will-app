import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface ICustomDatePickerProps {
    label: string
}

const CustomDatePicker: React.FC<ICustomDatePickerProps> = ({ label }) => {
    return (
        <div className='space-y-1'>
            <p className='text-slate-600'>{label}</p>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    slotProps={
                        {
                            textField: {
                                size: "small"
                            }
                        }
                    }
                    className='w-full bg-gray-50'
                />
            </LocalizationProvider>
        </div>
    )
}

export default CustomDatePicker