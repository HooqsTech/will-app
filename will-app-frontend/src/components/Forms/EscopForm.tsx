import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import { escopsState, IEscopState } from "../../atoms/EscopsState";

interface IEscopFormProps {
    index: number
}

const EscopForm: React.FC<IEscopFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<IEscopState[]>(escopsState);
    const item = formState[index];

    const handleChange = (index: number, key: keyof IEscopState, value: string) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    return (
        <CustomFormContainer hideBorder>
            <CustomTextBox
                value={item.companyName}
                onChange={(e) => handleChange(index, "companyName", e)}
                label="Company Name"
                type="text" />
            <CustomTextBox
                value={item.noOfUnitGraged}
                onChange={(e) => handleChange(index, "noOfUnitGraged", e)}
                label="Number of Unit Graged"
                type="text" />
            <CustomTextBox
                value={item.noOfVestedEscops}
                onChange={(e) => handleChange(index, "noOfVestedEscops", e)}
                label="Number of Vested ESCOPs"
                type="text" />
            <CustomTextBox
                value={item.noOfUnVestedEscops}
                onChange={(e) => handleChange(index, "noOfUnVestedEscops", e)}
                label="Number of UnVested ESCOPs"
                type="text" />
        </CustomFormContainer>
    )
}

export default EscopForm