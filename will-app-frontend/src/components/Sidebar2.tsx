import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import { TransitionProps } from '@mui/material/transitions';
import { styled } from '@mui/system';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { treeItemClasses } from '@mui/x-tree-view/TreeItem';
import {
  TreeItem2Checkbox,
  TreeItem2Content,
  TreeItem2IconContainer,
  TreeItem2Label,
  TreeItem2Root,
} from '@mui/x-tree-view/TreeItem2';
import { TreeItem2DragAndDropOverlay } from '@mui/x-tree-view/TreeItem2DragAndDropOverlay';
import { TreeItem2Icon } from '@mui/x-tree-view/TreeItem2Icon';
import { TreeItem2Provider } from '@mui/x-tree-view/TreeItem2Provider';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { useTreeItem2, UseTreeItem2Parameters } from '@mui/x-tree-view/useTreeItem2';
import { animated, useSpring } from '@react-spring/web';
import clsx from 'clsx';
import * as React from 'react';
import { AiOutlineGold } from 'react-icons/ai';
import { BiLogoCreativeCommons } from 'react-icons/bi';
import { CiBank, CiBitcoin } from 'react-icons/ci';
import { FaRegAddressBook, FaRegAddressCard, FaRegUser } from 'react-icons/fa';
import { LiaMoneyBillWaveSolid, LiaUsersCogSolid, LiaHandHoldingUsdSolid } from 'react-icons/lia';
import { GiReceiveMoney, GiThreeFriends } from 'react-icons/gi';
import { IoBusinessOutline, IoDocumentTextOutline } from 'react-icons/io5';
import { IconType } from 'react-icons/lib';
import { MdOutlineAddHomeWork, MdOutlineHealthAndSafety, MdLockOutline, MdOutlineAccountBalance, MdOutlineDirectionsCar } from 'react-icons/md';
import { TbFriendsOff } from 'react-icons/tb';
import { PiHandWithdraw } from 'react-icons/pi';
import { SiAltiumdesigner } from 'react-icons/si';
import { useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';
import { removeCookie } from 'typescript-cookie';
import { routesState } from '../atoms/RouteState';
import { ASSET_TYPES, ROUTE_PATHS } from '../constants';
import { HiOutlineChartPie } from 'react-icons/hi2'
import { PiPiggyBank } from 'react-icons/pi'

type ExtendedTreeItemProps = {
  icon?: IconType;
  routePath: string;
  id: string;
  label: string;
};

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
  borderColor: "white",
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
    borderLeft: "4px solid white",
    borderRadius: 0,
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
  icon?: IconType;
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
          className="labelIcon pr-2"
          color="white"
          sx={{ fontSize: '1.7rem' }}
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
  let icon = item.icon
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

  const routeState = useRecoilValue(routesState);
  const [menuItems, seTmenuItems] = React.useState<TreeViewBaseItem<ExtendedTreeItemProps>[]>([]);
  const [navSelectedItem, setNavSelectedItem] = React.useState<string>(ROUTE_PATHS.ASSETS);
  const [expandedItems, setExpandedItems] = React.useState<string[]>(["assets"]);
  const handleSelectedItemChange = (_: React.SyntheticEvent, itemId: string) => {
    var item = apiRef.current?.getItem(itemId);
    setNavSelectedItem(itemId);
    navigate(ROUTE_PATHS.YOUR_WILL + (item.routePath ?? ""));
  };
  const handleExpandedItemsChange = (
    _: React.SyntheticEvent,
    itemIds: string[],
  ) => {
    setExpandedItems(itemIds);
    console.log(expandedItems);
  };

  const about_you = ['personal_details', 'address_details'];
  const immovable_assets = ['immovable_assets', 'properties'];
  const financial_assets = ['financial_assets', 'bank_accounts', 'fixed_deposits', 'insurance_policies', 'safe_deposit_boxes', 'demat_accounts', 'mutual_funds', 'provident_fund', 'pension_accounts'];
  const business_assets = ['business_assets', 'business', 'bonds', 'debentures', 'esops', 'other_investments'];
  const other_assets = ['other_assets', 'vehicles', 'jewelleries', 'digital_assets', 'intellectual_property', 'custom_assets'];
  const liabilities = ['liabilities', 'home_loans', 'personal_loans', 'vehicle_loans', 'education_loans', 'other_liabilities'];

  React.useEffect(() => {
    let nav = location.pathname.split('/').pop() ?? "";
    setNavSelectedItem(nav ?? "");

    if (about_you.includes(nav)) {
      setExpandedItems(['about_you']);
    }
    else if (immovable_assets.includes(nav)) {
      setExpandedItems(["immovable_assets", "assets"]);
    }
    else if (financial_assets.includes(nav)) {
      setExpandedItems(['financial_assets', 'assets']);
    }
    else if (business_assets.includes(nav)) {
      setExpandedItems(['business_assets', 'assets']);
    }
    else if (financial_assets.includes(nav)) {
      setExpandedItems(['financial_assets', 'assets']);
    }
    else if (other_assets.includes(nav)) {
      setExpandedItems(['other_assets', 'assets']);
    }
    else if (liabilities.includes(nav)) {
      setExpandedItems(['liabilities']);
    }

  }, [location.pathname]);

  React.useEffect(() => {

    const getIcons = (routePath: string) => {
      switch (routePath) {
        case ROUTE_PATHS.PROPERTIES:
          return MdOutlineAddHomeWork
        case ROUTE_PATHS.BANK_ACCOUNTS:
          return CiBank
        case ROUTE_PATHS.FIXED_DEPOSITS:
          return CiBank
        case ROUTE_PATHS.INSURANCE_POLICIES:
          return MdOutlineHealthAndSafety
        case ROUTE_PATHS.SAFE_DEPOSIT_BOXES:
          return MdLockOutline
        case ROUTE_PATHS.DEMAT_ACCOUNTS:
          return CiBank
        case ROUTE_PATHS.MUTUAL_FUNDS:
          return HiOutlineChartPie
        case ROUTE_PATHS.PROVIDENT_FUND:
          return PiPiggyBank
        case ROUTE_PATHS.PENSION_ACCOUNTS:
          return GiReceiveMoney
        case ROUTE_PATHS.BUSINESS_ASSETS:
          return IoBusinessOutline
        case ROUTE_PATHS.BUSINESS:
          return IoBusinessOutline
        case ROUTE_PATHS.BONDS:
          return IoDocumentTextOutline
        case ROUTE_PATHS.DEBENTURES:
          return IoBusinessOutline
        case ROUTE_PATHS.ESCOPS:
          return LiaUsersCogSolid
        case ROUTE_PATHS.OTHER_INVESTMENTS:
          return LiaHandHoldingUsdSolid
        case ROUTE_PATHS.OTHER_ASSETS:
          return MdOutlineDirectionsCar
        case ROUTE_PATHS.VEHICLES:
          return MdOutlineDirectionsCar
        case ROUTE_PATHS.JEWELLERIES:
          return AiOutlineGold
        case ROUTE_PATHS.DIGITAL_ASSETS:
          return CiBitcoin
        case ROUTE_PATHS.INTELLECTUAL_PROPERTY:
          return SiAltiumdesigner
        case ROUTE_PATHS.CUSTOM_ASSETS:
          return BiLogoCreativeCommons
        case ROUTE_PATHS.HOME_LOANS:
          return PiHandWithdraw
        case ROUTE_PATHS.PERSONAL_LOANS:
          return PiHandWithdraw
        case ROUTE_PATHS.VEHICLE_LOANS:
          return PiHandWithdraw
        case ROUTE_PATHS.EDUCATION_LOANS:
          return PiHandWithdraw
        case ROUTE_PATHS.OTHER_LIABILITIES:
          return PiHandWithdraw
        default:
          break;
      }
    }

    const items: TreeViewBaseItem<ExtendedTreeItemProps>[] = [
      {
        id: 'about_you',
        label: 'About You',
        icon: FaRegAddressBook,
        routePath: ROUTE_PATHS.ABOUT_YOU,
        children: [
          { id: 'personal_details', label: 'Personal Details', icon: FaRegUser, routePath: ROUTE_PATHS.PERSONAL_DETAILS },
          { id: 'address_details', label: 'Address Details', icon: FaRegAddressCard, routePath: ROUTE_PATHS.ADDRESS_DETAILS }
        ]
      },
      {
        id: 'assets',
        label: 'Asset',
        icon: IoBusinessOutline,
        routePath: ROUTE_PATHS.ASSETS,
        children: [],
      },
      {
        id: 'liabilities',
        label: 'Liabilities',
        routePath: ROUTE_PATHS.LIABILITIES,
        icon: PiHandWithdraw,
        children: [],
      },
      {
        id: 'beneficiaries',
        label: 'Beneficiaries',
        icon: GiThreeFriends,
        routePath: ROUTE_PATHS.BENEFICIARIES
      },
      {
        id: 'assetDistribution',
        label: 'Asset Distribution',
        icon: MdOutlineAccountBalance,
        routePath: ROUTE_PATHS.ASSET_DISTRIBUTION
      },
      {
        id: 'excludedPersons',
        label: 'Excluded Persons',
        icon: TbFriendsOff,
        routePath: ROUTE_PATHS.EXECLUDED_PERSONS
      },
    ];

    // SET ASSETS
    var immovalbleAssets: ExtendedTreeItemProps[] = routeState.filter(s => s.type === ASSET_TYPES.IMMOVABLE_ASSETS)
      .map(s => ({
        id: s.id,
        label: s.label,
        iconName: "pdf",
        icon: getIcons(s.currentPath),
        routePath: s.currentPath
      }))

    var financialAssets: ExtendedTreeItemProps[] = routeState.filter(s => s.type === ASSET_TYPES.FINANCIAL_ASSETS)
      .map(s => ({
        id: s.id,
        label: s.label,
        iconName: "pdf",
        icon: getIcons(s.currentPath),
        routePath: s.currentPath
      }))

    var businessAssets: ExtendedTreeItemProps[] = routeState.filter(s => s.type === ASSET_TYPES.BUSINESS_ASSETS)
      .map(s => ({
        id: s.id,
        label: s.label,
        iconName: "pdf",
        icon: getIcons(s.currentPath),
        routePath: s.currentPath
      }))

    var otherAssets: ExtendedTreeItemProps[] = routeState.filter(s => s.type === ASSET_TYPES.OTHER_ASSETS)
      .map(s => ({
        id: s.id,
        label: s.label,
        icon: getIcons(s.currentPath),
        iconName: "pdf",
        routePath: s.currentPath
      }))


    var liabilities: ExtendedTreeItemProps[] = routeState.filter(s => s.type === ASSET_TYPES.LIABILITIES)
      .map(s => ({
        id: s.id,
        label: s.label,
        iconName: "pdf",
        icon: getIcons(s.currentPath),
        routePath: s.currentPath
      }))

    const assetsItem = items.find(item => item.id === 'assets');
    if (assetsItem && assetsItem.children) {
      if (immovalbleAssets.length > 0)
        assetsItem.children.push({
          id: "immovable_assets",
          label: "Immovable Assets",
          routePath: ROUTE_PATHS.IMMOVABLE_ASSETS,
          icon: MdOutlineAddHomeWork,
          children: [...immovalbleAssets]
        });

      if (financialAssets.length > 0)
        assetsItem.children.push({
          id: "financial_assets",
          label: "Financial Assets",
          routePath: ROUTE_PATHS.FINANCIAL_ASSETS,
          icon: LiaMoneyBillWaveSolid,
          children: [...financialAssets]
        });

      if (businessAssets.length > 0)
        assetsItem.children.push({
          id: "business_assets",
          label: "Business Assets",
          routePath: ROUTE_PATHS.BUSINESS_ASSETS,
          icon: IoBusinessOutline,
          children: [...businessAssets]
        });

      if (otherAssets.length > 0)
        assetsItem.children.push({
          id: "other_assets",
          label: "Other Assets",
          routePath: ROUTE_PATHS.OTHER_ASSETS,
          icon: MdOutlineDirectionsCar,
          children: [...otherAssets]
        });
    }

    const liabilitiesItem = items.find(item => item.id === 'liabilities');
    if (liabilitiesItem && liabilitiesItem.children) {
      if (liabilities.length > 0)
        liabilitiesItem.children = [...liabilities];
    }

    // SET MENU ITEMS
    seTmenuItems(items);

  }, [routeState])

  const apiRef = useTreeViewApiRef();

  const handleLogout = () => {
    removeCookie('idToken'); // Removes the 'idToken' cookie
    removeCookie('phoneNumber');
    navigate('/login');
  };

  return (
    <div className='flex flex-col justify-between h-full items-start'>
      <div className='flex flex-col w-full'>
        <div className='w-full py-6 border-b-slate-400 border-b-[1px]'>
          <img
            src={`/assets/hamara-logo-icon.png`}
            className='h-20 m-auto w-fit'
            alt={"hamara-logo"}
            loading="lazy"
          />
        </div>
        <div className='p-6 w-full'>
          <RichTreeView
            apiRef={apiRef}
            multiSelect={false}
            items={menuItems}
            slots={{ item: CustomTreeItem }}
            onItemClick={(e, itemId) => handleSelectedItemChange(e, itemId)}
            selectedItems={navSelectedItem}
            expandedItems={expandedItems}
            onExpandedItemsChange={handleExpandedItemsChange}
          />
        </div>
      </div>
      <div className='w-full bottom-0 absolute md:hidden'>
        <button onClick={handleLogout} className='!bg-white !text-will-green w-full'>Log Out</button>
      </div>
    </div>
  );
}