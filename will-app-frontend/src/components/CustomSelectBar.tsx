interface ISelectOption {
    value: string;
    label: string;
}
interface ICustomSelectBarProps {
 options : ISelectOption[];
 onSelectChange: (value:string) => void;
 multiple: boolean;
 selectedOptions: string[];
 onInputChange?: (value: string, input: string) => void;
 showAdditionalInput?: boolean; 
 onPercentageInput?: Record<string, string>
}
const CustomSelectBar:React.FC<ICustomSelectBarProps>  = ({ options, onSelectChange, selectedOptions,onInputChange,onPercentageInput,multiple = false,showAdditionalInput = false }) => {

  const handleInputChange = (value: string, input: string) => {
     onInputChange?.(value, input); // Call only if provided
  };

  return (
    <div className="flex flex-col gap-7 mb-10">
      
      {options.map((option) => (
        <div key={option.value} className="flex gap-x-4 justify-between items-center">
          <label
            key={option.value}
            className={`bg-[#FCFCFC] box-border relative rounded-xl w-full flex justify-center items-center md:cursor-pointer shadow-[5px_5px_8px_0_#B4CBE280] overflow-hidden transition-colors duration-50 ease-linear border-2 ${
              selectedOptions.includes(option.value) ? 'border-blue' : 'border-[#FFFFFF33]'
            }`}
          >
            <input
              type={multiple ? 'checkbox' : 'radio'}
              name="distribution"
              value={option.value}
              checked={selectedOptions.includes(option.value)}
              onChange={() => onSelectChange(option.value)}
              className="peer absolute opacity-0"
            />
            <p className="first-letter:capitalize py-[18px] font-medium text-base text-dark_grey_text text-center px-5">
              {option.label}
            </p>
          </label>
          {showAdditionalInput && selectedOptions.length > 1 && selectedOptions.includes(option.value) && (
            <div className="flex flex-col gap-1.5 !h-[64px] !w-[84px] !text-center">
                <input
                type="text"
                onKeyDown={(e) => {
                  if (!/^\d$/.test(e.key) && e.key !== "Backspace") {
                      e.preventDefault(); // Block non-numeric keys
                  }
                }}
                placeholder="%"
                value={onPercentageInput?.[option.value] ?? ""}
                onChange={(e) =>
                  handleInputChange(option.value, e.target.value)
                }
                className="text-input  border border-light_blue !h-[64px] !w-[84px] !text-center"
              />
            </div>
          )}
        </div>
      ))}
      
    </div>
  );
};

export default CustomSelectBar;
