import { ReactNode } from "react";

interface ICustomFormContainerProps {
  formLabel?: string;
  children: ReactNode;
  hideBorder?: boolean;
}

const CustomFormContainer: React.FC<ICustomFormContainerProps> = ({ children, formLabel, hideBorder }) => {
  return (
    <div className={`${hideBorder !== true && "shadow-md shadow-gray-400"} rounded-lg p-6`}>
      {
        formLabel !== "" && formLabel !== undefined &&
        <h1 className="mb-4 text-2xl font-medium leading-none text-gray-900 pb-4">{formLabel}</h1>
      }
      <div className="flex flex-col gap-4">
        {
          children
        }
      </div>
    </div>
  )
}

export default CustomFormContainer