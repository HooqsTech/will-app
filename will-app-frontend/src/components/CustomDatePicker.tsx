import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

interface ICustomDatePickerProps {
    label: string;
    value: Dayjs | null;
    onChange: (date: Dayjs | null) => void;
    required?: boolean;
    helperText?: string;
}

const CustomDatePicker: React.FC<ICustomDatePickerProps> = ({ label, onChange, value, required, helperText }) => {
    return (
        <div className='space-y-1'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    value={value}
                    label={label}
                    onChange={(e) => onChange(e)}
                    slotProps={
                        {
                            textField: {
                                error: helperText !== undefined && helperText !== null && helperText.length > 0,
                                helperText: helperText,
                                required: required,
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