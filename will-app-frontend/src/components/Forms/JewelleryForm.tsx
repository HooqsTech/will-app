import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import CustomSelect from "../CustomSelect";
import { IJewelleryState, jewelleriesState } from "../../atoms/JewelleriesState";
import { IJewelleriesValidationState, jewelleriesValidationState } from "../../atoms/validationStates/JewelleriesValidationState";

interface IJewelleryFormProps {
    index: number
}

const JewelleryForm: React.FC<IJewelleryFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IJewelleryState[]>(jewelleriesState);
    const [validationState, setValidationState] = useRecoilState<IJewelleriesValidationState[]>(jewelleriesValidationState);
    
    const item = formState[index];
    const validationStateItem = validationState[index];
    
    const handleChange = (index: number, key: keyof IJewelleryState, value: string) => {
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
                helperText={validationStateItem.type}
                required
                label="Jewellery Type"
                options={["Gold", "Silver", "Others"]}
                value={item.type}
                onChange={(e) => handleChange(index, "type", e)} />
            <CustomTextBox
                value={item.description}
                helperText={validationStateItem.description}
                required
                onChange={(e) => handleChange(index, "description", e)}
                label="Description"
                type="text" />
            <CustomTextBox
                value={item.preciousMetalInWeight}
                helperText={validationStateItem.preciousMetalInWeight}
                required
                onChange={(e) => handleChange(index, "preciousMetalInWeight", e)}
                label="Precious Metal Weight in Grams"
                type="text" />
        </CustomFormContainer>
    )
}

export default JewelleryForm