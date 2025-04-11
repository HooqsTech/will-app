export interface BeneficiaryData {
    email: string;
    phone: string;
    gender: "Male" | "Female" | "Other";
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

export interface ParsedBeneficiaries {
    beneficiaryDetails: IBeneficiary[];
    charityBeneficiaries: IBeneficiary[];
}

export function parseBeneficiaries(beneficiariesData: any[]): ParsedBeneficiaries {
    const beneficiaryDetails: IBeneficiary[] = [];
    const charityBeneficiaries: IBeneficiary[] = [];

    beneficiariesData.forEach((beneficiary: any) => {
        const parsed: IBeneficiary = {
            id: beneficiary.id || "",
            type: beneficiary.type,
            data: {
                email: beneficiary.data?.email || "",
                phone: beneficiary.data?.phone || "",
                gender: beneficiary.data?.gender || "Other",
                fullName: beneficiary.data?.fullName || "",
                charityType: beneficiary.data?.charityType || "",
                dateOfBirth: beneficiary.data?.dateOfBirth || "",
                organization: beneficiary.data?.organization || "",
                relationship: beneficiary.data?.relationship || "",
                donationAmount: beneficiary.data?.donationAmount ?? null,
                otherOrganization: beneficiary.data?.otherOrganization || "",
            }
        };

        if (parsed.data.donationAmount !== null && parsed.data.donationAmount !== 0) {
            charityBeneficiaries.push(parsed);
        } else {
            beneficiaryDetails.push(parsed);
        }
    });

    return {
        beneficiaryDetails,
        charityBeneficiaries
    };
}
