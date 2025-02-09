import { ReactNode } from "react";

interface ICustomFormContainerProps {
  formLabel?: string;
  children: ReactNode;
  hideBorder?: boolean;
}

const CustomFormContainer: React.FC<ICustomFormContainerProps> = ({ children, formLabel, hideBorder }) => {
  return (
    <div className={`${hideBorder !== true && "border-[0.1px] border-slate-400 p-8"} rounded-lg`}>
      {
        formLabel !== "" &&
        <h3 className="mb-4 text-lg font-medium leading-none text-gray-900 ">{formLabel}</h3>
      }
      <div className="grid gap-4 mb-4 sm:grid-cols-1">
        {
          children
        }
      </div>
    </div>
  )
}

export default CustomFormContainer