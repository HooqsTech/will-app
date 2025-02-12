export interface PersonalDetails {
    full_name: string | null;
    father_name: string | null;
    gender: string | null;
    dob: string | null;
    religion: string | null;
    aadhaar_number: string | null;
    username: string | null;
    phone_number: string | null;
  }
  
  export  interface AddressDetails {
    city: string | null;
    email: string | null;
    state: string | null;
    address: string | null;
    pincode: string | null;
    address_1: string | null;
    address_2: string | null;
    phone_number: string | null;
  }
  
  export interface AssetDetails {
    immovable_assets: ImmovableAsset[][] | null;
    financial_assets: FinancialAssets | null;
    business_assets: BusinessAssets | null;
    other_investments: OtherInvestments | null;
  }
  
  export interface FinancialAssets {
    bank_accounts: BankAccount[] | null;
    fixed_deposits: FixedDeposit[] | null;
    insurance_policies: InsurancePolicy[] | null;
    safe_deposit_boxes: SafeDepositBox[] | null;
    demat_accounts: DematAccount[] | null;
    mutual_funds: MutualFund[] | null;
    provident_fund: ProvidentFund[] | null;
    pension_accounts: PensionAccount[] | null;
  }
  
  export interface BusinessAssets {
    business: Business[] | null;
    bonds: Bond[] | null;
    debentures: Debenture[] | null;
    esops: ESOP[] | null;
  }
  
  export interface OtherInvestments {
    vehicles: Vehicle[] | null;
    jewelry: Jewelry[] | null;
    digital_assets: DigitalAsset[] | null;
    intellectual_property: IntellectualProperty[] | null;
    custom_assets: CustomAsset[] | null;
  }
  
  export interface ImmovableAsset {
    id: number | null;
    city: string | null;
    address: string | null;
    pincode: string | null;
    property_type: string | null;
    ownership_type: string | null;
  }
  
  export interface BankAccount {
    id: number | null;
    city: string | null;
    branch: string | null;
    bank_name: string | null;
    account_type: string | null;
    account_number: string | null;
  }
  
  export interface FixedDeposit {
    id: number | null;
    city: string | null;
    branch: string | null;
    bank_name: string | null;
    account_number: string | null;
    number_of_holders: number | null;
  }
  
  export interface InsurancePolicy {
    id: number | null;
    type: string | null;
    policy_number: string | null;
    insurance_provider: string | null;
  }
  
  export interface SafeDepositBox {
    id: number | null;
    city: string | null;
    type: string | null;
    branch: string | null;
    bank_name: string | null;
  }
  
  export interface DematAccount {
    id: number | null;
    broker_name: string | null;
    account_number: string | null;
  }
  
  export interface MutualFund {
    id: number | null;
    fund_name: string | null;
    number_of_holders: number | null;
  }
  
  export interface ProvidentFund {
    id: number | null;
    city: string | null;
    type: string | null;
    branch: string | null;
    bank_name: string | null;
  }
  
  export interface PensionAccount {
    id: number | null;
    bank_name: string | null;
    pension_scheme_name: string | null;
  }
  
  export interface Business {
    id: number | null;
    type: string | null;
    address: string | null;
    company_name: string | null;
  }
  
  export interface Bond {
    id: number | null;
    ownership_type: string | null;
    financial_provider: string | null;
    certificate_folio_number: string | null;
  }
  
  export interface Debenture {
    id: number | null;
    type: string | null;
    financial_provider: string | null;
    certificate_folio_number: string | null;
  }
  
  export interface ESOP {
    id: number | null;
    company_name: string | null;
    vested_esops: number | null;
    units_granted: number | null;
    unvested_esops: number | null;
  }
  
  export  interface Vehicle {
    id: number | null;
    brand_model: string | null;
    registration_number: string | null;
  }
  
  export interface Jewelry {
    id: number | null;
    type: string | null;
    description: string | null;
    weight_in_grams: number | null;
  }
  
  export interface DigitalAsset {
    id: number | null;
    type: string | null;
    wallet_address: string | null;
  }
  
  export interface IntellectualProperty {
    id: number | null;
    type: string | null;
    description: string | null;
    identification_number: string | null;
  }
  
  export interface CustomAsset {
    id: number | null;
    description: string | null;
  }
  
  export interface Liabilities {
    home_loans: HomeLoan[][] | null;
    personal_loans: PersonalLoan[][] | null;
    vehicle_loans: VehicleLoan[][] | null;
    education_loans: EducationLoan[][] | null;
    other_liabilities: OtherLiability[][] | null;
  }
  
  export interface HomeLoan {
    id: number | null;
    bank_name: string | null;
    loan_amount: number | null;
    account_number: string | null;
  }
  
  export  interface PersonalLoan {
    id: number | null;
    bank_name: string | null;
    loan_amount: number | null;
    account_number: string | null;
  }
  
  export  interface VehicleLoan {
    id: number | null;
    bank_name: string | null;
    loan_amount: number | null;
    account_number: string | null;
  }
  
  export interface EducationLoan {
    id: number | null;
    bank_name: string | null;
    loan_amount: number | null;
  }
  
  export  interface OtherLiability {
    id: number | null;
    description: string | null;
    lender_name: string | null;
    loan_amount: number | null;
    account_number: string | null;
    remaining_amount: number | null;
  }
  
  export  interface Beneficiaries {
    married: string | null;
    children: Child[] | null;
    additional_beneficiaries: AdditionalBeneficiary[] | null;
  }
  
  export interface Child {
    id: number | null;
    dob: string | null;
    email: string | null;
    phone: string | null;
    gender: string | null;
    full_name: string | null;
  }
  
  export  interface AdditionalBeneficiary {
    id: number | null;
    full_name: string | null;
    relationship: string | null;
  }
  
  export  interface PetDetails {
    has_pets: boolean | null;
    pet_details: Pet[] | null;
  }
  
  export  interface Pet {
    id: number | null;
    guardian: Guardian | null;
    pet_name: string | null;
    animal_breed: string | null;
    amount_for_care: number | null;
  }
  
  export interface Guardian {
    id: number | null;
    dob: string | null;
    email: string | null;
    phone: string | null;
    gender: string | null;
    full_name: string | null;
    relationship_status: string | null;
  }
  
  export  interface ExcludedPerson {
    id: string | null;
    reason: string | null;
    full_name: string | null;
    relationship: string | null;
  }
  
  export interface JSONResponse {
    personal_details: PersonalDetails | null;
    address_details: AddressDetails | null;
    assets_details: AssetDetails | null;
    liabilities: Liabilities | null;
    beneficiaries: Beneficiaries | null;
    pets: PetDetails | null;
    excluded_persons: ExcludedPerson[] | null;
  }