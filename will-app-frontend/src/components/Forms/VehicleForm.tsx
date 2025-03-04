import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import { IVehicleState, vehiclesState } from "../../atoms/VehiclesState";
import { IVehicleValidationState, vehiclesValidationState } from "../../atoms/validationStates/VehicleValidationState";

interface IVehicleFormProps {
    index: number
}

const VehicleForm: React.FC<IVehicleFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IVehicleState[]>(vehiclesState);
    const item = formState[index];
    const [validationState, setValidationState] = useRecoilState<IVehicleValidationState[]>(vehiclesValidationState);
    const validationStateItem = validationState[index];

    const handleChange = (index: number, key: keyof IVehicleState, value: string) => {
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
                helperText={validationStateItem.brandOrModel}
                value={item.brandOrModel}
                onChange={(e) => handleChange(index, "brandOrModel", e)}
                label="Brand / Model"
                type="text" />
            <CustomTextBox
                helperText={validationStateItem.registrationNumber}
                value={item.registrationNumber}
                onChange={(e) => handleChange(index, "registrationNumber", e)}
                label="Registration Number"
                type="text" />
        </CustomFormContainer>
    )
}

export default VehicleForm