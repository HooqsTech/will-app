import { useRecoilState } from "recoil";
import { IPetState, petsState } from "../../atoms/petsState";
import { IPetValidationState, petsValidationState } from "../../atoms/validationStates/PetsValidationState";
import CustomFormContainer from "../CustomFormContainer";
import CustomTextBox from "../CustomTextBox";

interface IPetFormProps {
    index: number
}

const PetForm: React.FC<IPetFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IPetState[]>(petsState);
    const [validationState, setValidationState] = useRecoilState<IPetValidationState[]>(petsValidationState);

    const item = formState[index];
    const validationStateItem = validationState[index];

    const handleChange = (index: number, key: keyof IPetState, value: string) => {
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
                value={item.petName}
                helperText={validationStateItem.petName}
                required
                maxLength={50}
                onChange={(e) => handleChange(index, "petName", e)}
                label="Pet Name"
                type="text" />
            <CustomTextBox
                value={item.animalBreed}
                helperText={validationStateItem.animalBreed}
                required
                maxLength={100}
                onChange={(e) => handleChange(index, "animalBreed", e)}
                label="Animal / Breed"
                type="text" />
            <CustomTextBox
                value={item.amount}
                helperText={validationStateItem.amount}
                required
                restrictAlphabets
                maxLength={7}
                onChange={(e) => handleChange(index, "amount", e)}
                label="Amount to be left for their care"
                type="text" />
        </CustomFormContainer>
    )
}

export default PetForm