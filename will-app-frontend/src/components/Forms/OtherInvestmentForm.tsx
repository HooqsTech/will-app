import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import CustomSelect from "../CustomSelect";
import { IOtherInvestmentState, otherInvestmentState } from "../../atoms/OtherInvestmentsState";
import { IOtherInvestmentValidationState, otherInvestmentValidationState } from "../../atoms/validationStates/OtherInvestmentValidationState";

interface IOtherInvestmentFormProps {
    index: number
}

const OtherInvestmentForm: React.FC<IOtherInvestmentFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IOtherInvestmentState[]>(otherInvestmentState);
    const [validationState, setValidationState] = useRecoilState<IOtherInvestmentValidationState[]>(otherInvestmentValidationState);
                
        const item = formState[index];
        const validationStateItem = validationState[index];
    

    const handleChange = (index: number, key: keyof IOtherInvestmentState, value: string) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: "" } : item))
        );
    };

    return (
        <CustomFormContainer hideBorder>
            <CustomSelect
                label="Other Investment Type"
                options={["Single", "Joint"]}
                value={item.type}
                helperText={validationStateItem.type}
                onChange={(e) => handleChange(index, "type", e)} />
            <CustomTextBox
                value={item.financialServiceProviderName}
                onChange={(e) => handleChange(index, "financialServiceProviderName", e)}
                label="Bank / Financial Service Provider Name"
                helperText={validationStateItem.financialServiceProviderName}
                type="text" />
            <CustomTextBox
                value={item.certificateNumber}
                onChange={(e) => handleChange(index, "certificateNumber", e)}
                label="Certificate / Folio Number"
                helperText={validationStateItem.certificateNumber}
                type="text" />
        </CustomFormContainer>
    )
}

export default OtherInvestmentForm