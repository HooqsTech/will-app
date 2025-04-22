export interface BeneficiaryData {
    title: "Mr" | "Mrs" | "Miss" | "";
    type: "Person" | "Charity";
    email: string;
    phone: string;
    gender: "Male" | "Female" | "Other";
    firstName: string;
    lastName: string;
    fullName: string;
    charityType: string;
    dateOfBirth: string;
    organization: string;
    relationship: string;
    donationAmount: number | null;
    otherOrganization: string;
}

export interface IBeneficiary {
    id: string;
    type: string;
    data: BeneficiaryData;
}

export function parseBeneficiaries(beneficiariesData: any[]): IBeneficiary[] {
    const beneficiaryDetails: IBeneficiary[] = [];

    beneficiariesData.forEach((beneficiary: any) => {
        const parsed: IBeneficiary = {
            id: beneficiary.id || "",
            type: beneficiary.type,
            data: {
                title: beneficiary.data?.title || "",
                email: beneficiary.data?.email || "",
                type: beneficiary.data?.type || "Person",
                phone: beneficiary.data?.phone || "",
                gender: beneficiary.data?.gender || "Other",
                firstName: beneficiary.data?.firstName || "",
                lastName: beneficiary.data?.lastName || "",
                fullName: beneficiary.data?.title + ". " + beneficiary.data?.firstName + " " + beneficiary.data?.lastName || "",
                charityType: beneficiary.data?.charityType || "",
                dateOfBirth: beneficiary.data?.dateOfBirth || "",
                organization: beneficiary.data?.organization || "",
                relationship: beneficiary.data?.relationship || "",
                donationAmount: beneficiary.data?.donationAmount ?? null,
                otherOrganization: beneficiary.data?.otherOrganization || "",
            }
        };
            beneficiaryDetails.push(parsed);
    });

    return  beneficiaryDetails;
    
}
