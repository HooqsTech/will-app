import { useRecoilState } from "recoil";
import CustomFormContainer from "../CustomFormContainer"
import CustomTextBox from "../CustomTextBox"
import { customAssetsState, ICustomAssetState } from "../../atoms/CustomAssets";

interface ICustomAssetFormProps {
    index: number
}

const CustomAssetForm: React.FC<ICustomAssetFormProps> = ({ index }) => {
    const [formState, setFormState] = useRecoilState<ICustomAssetState[]>(customAssetsState);
    const item = formState[index];

    const handleChange = (index: number, key: keyof ICustomAssetState, value: string) => {
        setFormState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    return (
        <CustomFormContainer formLabel="Custom Asset">
            <div>
                <CustomTextBox
                    value={item.description}
                    onChange={(e) => handleChange(index, "description", e)}
                    label="Description"
                    type="text" />
            </div>
        </CustomFormContainer>
    )
}

export default CustomAssetForm