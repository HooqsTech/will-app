
import { useRecoilState, useRecoilValue } from 'recoil';
import CustomAccordion from '../components/CustomAccordion';
import { useState } from 'react';
import { IMutualFundState, mutualFundsState } from '../atoms/MutualFundsState';
import MutualFundForm from '../components/Forms/MutualFundForm';
import AddButton from '../components/AddButton';
import BackButton from '../components/BackButton';
import NextButton from '../components/NextButton';
import { useNavigate } from 'react-router';
import { routesState } from '../atoms/RouteState';
import { upsertAsset } from '../api/asset';
import { ASSET_SUBTYPES, ASSET_TYPES } from '../constants';
import { IAsset } from '../models/asset';
import { userState } from '../atoms/UserDetailsState';

const MutualFundsPage = () => {
    const [formState, setFormState] = useRecoilState<IMutualFundState[]>(mutualFundsState);
    const [currentItem, setCurrentItem] = useState<number>(0);
    const routeState = useRecoilValue(routesState);
    const user = useRecoilValue(userState);
    const navigate = useNavigate();

    const addMutualFund = () => {
        setFormState((prevState) => [
            ...prevState,
            {
                noOfHolders: "",
                fundName: "",
            },
        ]);
        setCurrentItem(formState.length)
    };

    const handleBackClick = async () => {
        // NAVIGATE TO PREVIOUS ROUTE
        var routeValue = routeState.find(s => s.nextPath == location.pathname);
        navigate(routeValue?.currentPath ?? "/");
    }

    const saveMutualFundAsync = async (property: IMutualFundState) => {
        var data: IAsset = {
            id: "",
            type: ASSET_TYPES.FINANCIAL_ASSETS,
            subtype: ASSET_SUBTYPES.MUTUAL_FUNDS,
            userId: user.userId,
            data: property
        }
        await upsertAsset(data);
    }

    const handleNextClick = async () => {
        // SAVE PROPERTIES
        formState.forEach(async (property) => {
            await saveMutualFundAsync(property);
        })

        // NAVIGATE TO NEXT ROUTE
        var routeValue = routeState.find(s => s.currentPath == location.pathname);
        navigate(routeValue?.nextPath ?? "/");
    }

    const getSubTitle = (index: number) => {
        return ""
    }

    return (
        <div className='flex flex-col justify-start h-full space-y-3 w-xl m-auto'>
            <div>
                {
                    formState.map((_, index) => (
                        <CustomAccordion expanded={currentItem === index}
                            onChange={() => setCurrentItem((prevItem) => prevItem === index ? -1 : index)}
                            label={`Mutual Fund ${index + 1}`}
                            subTitle={
                                currentItem !== index ? getSubTitle(index) : ""
                            }
                            children={
                                <MutualFundForm index={index} />
                            }
                        />
                    ))
                }
                <AddButton onClick={addMutualFund} label={`Mutual Fund ${formState.length + 1}`} />
            </div>
            <div className='justify-between flex mt-10'>
                <BackButton label='Back' onClick={handleBackClick} />
                <NextButton label='Next' onClick={handleNextClick} />
            </div>
        </div>
    )

}

export default MutualFundsPage;   