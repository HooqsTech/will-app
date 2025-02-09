import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { useNavigate } from "react-router";

const NavItems: TreeViewBaseItem[] = [
  {
    id: 'about_you',
    label: 'About You',
    children: [
        {id: 'personal_details', label: 'Personal Details'},
        {id: 'address_details', label: 'Address Details'}
    ]
  },
  {
    id: 'assets_details',
    label: 'Asset',
    children: [
        { id: 'immovable_assets', label: 'Immovable Assets' },
        { id: 'financial_assets', label: 'Financial Assets',
            children: [
            {id: 'bank_accounts', label: 'Bank Accounts'},
            {id: 'fixed_deposits', label: 'Fixed Deposits'},
            {id: 'insurance_policies', label: 'insurance Policies'},
            {id: 'safe_deposit_boxes', label: 'Safe Deposit Boxes'},
            {id: 'demat_accounts', label:'Demat Accounts'},
            {id: 'mutual_funds', label: 'Mutual Funds'},
            {id: 'provident_fund', label: 'Provident Fund'},
            {id: 'pension_accounts', label:'Pension Accounts'}
        ]
       },
       { id: 'business_assets', label: 'Business Assets',
            children: [
                {id: 'business', label: 'Business'},
                {id: 'bonds', label: 'Bonds'},
                {id: 'debentures', label: 'Debentures'},
                {id: 'esops', label: 'Esops'}
            ]
        },
        { id: 'other_investments', label: 'Other Investments',
            children: [
                {id: 'vehicles', label: 'vechicles'},
                {id: 'jewelry', label: 'Jewlery'},
                {id: 'digital_assets', label: 'Digital Assets'},
                {id: 'intellectual_property', label: 'Intellectual'},
                {id: 'custom_assets', label: 'Custom Assets'}
            ]
        }
    ],
  },
  {
    id: 'liabilities',
    label: 'Liabilities',
    children: [
        { id: 'home_loans', label: 'Home Loans' },
        { id: 'personal_loans', label: 'Personal Loans' },
        { id: 'vehicle_loans', label: 'Vechicle Loans' },
        { id: 'education_loans', label: 'Education Loans' },
        { id: 'other_liabilities', label: 'Other Liabilities' }
    ],
  }
];

export default function Sidebar() {
  
    let navigate = useNavigate();
    const handleSelectedItemChange = (event: React.SyntheticEvent, itemId: string) => {
        navigate("/"+itemId);
    };

    return (
        <Stack spacing={2}>
            <Box sx={{ minHeight: 352, minWidth: 250 }}>
                <RichTreeView items={NavItems} onItemClick={handleSelectedItemChange}/>
            </Box>
        </Stack>
    );
}
