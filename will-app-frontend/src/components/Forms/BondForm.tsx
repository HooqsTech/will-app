import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import CustomSelect from "../CustomSelect";
import { bondsState, IBondState } from "../../atoms/BondsState";
import { IBondValidationState, bondsValidationState } from "../../atoms/validationStates/BondDetailsValidationState";

interface IBondFormProps {
    index: number
}

const BondForm: React.FC<IBondFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IBondState[]>(bondsState);
    const [validationState, setValidationState] = useRecoilState<IBondValidationState[]>(bondsValidationState);
    const item = formState[index];
    const validationStateItem = validationState[index];

    const handleChange = (index: number, key: keyof IBondState, value: string) => {
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
                label="Bond Type"
                helperText={validationStateItem.type}
                required
                options={["Single", "Joint"]}
                value={item.type}
                onChange={(e) => handleChange(index, "type", e)} />
            <CustomTextBox
                value={item.financialServiceProviderName}
                required
                helperText={validationStateItem.financialServiceProviderName}
                onChange={(e) => handleChange(index, "financialServiceProviderName", e)}
                label="Bank / Financial Service Provider Name"
                type="text" />
            <CustomTextBox
                value={item.certificateNumber}
                required
                helperText={validationStateItem.certificateNumber}
                onChange={(e) => handleChange(index, "certificateNumber", e)}
                label="Certificate / Folio Number"
                type="text" />
        </CustomFormContainer>
    )
}

export default BondForm