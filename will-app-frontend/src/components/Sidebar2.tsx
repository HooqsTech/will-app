import ArticleIcon from '@mui/icons-material/Article';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FolderRounded from '@mui/icons-material/FolderRounded';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
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
import { useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';
import { removeCookie } from 'typescript-cookie';
import { routesState } from '../atoms/RouteState';
import { ASSET_TYPES, ROUTE_PATHS } from '../constants';

type ExtendedTreeItemProps = {
  iconName?: string;
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

  const routeState = useRecoilValue(routesState);
  const [menuItems, seTmenuItems] = React.useState<TreeViewBaseItem<ExtendedTreeItemProps>[]>([]);

  const handleSelectedItemChange = (_: React.SyntheticEvent, itemId: string) => {
    var item = apiRef.current?.getItem(itemId)
    // setDrawerState(false);
    navigate(ROUTE_PATHS.YOUR_WILL + (item.routePath ?? ""));
  };

  const handleLogout = () => {
    removeCookie('idToken'); // Removes the 'idToken' cookie
    removeCookie('phoneNumber');
    navigate('/login');
  };

  React.useEffect(() => {
    const items: TreeViewBaseItem<ExtendedTreeItemProps>[] = [
      {
        id: 'about_you',
        label: 'About You',
        iconName: 'pdf',
        routePath: ROUTE_PATHS.ABOUT_YOU,
        children: [
          { id: 'personal_details', label: 'Personal Details', iconName: 'pdf', routePath: ROUTE_PATHS.PERSONAL_DETAILS },
          { id: 'address_details', label: 'Address Details', iconName: 'pdf', routePath: ROUTE_PATHS.ADDRESS_DETAILS }
        ]
      },
      {
        id: 'assets',
        label: 'Asset',
        iconName: 'pdf',
        routePath: ROUTE_PATHS.ASSETS,
        children: [],
      },
      {
        id: 'liabilities',
        label: 'Liabilities',
        routePath: ROUTE_PATHS.LIABILITIES,
        iconName: 'pdf',
        children: [],
      },
      {
        id: 'beneficiaries',
        label: 'Beneficiaries',
        iconName: 'pdf',
        routePath: ROUTE_PATHS.BENEFICIARIES
      },
      {
        id: 'assetDistribution',
        label: 'Asset Distribution',
        iconName: 'pdf',
        routePath: ROUTE_PATHS.ASSET_DISTRIBUTION
      }
    ];

    // SET ASSETS
    var immovalbleAssets: ExtendedTreeItemProps[] = routeState.filter(s => s.type === ASSET_TYPES.IMMOVABLE_ASSETS)
      .map(s => ({
        id: s.id,
        label: s.label,
        iconName: "pdf",
        routePath: s.currentPath
      }))

    var financialAssets: ExtendedTreeItemProps[] = routeState.filter(s => s.type === ASSET_TYPES.FINANCIAL_ASSETS)
      .map(s => ({
        id: s.id,
        label: s.label,
        iconName: "pdf",
        routePath: s.currentPath
      }))

    var businessAssets: ExtendedTreeItemProps[] = routeState.filter(s => s.type === ASSET_TYPES.BUSINESS_ASSETS)
      .map(s => ({
        id: s.id,
        label: s.label,
        iconName: "pdf",
        routePath: s.currentPath
      }))

    var otherAssets: ExtendedTreeItemProps[] = routeState.filter(s => s.type === ASSET_TYPES.OTHER_ASSETS)
      .map(s => ({
        id: s.id,
        label: s.label,
        iconName: "pdf",
        routePath: s.currentPath
      }))


    var liabilities: ExtendedTreeItemProps[] = routeState.filter(s => s.type === ASSET_TYPES.LIABILITIES)
      .map(s => ({
        id: s.id,
        label: s.label,
        iconName: "pdf",
        routePath: s.currentPath
      }))

    const assetsItem = items.find(item => item.id === 'assets');
    if (assetsItem && assetsItem.children) {
      if (immovalbleAssets.length > 0)
        assetsItem.children.push({
          id: "immovable_assets",
          label: "Immovable Assets",
          routePath: ROUTE_PATHS.YOUR_WILL + ROUTE_PATHS.IMMOVABLE_ASSETS,
          iconName: "pdf",
          children: [...immovalbleAssets]
        });

      if (financialAssets.length > 0)
        assetsItem.children.push({
          id: "financial_assets",
          label: "Financial Assets",
          routePath: ROUTE_PATHS.FINANCIAL_ASSETS,
          iconName: "pdf",
          children: [...financialAssets]
        });

      if (businessAssets.length > 0)
        assetsItem.children.push({
          id: "business_assets",
          label: "Business Assets",
          routePath: ROUTE_PATHS.BUSINESS_ASSETS,
          iconName: "pdf",
          children: [...businessAssets]
        });

      if (otherAssets.length > 0)
        assetsItem.children.push({
          id: "other_assets",
          label: "Other Assets",
          routePath: ROUTE_PATHS.OTHER_ASSETS,
          iconName: "pdf",
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

  return (
    <div className='flex flex-col justify-between items-start h-screen'>
      <div className='flex flex-col items-start w-full'>
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
          />
        </div>
      </div>

      <div className='w-full'>
        <button onClick={handleLogout} className='!bg-white !text-will-green w-full'>Log Out</button>
      </div>
    </div>

  );
}
