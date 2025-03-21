import { ReactNode } from "react";

interface ICustomFormContainerProps {
  formLabel?: string;
  children: ReactNode;
  hideBorder?: boolean;
}

const CustomFormContainer: React.FC<ICustomFormContainerProps> = ({ children, formLabel, hideBorder }) => {
  return (
    <div className={`${hideBorder !== true ? " shadow-gray-400 shadow-[0px_15px_20px_-5px_rgba(0,_0,_0,_0.1)] p-6 md:p-12" : "p-2"} font-[frank]`}>
      {
        formLabel !== "" && formLabel !== undefined &&
        <h1 className="mb-4 text-2xl leading-none font-semibold text-gray-900 pb-4">{formLabel}</h1>
      }
      <div className="flex flex-col gap-4 font-[frank]">
        {
          children
        }
      </div>
    </div>
  )
}

export default CustomFormContainer