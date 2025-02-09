import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import { IProvidentFundState, providentFundsState } from "../../atoms/ProvidentFundsState";
import CustomSelect from "../CustomSelect";

interface IFixedDepositFormProps {
    index: number
}

const ProvidentFundForm: React.FC<IFixedDepositFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IProvidentFundState[]>(providentFundsState);
    const item = formState[index];

    const handleChange = (index: number, key: keyof IProvidentFundState, value: string) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    return (
        <CustomFormContainer formLabel="Provident Fund">
            <CustomSelect
                label="Type"
                options={["EPF", "GPF", "PPF"]}
                value={item.type}
                onChange={(e) => handleChange(index, "type", e)} />
            <CustomTextBox
                value={item.bankName}
                onChange={(e) => handleChange(index, "bankName", e)}
                label="Bank Name"
                type="text" />
            <CustomTextBox
                value={item.branch}
                onChange={(e) => handleChange(index, "branch", e)}
                label="Branch"
                type="text" />
            <CustomTextBox
                value={item.city}
                onChange={(e) => handleChange(index, "city", e)}
                label="City"
                type="text" />
        </CustomFormContainer>
    )
}

export default ProvidentFundForm