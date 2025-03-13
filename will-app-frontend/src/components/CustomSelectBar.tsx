interface ISelectOption {
    value: string;
    label: string;
}
interface ICustomSelectBarProps {
 options : ISelectOption[];
 onSelectChange: (value:string,multiple:boolean) => void;
 multiple: boolean;
 selectedOptions: string[];
}
const CustomSelectBar:React.FC<ICustomSelectBarProps>  = ({ options, onSelectChange, selectedOptions,multiple = false }) => {
  

  return (
    <div className="flex flex-col gap-7 mb-10">
      {options.map((option) => (
        <label
          key={option.value}
          className={`bg-[#FCFCFC] box-border relative rounded-xl flex justify-center items-center md:cursor-pointer shadow-[5px_5px_8px_0_#B4CBE280] overflow-hidden transition-colors duration-50 ease-linear border-2 ${
            selectedOptions.includes(option.value) ? 'border-blue' : 'border-[#FFFFFF33]'
          }`}
        >
          <input
            type={multiple ? 'checkbox' : 'radio'}
            name="distribution"
            value={option.value}
            checked={selectedOptions.includes(option.value)}
            onChange={() => onSelectChange(option.value,multiple)}
            className="peer absolute opacity-0"
          />
          <p className="first-letter:capitalize py-[18px] font-medium text-base text-dark_grey_text text-center px-5">
            {option.label}
          </p>
        </label>
      ))}
    </div>
  );
};

export default CustomSelectBar;
