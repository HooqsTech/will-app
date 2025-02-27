import * as React from 'react';
import clsx from 'clsx';
import { animated, useSpring } from '@react-spring/web';
import { styled, alpha } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ArticleIcon from '@mui/icons-material/Article';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FolderRounded from '@mui/icons-material/FolderRounded';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { useTreeItem2, UseTreeItem2Parameters } from '@mui/x-tree-view/useTreeItem2';
import {
  TreeItem2Checkbox,
  TreeItem2Content,
  TreeItem2IconContainer,
  TreeItem2Label,
  TreeItem2Root,
} from '@mui/x-tree-view/TreeItem2';
import { TreeItem2Icon } from '@mui/x-tree-view/TreeItem2Icon';
import { TreeItem2Provider } from '@mui/x-tree-view/TreeItem2Provider';
import { TreeItem2DragAndDropOverlay } from '@mui/x-tree-view/TreeItem2DragAndDropOverlay';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { useNavigate } from 'react-router';



type ExtendedTreeItemProps = {
  iconName?: string;
  id: string;
  label: string;
};


const NavItems: TreeViewBaseItem<ExtendedTreeItemProps>[] = [
  {
    id: 'about_you',
    label: 'About You',
    iconName: 'pdf',
    children: [
      { id: 'personal_details', label: 'Personal Details', iconName: 'pdf' },
      { id: 'address_details', label: 'Address Details', iconName: 'pdf' }
    ]
  },
  {
    id: 'assets',
    label: 'Asset',
    iconName: 'pdf',
    children: [
      {
        id: 'immovable_assets', label: 'Immovable Assets', iconName: 'pdf',
        children: [
          { id: 'properties', label: 'Properties', iconName: 'pdf' },
        ]
      },
      // { id: 'financial_assets', label: 'Financial Assets',  iconName: 'pdf',
      //     children: [
      //         {id: 'bank_accounts', label: 'Bank Accounts', iconName: 'pdf'},
      //         {id: 'fixed_deposits', label: 'Fixed Deposits', iconName: 'pdf'},
      //         {id: 'insurance_policies', label: 'insurance Policies', iconName: 'pdf'},
      //         {id: 'safe_deposit_boxes', label: 'Safe Deposit Boxes', iconName: 'pdf'},
      //         {id: 'demat_accounts', label:'Demat Accounts', iconName: 'pdf'},
      //         {id: 'mutual_funds', label: 'Mutual Funds', iconName: 'pdf'},
      //         {id: 'provident_fund', label: 'Provident Fund', iconName: 'pdf'},
      //         {id: 'pension_accounts', label:'Pension Accounts', iconName: 'pdf'}
      //     ]
      // },
      // { id: 'business_assets', label: 'Business Assets', iconName: 'pdf',
      //     children: [
      //         {id: 'business', label: 'Business', iconName: 'pdf'},
      //         {id: 'bonds', label: 'Bonds', iconName: 'pdf'},
      //         {id: 'debentures', label: 'Debentures', iconName: 'pdf'},
      //         {id: 'esops', label: 'Esops', iconName: 'pdf'}
      //     ]
      // },
      // { id: 'other_investments', label: 'Other Investments',  iconName: 'pdf',
      //     children: [
      //         {id: 'vehicles', label: 'vechicles', iconName: 'pdf'},
      //         {id: 'jewelry', label: 'Jewlery', iconName: 'pdf'},
      //         {id: 'digital_assets', label: 'Digital Assets', iconName: 'pdf'},
      //         {id: 'intellectual_property', label: 'Intellectual', iconName: 'pdf'},
      //         {id: 'custom_assets', label: 'Custom Assets', iconName: 'pdf'}
      //     ]
      // }
    ],
  },
  // {
  //     id: 'liabilities',
  //     label: 'Liabilities',
  //     iconName: '',
  //     children: [
  //         { id: 'home_loans', label: 'Home Loans', iconName: 'pdf' },
  //         { id: 'personal_loans', label: 'Personal Loans', iconName: 'pdf' },
  //         { id: 'vehicle_loans', label: 'Vechicle Loans', iconName: 'pdf' },
  //         { id: 'education_loans', label: 'Education Loans', iconName: 'pdf' },
  //         { id: 'other_liabilities', label: 'Other Liabilities', iconName: 'pdf' }
  //     ],
  // }
  {
    id: 'beneficiaries',
    label: 'Beneficiaries',
    iconName: 'pdf'
  },
];

declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string;
    '--tree-view-bg-color'?: string;
  }
}

const StyledTreeItemRoot = styled(TreeItem2Root)(({ theme }) => ({
  color: theme.palette.grey[400],
  position: 'relative',
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: theme.spacing(6.5),
  },
  ...theme.applyStyles('light', {
    color: theme.palette.grey[800],
  }),
})) as unknown as typeof TreeItem2Root;


