import { IPropertiesState, propertiesState } from '../atoms/PropertiesState';
import { useRecoilState, useRecoilValue } from 'recoil';
import CustomAccordion from '../components/CustomAccordion';
import PropertiesForm from '../components/Forms/PropertiesForm';
import { useState } from 'react';
import AddButton from '../components/AddButton';
import BackButton from '../components/BackButton';
import NextButton from '../components/NextButton';
import { routesState } from '../atoms/RouteState';
import { useLocation, useNavigate } from 'react-router';
import { IAsset } from '../models/asset';
import { upsertAsset } from '../api/asset';
import { userState } from '../atoms/UserDetailsState';
import { ASSET_SUBTYPES, ASSET_TYPES } from '../constants';

const PropertiesPage = () => {
    const [formState, setFormState] = useRecoilState<IPropertiesState[]>(propertiesState);
    const [currentItem, setCurrentItem] = useState<number>(-1);
    const routeState = useRecoilValue(routesState);
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const location = useLocation();

    const savePropertyAsync = async (property: IPropertiesState, index: number) => {
        var data: IAsset = {
            id: property.id,
            type: ASSET_TYPES.IMMOVABLE_ASSETS,
            subtype: ASSET_SUBTYPES.PROPERTIES,
            userId: user.userId,
            data: property
        }
        var upsertedAsset = await upsertAsset(data);

        setFormState((prevItems) =>
            prevItems.map((item, i) => (i === index ? { ...upsertedAsset.data, id: upsertedAsset.id } : item))
        );
    }

    const handleBackClick = async () => {
        // NAVIGATE TO PREVIOUS ROUTE
        var routeValue = routeState.find(s => s.nextPath == location.pathname);
        navigate(routeValue?.currentPath ?? "/");
    }

    const handleNextClick = async () => {
        // SAVE PROPERTIES
        formState.forEach(async (property, index) => {
            await savePropertyAsync(property, index);
        })

        // NAVIGATE TO NEXT ROUTE
        var routeValue = routeState.find(s => s.currentPath == location.pathname);
        navigate(routeValue?.nextPath ?? "/");
    }

    const addProperty = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                id: "",
                propertyType: "",
                ownershipType: "",
                address: "",
                pincode: "",
                city: "",
            },
        ]);
        setCurrentItem(formState.length);
    };

    const getSubTitle = (index: number) => {
        const { address, pincode, city } = formState[index];
        const firstLine = address?.trim() || "";
        const secondLine = [city?.trim(), pincode?.trim()].filter(Boolean).join(" - ");
        return [firstLine, secondLine].filter(Boolean).join("\n");
    }

    return (
        <div className='flex flex-col justify-start h-full space-y-3 w-xl m-auto'>
            <div>
                {
                    formState.map((_, index) => (
                        <CustomAccordion key={index} expanded={currentItem === index}
                            onChange={() => setCurrentItem((prevItem) => prevItem === index ? -1 : index)}
                            label={`Property ${index + 1}`}
                            subTitle={
                                currentItem !== index ? getSubTitle(index) : ""
                            }
                            children={
                                <PropertiesForm index={index} />
                            }
                        />
                    ))
                }
                <AddButton onClick={addProperty} label={`Property ${formState.length + 1}`} />
            </div>
            <div className='justify-between flex mt-10'>
                <BackButton label='Back' onClick={handleBackClick} />
                <NextButton label='Next' onClick={handleNextClick} />
            </div>
        </div>
    )
}

export default PropertiesPage   