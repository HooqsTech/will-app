import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

interface ICustomDatePickerProps {
    label: string;
    value: Dayjs | null;
    onChange: (date: Dayjs | null) => void
}

const CustomDatePicker: React.FC<ICustomDatePickerProps> = ({ label, onChange, value }) => {
    return (
        <div className='space-y-1'>
            <p className='text-slate-600'>{label}</p>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    value={value}
                    onChange={(e) => onChange(e)}
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