import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import { IVehicleState, vehiclesState } from "../../atoms/VehiclesState";

interface IVehicleFormProps {
    index: number
}

const VehicleForm: React.FC<IVehicleFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IVehicleState[]>(vehiclesState);
    const item = formState[index];

    const handleChange = (index: number, key: keyof IVehicleState, value: string) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    return (
        <CustomFormContainer hideBorder>
            <div>
                <CustomTextBox
                    value={item.brandOrModel}
                    onChange={(e) => handleChange(index, "brandOrModel", e)}
                    label="Brand / Model"
                    type="text" />
                <CustomTextBox
                    value={item.registrationNumber}
                    onChange={(e) => handleChange(index, "registrationNumber", e)}
                    label="Registration Number"
                    type="text" />
            </div>
        </CustomFormContainer>
    )
}

export default VehicleForm