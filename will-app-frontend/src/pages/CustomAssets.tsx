import { useRecoilState, useRecoilValue } from 'recoil';
import CustomAccordion from '../components/CustomAccordion';
import CustomAssetForm from '../components/Forms/CustomAssetForm';
import { useState } from 'react';
import AddButton from '../components/AddButton';
import BackButton from '../components/BackButton';
import NextButton from '../components/NextButton';
import { useLocation, useNavigate } from 'react-router';
import { routesState } from '../atoms/RouteState';
import { customAssetsState, ICustomAssetState } from '../atoms/CustomAssets';
import { deleteAsset, upsertAsset } from '../api/asset';
import { userState } from '../atoms/UserDetailsState';
import { ASSET_SUBTYPES, ASSET_TYPES } from '../constants';
import DeleteIcon from '@mui/icons-material/Delete';
import { emptyCustomAssetValidationState, ICustomAssetValidationState, customAssetsValidationState } from '../atoms/validationStates/CustomAssetsValidationState';
import { IsEmptyString } from '../utils';

const CustomAssets = () => {
    const [formState, setFormState] = useRecoilState<ICustomAssetState[]>(customAssetsState);
    const [validationState, setValidationState] = useRecoilState<ICustomAssetValidationState[]>(customAssetsValidationState);
    const [currentItem, setCurrentItem] = useState<number>(-1);
    const routeState = useRecoilValue(routesState);
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const location = useLocation();
    const [showErrorBorder, setShowErrorBorder] = useState(false);

    const saveCustomAssetAsync = async (asset: ICustomAssetState, index: number) => {
        var data = {
            id: asset.id,
            type: ASSET_TYPES.OTHER_INVESTMENTS,
            subtype: ASSET_SUBTYPES.CUSTOM_ASSETS,
            userId: user.userId,
            data: asset,
        };

        var upsertedAsset = await upsertAsset(data);
        setFormState((prevItems) =>
            prevItems.map((item, i) => (i === index ? { ...upsertedAsset.data, id: upsertedAsset.id } : item))
        );
    };

    const deleteCustomAssetAsync = async (index: number) => {
        if (formState[index].id !== "" && formState[index].id !== undefined) {
            await deleteAsset(formState[index].id);
            setFormState((prevItems) => prevItems.filter(item => item.id !== formState[index].id));
        } else {
            setFormState((prevItems) => prevItems.filter((_, i) => i !== index));
        }
    };

    const handleBackClick = () => {
        var routeValue = routeState.find(s => s.nextPath === location.pathname);
        navigate(routeValue?.currentPath ?? "/");
    };

    const setCustomAssetValidationState = (index: number, key: keyof ICustomAssetValidationState, value: string) => {
        setValidationState((prevState) =>
            prevState.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        );
    };

    const validate = () => {
        var isValid = true;
        formState.forEach((asset, index) => {
            if (IsEmptyString(asset.description)) {
                setCustomAssetValidationState(index, "description", "Description is required");
                isValid = false;
            }
        });
        setShowErrorBorder(!isValid);
        return isValid;
    };

    const handleNextClick = async () => {
        if (!validate()) return;

        formState.forEach(async (asset, index) => {
            await saveCustomAssetAsync(asset, index);
        });

        var routeValue = routeState.find(s => s.currentPath === location.pathname);
        navigate(routeValue?.nextPath ?? "/");
    };

    const addCustomAsset = () => {
        setFormState((prevState) => [
            ...prevState,
            { id: "", description: "" },
        ]);
        setValidationState((prevState) => [
            ...prevState,
            emptyCustomAssetValidationState,
        ]);
        setCurrentItem(formState.length);
    };

    const getSubTitle = (index: number) => {
        return formState[index].description?.trim() || "";
    };

    const shouldExpandAccordion = (index: number) => {
        return currentItem === index;
    };

    const handleAccordionOnChange = (index: number) => {
        setCurrentItem((prevItem) => (prevItem === index ? -1 : index));
        setShowErrorBorder(false);
    };

    return (
        <div className='flex flex-col justify-start h-full space-y-3 w-xl m-auto'>
            <h1 className='text-2xl font-semibold'>Custom Assets</h1>
            <div>
                {formState.map((_, index) => (
                    <div key={formState[index].id} className='flex w-full justify-between items-center space-x-1 h-fit'>
                        <div className='w-full h-full'>
                            <CustomAccordion
                                key={index}
                                expanded={shouldExpandAccordion(index)}
                                error={showErrorBorder && Object.values(validationState[index]).some(s => s != undefined && s != null && s != "")}
                                onChange={() => handleAccordionOnChange(index)}
                                label={`Custom Asset ${index + 1}`}
                                subTitle={currentItem !== index && !shouldExpandAccordion(index) ? getSubTitle(index) : ""}
                            >
                                <CustomAssetForm index={index} />
                            </CustomAccordion>
                        </div>
                        {!shouldExpandAccordion(index) && (
                            <button onClick={() => deleteCustomAssetAsync(index)} className='p-2 h-full bg-will-green'>
                                <DeleteIcon fontSize="small" className='text-white bg-will-green' />
                            </button>
                        )}
                    </div>
                ))}
                <AddButton onClick={addCustomAsset} label={`Custom Asset ${formState.length + 1}`} />
            </div>
            <div className='justify-between flex mt-10'>
                <BackButton label='Back' onClick={handleBackClick} />
                <NextButton label='Next' onClick={handleNextClick} />
            </div>
        </div>
    );
};

export default CustomAssets;