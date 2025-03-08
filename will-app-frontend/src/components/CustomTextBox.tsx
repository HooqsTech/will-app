import TextField from "@mui/material/TextField";
import { ChangeEvent, HTMLInputTypeAttribute } from "react";

interface ICustomTextBoxProps {
    label: string;
    type: HTMLInputTypeAttribute;
    onChange: (text: string) => void
    value: unknown,
    required?: boolean,
    helperText?: string,
    maxLength?: number,
    restrictAlphabets?: boolean
}

const CustomTextBox: React.FC<ICustomTextBoxProps> = ({ label, type, onChange, value, required, helperText, maxLength, restrictAlphabets }) => {

    const handleOnChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // FORWARD VALUE
        if (restrictAlphabets) {
            onChange(e.target.value.replace(/\D/, ''))
        }
        else {
            onChange(e.target.value);
        }
    }

    return (
        <div className="space-y-1">
            <TextField
                className={`w-full text-sm p-2.5 focus:border-[#265e55] focus:outline-[##265e55]border-gray-300 text-gray-900 block rounded-lg`}
                type={type}
                value={value}
                label={label}
                error={helperText !== undefined && helperText.length > 0}
                onChange={(e) => handleOnChange(e)}
                required={required}
                helperText={helperText}
                id="outlined-required"
                size="small"
                slotProps={{
                    htmlInput: {
                        maxLength: maxLength
                    }
                }}
            />
        </div>

    )
}

export default CustomTextBox