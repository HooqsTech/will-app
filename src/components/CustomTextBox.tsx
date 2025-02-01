import { HTMLInputTypeAttribute } from "react";

interface ICustomTextBoxProps {
    label: string;
    type: HTMLInputTypeAttribute;
}

const CustomTextBox: React.FC<ICustomTextBoxProps> = ({ label, type }) => {
    return (
        <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 ">{label}</label>
            <input type={type} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" />
        </div>
    )
}

export default CustomTextBox