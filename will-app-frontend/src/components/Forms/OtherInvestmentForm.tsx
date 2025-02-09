import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import CustomSelect from "../CustomSelect";
import { IOtherInvestmentState, otherInvestementState } from "../../atoms/OtherInvestmentsState";

interface IOtherInvestmentFormProps {
    index: number
}

const OtherInvestmentForm: React.FC<IOtherInvestmentFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IOtherInvestmentState[]>(otherInvestementState);
    const item = formState[index];

    const handleChange = (index: number, key: keyof IOtherInvestmentState, value: string) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    return (
        <CustomFormContainer formLabel="Other Investment">
            <CustomSelect
                label="Other Investment Type"
                options={["Single", "Joint"]}
                value={item.type}
                onChange={(e) => handleChange(index, "type", e)} />
            <CustomTextBox
                value={item.financialServiceProviderName}
                onChange={(e) => handleChange(index, "financialServiceProviderName", e)}
                label="Bank / Financial Service Provider Name"
                type="text" />
            <CustomTextBox
                value={item.certificateNumber}
                onChange={(e) => handleChange(index, "certificateNumber", e)}
                label="Certificate / Folio Number"
                type="text" />
        </CustomFormContainer>
    )
}

export default OtherInvestmentForm