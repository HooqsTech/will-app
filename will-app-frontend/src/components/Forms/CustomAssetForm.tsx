import { useRecoilState } from "recoil";
import { customAssetsState, ICustomAssetState } from "../../atoms/CustomAssets";
import CustomFormContainer from "../CustomFormContainer";
import CustomTextBox from "../CustomTextBox";
import { customAssetsValidationState, ICustomAssetValidationState } from "../../atoms/validationStates/CustomAssetsValidationState";

interface ICustomAssetFormProps {
    index: number
}

const CustomAssetForm: React.FC<ICustomAssetFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<ICustomAssetState[]>(customAssetsState);
    const item = formState[index];
    const [validationState, setValidationState] = useRecoilState<ICustomAssetValidationState[]>(customAssetsValidationState);
    const validationStateItem = validationState[index];
    
    const handleChange = (index: number, key: keyof ICustomAssetState, value: string) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );

        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: "" } : item))
        );
    };

    return (
        <CustomFormContainer hideBorder>
            <CustomTextBox
                helperText={validationStateItem.description}
                value={item.description}
                onChange={(e) => handleChange(index, "description", e)}
                label="Description"
                type="text" />
        </CustomFormContainer>
    )
}

export default CustomAssetForm