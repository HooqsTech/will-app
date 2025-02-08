import { ReactNode } from "react";

interface ICustomFormContainerProps {
  formLabel: string;
  children: ReactNode
}

const CustomFormContainer: React.FC<ICustomFormContainerProps> = ({ children, formLabel }) => {
  return (
    <div className="p-8 border-[0.1px] border-slate-400 rounded-lg">
      <h3 className="mb-4 text-lg font-medium leading-none text-gray-900 ">{formLabel}</h3>
      <div className="grid gap-4 mb-4 sm:grid-cols-1">
        {
          children
        }
      </div>
    </div>
  )
}

export default CustomFormContainer