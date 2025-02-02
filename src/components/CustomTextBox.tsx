import TextField from "@mui/material/TextField";
import { HTMLInputTypeAttribute } from "react";

interface ICustomTextBoxProps {
    label: string;
    type: HTMLInputTypeAttribute;
}

const CustomTextBox: React.FC<ICustomTextBoxProps> = ({ label, type }) => {
    return (
        <div className="space-y-1">
            <p className='text-slate-600'>{label}</p>
            <TextField
                className="w-full text-sm p-2.5 bg-gray-50 border-gray-300 text-gray-900 block rounded-lg"
                type={type}
                required
                id="outlined-required"
                size="small"
            />
        </div>

    )
}

export default CustomTextBox