const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
  flexDirection: 'row-reverse',
  borderRadius: theme.spacing(0.7),
  marginBottom: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
  padding: theme.spacing(0.5),
  paddingRight: theme.spacing(1),
  fontWeight: 500,
  color: "white",
  [`&.Mui-expanded `]: {
    '&:not(.Mui-focused, .Mui-selected, .Mui-selected.Mui-focused) .labelIcon': {
      color: 'white',
    },
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      left: '16px',
      top: '44px',
      height: 'calc(100% - 48px)',
      width: '1.5px',
      backgroundColor: 'white',
    },
  },
  '&:hover': {
    backgroundColor: "#358477",
    color: 'white',
  },
  [`&.Mui-focused, &.Mui-selected, &.Mui-selected, &.Mui-focused`]: {
    backgroundColor: "#358477",
    color: 'white',
  },
}));

const AnimatedCollapse = animated(Collapse);

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
    },
  });

  return <AnimatedCollapse style={{ ...style, marginLeft: '20px' }} {...props} />;
}

const StyledTreeItemLabelText = styled(Typography)({
  color: 'white',
  fontWeight: 500,
}) as unknown as typeof Typography;

interface CustomLabelProps {
  children: React.ReactNode;
  icon?: React.ElementType;
  expandable?: boolean;
}

function CustomLabel({
  icon: Icon,
  expandable,
  children,
  ...other
}: CustomLabelProps) {
  return (
    <TreeItem2Label
      {...other}
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {Icon && (
        <Box
          component={Icon}
          className="labelIcon"
          color="white"
          sx={{ mr: 1, fontSize: '1.2rem' }}
        />
      )}

      <StyledTreeItemLabelText variant="body2">{children}</StyledTreeItemLabelText>
      {expandable}
    </TreeItem2Label>
  );
}

const isExpandable = (reactChildren: React.ReactNode) => {
  if (Array.isArray(reactChildren)) {
    return reactChildren.length > 0 && reactChildren.some(isExpandable);
  }
  return Boolean(reactChildren);
};

const getIconFromFileType = (fileType: any) => {
  switch (fileType) {
    case 'image':
      return ImageIcon;
    case 'pdf':
      return PictureAsPdfIcon;
    case 'doc':
      return ArticleIcon;
    case 'video':
      return VideoCameraBackIcon;
    case 'folder':
      return FolderRounded;
    case 'pinned':
      return FolderOpenIcon;
    case 'trash':
      return DeleteIcon;
    default:
      return ArticleIcon;
  }
};

interface CustomTreeItemProps
  extends Omit<UseTreeItem2Parameters, 'rootRef'>,
  Omit<React.HTMLAttributes<HTMLLIElement>, 'onFocus'> { }

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: CustomTreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const { id, itemId, label, disabled, children, ...other } = props;

  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getGroupTransitionProps,
    getDragAndDropOverlayProps,
    status,
    publicAPI,
  } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });

  const item = publicAPI.getItem(itemId);
  const expandable = isExpandable(children);
  let icon;
  if (expandable) {
    icon = FolderRounded;
  } else if (item.iconName) {
    icon = getIconFromFileType(item.iconName);
  }

  return (
    <TreeItem2Provider itemId={itemId}>
      <StyledTreeItemRoot {...getRootProps(other)}>
        <CustomTreeItemContent
          {...getContentProps({
            className: clsx('content', {
              'Mui-expanded': status.expanded,
              'Mui-selected': status.selected,
              'Mui-focused': status.focused,
              'Mui-disabled': status.disabled,
            }),
          })}
        >
          <TreeItem2IconContainer {...getIconContainerProps()}>
            <TreeItem2Icon status={status} />
          </TreeItem2IconContainer>
          <TreeItem2Checkbox {...getCheckboxProps()} />
          <CustomLabel
            {...getLabelProps({ icon, expandable: expandable && status.expanded })}
          />
          <TreeItem2DragAndDropOverlay {...getDragAndDropOverlayProps()} />
        </CustomTreeItemContent>
        {children && <TransitionComponent {...getGroupTransitionProps()} />}
      </StyledTreeItemRoot>
    </TreeItem2Provider>
  );
});

export default function Sidebar2() {

  const navigate = useNavigate();
  const handleSelectedItemChange = (event: React.SyntheticEvent, itemId: string) => {
    navigate("/" + itemId);
  };

  return (
    <RichTreeView
      multiSelect={false}
      items={NavItems}
      slots={{ item: CustomTreeItem }}
      onItemClick={handleSelectedItemChange}
    />
  );
}
