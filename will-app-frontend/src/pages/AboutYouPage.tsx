import { useRecoilValue } from 'recoil'
import { personalDetailsState } from '../atoms/PersonalDetailsState'
import React from 'react';
import dayjs from 'dayjs';
import { addressDetailsState } from '../atoms/AddressDetailsState';
import CustomButton from '../components/CustomButton';

interface IItemProps {
    label: string,
    text: string
}

const AboutYouPage = () => {
    const personalDetails = useRecoilValue(personalDetailsState);
    const addressDetails = useRecoilValue(addressDetailsState);

    const Item: React.FC<IItemProps> = ({ label, text }) => {
        return (
            <div className='grid grid-cols-8 items-center w-full justify-between'>
                <p className='text-lg col-span-4'>{label}</p>
                <div className='flex items-center col-span-4 justify-start gap-14'>
                    <p>:</p>
                    <p className='text-gray-700'>{text}</p>
                </div>
            </div>
        )
    }

    const AddressItem: React.FC = () => {
        return (
            <div className='grid grid-cols-8 items-start w-full justify-start'>
                <p className='text-lg col-span-4'>Address</p>
                <div className='flex items-start col-span-4 justify-start gap-14'>
                    <p>:</p>
                    <div className='text-gray-700 w-full text-wrap'>
                        <p>{addressDetails.address1}</p>
                        <p>{addressDetails.address2}</p>
                        <p>{addressDetails.city}</p>
                        <p>{addressDetails.state}</p>
                        <p>{addressDetails.phoneNumber}</p>
                        <p className='text-ellipsis'>{addressDetails.email}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='flex flex-col items-start h-full'>
            <div className='w-full rounded-lg bg-white max-w-fit shadow-md border-l-[20px] p-4 border-[#358477] shadow-gray-400 justify-center flex flex-col'>
                <div className='flex justify-end'>
                    <CustomButton label={"edit"} onClick={() => { }} />
                </div>
                <div className='flex w-full flex-col items-center justify-between p-6 text-md space-y-2 text-wrap'>
                    <Item label={"Full Name"} text={personalDetails.fullName} />
                    <Item label={"Father Name"} text={personalDetails.fatherName} />
                    <Item label={"Gender"} text={personalDetails.gender} />
                    <Item label={"DOB"} text={personalDetails.dob == null ? "" : dayjs(personalDetails.dob).format("DD-MM-YYYY")} />
                    <Item label={"Religion"} text={personalDetails.religion} />
                    <Item label={"Aadhaar Number"} text={personalDetails.aadhaarNumber} />
                    <AddressItem />
                </div>
            </div>
        </div>
    )
}

export default AboutYouPage