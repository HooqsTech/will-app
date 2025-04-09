import { useRecoilState } from "recoil";
import { artWorksState, IArtWorkState } from "../../atoms/ArtWorksState";
import { artWorksValidationState, IArtWorkValidationState } from "../../atoms/validationStates/ArtWorksValidationState";
import CustomFormContainer from "../CustomFormContainer";
import CustomTextBox from "../CustomTextBox";

interface IArtWorkFormProps {
    index: number
}

const ArtWorkForm: React.FC<IArtWorkFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IArtWorkState[]>(artWorksState);
    const [validationState, setValidationState] = useRecoilState<IArtWorkValidationState[]>(artWorksValidationState);
    const item = formState[index];
    const validationStateItem = validationState[index];

    const handleChange = (index: number, key: keyof IArtWorkState, value: string) => {
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
                value={item.name}
                required
                helperText={validationStateItem.name}
                onChange={(e) => handleChange(index, "name", e)}
                label="Name"
                type="text" />
            <CustomTextBox
                value={item.description}
                multiline
                required
                helperText={validationStateItem.description}
                onChange={(e) => handleChange(index, "description", e)}
                label="Description"
                type="text" />
        </CustomFormContainer>
    )
}

export default ArtWorkForm