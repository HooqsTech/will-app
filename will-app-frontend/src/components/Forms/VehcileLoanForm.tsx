import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import { IVehicleLoanState, vehicleLoansState } from "../../atoms/VehicleLoansState";
import { IVehicleLoanValidationState, vehicleLoanValdationState } from "../../atoms/validationStates/VehicleLoanValidationState";

interface IVehicleLoanFormProps {
    index: number
}

const VehicleLoanForm: React.FC<IVehicleLoanFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IVehicleLoanState[]>(vehicleLoansState);
    const item = formState[index];
    const [validationState, setValidationState] = useRecoilState<IVehicleLoanValidationState[]>(vehicleLoanValdationState);
    const validationStateItem = validationState[index];
    

    const handleChange = (index: number, key: keyof IVehicleLoanState, value: string) => {
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
                value={item.nameOfBank}
                onChange={(e) => handleChange(index, "nameOfBank", e)}
                label="Name of Bank / Institution"
                helperText={validationStateItem.nameOfBank}
                type="text" />
            <CustomTextBox
                value={item.loanAmount}
                onChange={(e) => handleChange(index, "loanAmount", e)}
                label="Loan Amount"
                helperText={validationStateItem.loanAmount}
                type="number" />
            <CustomTextBox
                value={item.accountNumber}
                onChange={(e) => handleChange(index, "accountNumber", e)}
                label="Account Number"
                helperText={validationStateItem.accountNumber}
                type="text" />
        </CustomFormContainer>
    )
}

export default VehicleLoanForm