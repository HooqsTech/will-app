import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import { IVehicleLoanState, vehicleLoansState } from "../../atoms/VehicleLoansState";

interface IVehicleLoanFormProps {
    index: number
}

const VehicleLoanForm: React.FC<IVehicleLoanFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IVehicleLoanState[]>(vehicleLoansState);
    const item = formState[index];

    const handleChange = (index: number, key: keyof IVehicleLoanState, value: string) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    return (
        <CustomFormContainer hideBorder>
            <CustomTextBox
                value={item.nameOfBank}
                onChange={(e) => handleChange(index, "nameOfBank", e)}
                label="Name of Bank / Institution"
                type="text" />
            <CustomTextBox
                value={item.loanAmount}
                onChange={(e) => handleChange(index, "loanAmount", e)}
                label="Loan Amount"
                type="number" />
            <CustomTextBox
                value={item.accountNumber}
                onChange={(e) => handleChange(index, "accountNumber", e)}
                label="Account Number"
                type="text" />
        </CustomFormContainer>
    )
}

export default VehicleLoanForm