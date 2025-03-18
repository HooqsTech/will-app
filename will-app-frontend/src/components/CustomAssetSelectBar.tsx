import React from "react";
import { IAssetSelectionState } from "../pages/AssetDistributionSpecificPage";
import EditButton from "./EditButton";

interface ICustomAssetSelectBarProps {
  assets: IAssetSelectionState[];
  onSelectChange: (value: string) => void;
  multiple: boolean;
  selectedOptions: string[];
  onEdit:(value:string) => void;
}

const CustomAssetSelectBar: React.FC<ICustomAssetSelectBarProps> = ({ 
  assets, 
  onSelectChange, 
  selectedOptions,
  onEdit, 
  multiple = false 
}) => {
  console.log(assets);
  console.log(selectedOptions);

  return (
    <div className="flex flex-col gap-7 mb-10">
      {assets.map((asset) => {
        if (!asset.assetId) return null; // Ignore empty assetIds

        return (
          <div key={asset.assetId} className="flex gap-x-4 justify-between items-center">
            {!asset.isAssetDistributed ? (
              <label
                className={`bg-[#FCFCFC] box-border relative rounded-xl flex w-full justify-center items-center md:cursor-pointer shadow-[5px_5px_8px_0_#B4CBE280] overflow-hidden transition-colors duration-50 ease-linear border-2 ${
                  selectedOptions.includes(asset.assetId) ? "border-blue" : "border-[#FFFFFF33]"
                }`}
              >
                <input
                  type={multiple ? "checkbox" : "radio"}
                  name="distribution"
                  value={asset.assetId}
                  checked={selectedOptions.includes(asset.assetId)}
                  onChange={() => onSelectChange(asset.assetId)}
                  className="peer absolute opacity-0"
                />
                <div className="py-[20px]">
                  <p className="first-letter:capitalize font-semibold text-base text-dark_grey_text ">
                    {asset.type}
                  </p>
                  <p className="first-letter:capitalize font-medium text-base text-dark_grey_text">
                    {asset.firstline}
                  </p>
                  <p className="first-letter:capitalize font-medium text-base text-dark_grey_text">
                    {asset.secondline}
                  </p>
                </div>
              </label>
            ) : (
              <div className="relative flex box-border p-6 border bg-[#FFFFFFB2] border-[#FFFFFF33] rounded-xl shadow-[3px_3px_6px_0_#B4CBE240] w-full">
                <div className="flex flex-col gap-y-5 w-full">
                  {/* Header Section */}
                  <div className="flex flex-col items-start">
                    <p className="header capitalize">{asset.type}</p>
                    <div className="font-medium text-sm leading-[24px] text-[#848484]">
                      <p>{asset.firstline}</p>
                      <p>{asset.secondline}</p>
                    </div>
                  </div>

                  {/* Property Stats */}
                  <div className="flex flex-col gap-y-4 w-full">
                    {asset.beneficiarieslist?.map((beneficiary) => (
                      <div key={beneficiary.beneficiaryId} className="flex gap-3 items-center pr-7 w-full">
                        <p className="text-sm leading-[24px] text-dark_grey_text font-medium">
                          {beneficiary.beneficiaryName}
                        </p>
                        <hr className="border-dashed border-very-light-grey-text border h-px grow" />
                        <p className="text-sm leading-[24px] text-dark_grey_text font-medium">
                          {beneficiary.percentage}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute top-4 right-3 flex items-center gap-2">
                  <EditButton onClick={() => onEdit(asset.assetId)} className=" hover:bg-gray-200 rounded-full" />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CustomAssetSelectBar;
