import { useState } from "react";
import CustomSelectBar from "../components/CustomSelectBar";

const AssetDistributionSelectionPage = () => {

    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const options = [
    { value: 'Single', label: 'Leave everything to a single beneficiary' },
    { value: 'Specific', label: 'Assign certain assets to certain beneficiaries and divide the rest' },
    { value: 'Percentage', label: 'Divide my assets by percentage among the beneficiaries' },
  ];

  const handleSelectChange = (value: string, multiple:boolean) => {
    let newSelections = [];
    if (multiple) {
      newSelections = selectedOptions.includes(value)
        ? selectedOptions.filter((option) => option !== value)
        : [...selectedOptions, value];
    } else {
      newSelections = [value];
    }
    setSelectedOptions(newSelections);
  };
  
  return (
    <div className="flex flex-col justify-between px-[30px] w-full min-h-[calc(100dvh-232px)] md:max-w-[560px] md:min-h-auto md:mx-auto md:px-0">
      <h2 className="text-xl font-bold mb-5">Select Distribution Method</h2>
      <CustomSelectBar
        options={options}
        onSelectChange={handleSelectChange}
        multiple={false}
        selectedOptions={selectedOptions}
      />
    <div className="flex mt-10 w-full gap-16">
        <button className="bg-gray-300 text-black px-24 py-2 rounded-lg hover:bg-gray-400">Skip</button>
        <button className="bg-blue-600 text-white px-21 py-2 rounded-lg hover:bg-blue-700">Save & continue</button>
    </div>
    </div>
  );
}

export default AssetDistributionSelectionPage;