import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';

const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
  {
    id: 'aboutYou',
    label: 'About You',
  },
  {
    id: 'Asset&liabilities',
    label: 'Asset & Liabilities',
    children: [
      { id: 'Asset', label: 'Asset', 
        children : [
            {id: 'Properties', label: 'Properties'},
            {id: 'BankAccounts', label: 'Bank Accounts'},
            {id: 'providentfunds', label: 'Provident Funds'},
            {id: 'Bonds', label: 'Bonds'},
            {id: 'Debentures', label: 'Debentures'},
            {id: 'Vehicles', label: 'Vehicles'}
      ] },
      { id: 'Liabilities', label: 'Liabilities',
        children: [
            {id: 'Homeloans', label: 'Home Loans'},
            {id: 'Personalloans', label: 'Personal Loans'},
            {id: 'Vehicleloans', label: 'vehicle Loans'},
            {id: 'Educationloans', label: 'Education Loans'},
            {id: 'Otherliabilities', label:'Other Liabilities'}
        ]
       },
    ],
  },
  {
    id: 'Beneficiaries&pets',
    label: 'Beneficiaries & Pets',
    children: [
        { id: 'Beneficiaries', label: 'Beneficiaries' },
        { id: 'Pets', label: 'Pets' }
    ],
  },
  {
    id: 'assetdistribution',
    label: 'Asset Distribution'
  },
  {
    id: 'Guardians',
    label: 'Guardians'
  },
  {
    id: 'excludedpersons',
    label: 'Excluded Persons'
  }
];

export default function Sidebar() {
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

  const handleSelectedItemsChange = (event: React.SyntheticEvent, ids: string[]) => {
    setSelectedItems(ids);
  };

  return (
    <Stack spacing={2}>
      <Box sx={{ minHeight: 352, minWidth: 250 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          selectedItems={selectedItems}
          onSelectedItemsChange={handleSelectedItemsChange}
          multiSelect
        />
      </Box>
    </Stack>
  );
}
