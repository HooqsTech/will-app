import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import CustomSelect from "../CustomSelect";
import { businessesState, IBusinessState } from "../../atoms/BusinessesState";

interface IBankAccountFormProps {
    index: number
}

const BusinessForm: React.FC<IBankAccountFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IBusinessState[]>(businessesState);
    const item = formState[index];

    const handleChange = (index: number, key: keyof IBusinessState, value: string) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    return (
        <CustomFormContainer hideBorder>
            <CustomSelect
                label="Business Type"
                options={["Proprietorship", "LLP/Partnership", "Private Limited"]}
                value={item.type}
                onChange={(e) => handleChange(index, "type", e)} />
            <CustomTextBox
                value={item.companyName}
                onChange={(e) => handleChange(index, "companyName", e)}
                label="Company Name"
                type="text" />
            <CustomTextBox
                value={item.address}
                onChange={(e) => handleChange(index, "address", e)}
                label="Address"
                type="text" />
            {
                item.type == "Private Limited" &&
                <CustomSelect
                    label="Nature of Holding"
                    options={["Holding Percentage", "No of Securities"]}
                    value={item.natureOfHolding}
                    onChange={(e) => handleChange(index, "natureOfHolding", e)} />
            }

            <CustomTextBox
                value={item.holdingPercentage}
                onChange={(e) => handleChange(index, "holdingPercentage", e)}
                label={item.natureOfHolding == "No of Securities" ? "Number of Securities" : "Holding Percentage"}
                type="text" />
            {
                item.type == "LLP/Partnership" &&
                <CustomTextBox
                    value={item.partnership}
                    onChange={(e) => handleChange(index, "partnership", e)}
                    label="Partnership"
                    type="text" />
            }

            {
                item.type == "Private Limited" &&
                <CustomSelect
                    label="Type of Security"
                    options={["Equity Shares", "Percentage Shares", "Debentures"]}
                    value={item.natureOfHolding}
                    onChange={(e) => handleChange(index, "typeOfSecurity", e)} />
            }
            <CustomTextBox
                value={item.pan}
                onChange={(e) => handleChange(index, "pan", e)}
                label="PAN"
                type="text" />
        </CustomFormContainer>
    )
}

export default BusinessForm