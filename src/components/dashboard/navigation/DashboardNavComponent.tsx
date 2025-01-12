import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import { Navigation } from '@toolpad/core/AppProvider';
import {
    Construction, EmojiPeople, Inventory,
    LocalShipping,
    Monitor, PowerSettingsNew, Settings, TransferWithinAStation,
    Warehouse
} from "@mui/icons-material";

export const DashboardNavComponent: Navigation = [
    {
        kind: 'header',
        title: 'Main items',
    },
    {
        segment: 'dashboard',
        title: 'Dashboard',
        icon: <DashboardIcon />,
    },
    {
        segment: 'warehouses',
        title: 'Warehouses',
        icon: <Warehouse />,
    },
    {
        segment: 'customers',
        title: 'Customers',
        icon: <EmojiPeople />,
    },
    {
        segment: 'inventory',
        title: 'Item Inventory',
        icon: <Inventory />,
    },
    {
        segment: 'employees',
        title: 'Employees',
        icon: <TransferWithinAStation />,
    },
    {
        segment: 'logs',
        title: 'Monitoring Logs',
        icon: <Monitor />,
    },
    {
        kind: 'divider',
    },
    {
        kind: 'header',
        title: 'Analytics',
    },
    {
        segment: 'transportation ',
        title: 'Transportation ',
        icon: <LocalShipping />,
    },
    {
        segment: 'equipment',
        title: 'Equipments',
        icon: <Construction />,
    },
    {
        segment: 'reports',
        title: 'Reports',
        icon: <BarChartIcon />,
        children: [
            {
                segment: 'sales',
                title: 'Sales',
                icon: <DescriptionIcon />,
            },
            {
                segment: 'traffic',
                title: 'Traffic',
                icon: <DescriptionIcon />,
            },
        ],
    },
    {
        segment: 'settings',
        title: 'User Account',
        icon: <Settings />,
    },
    {
        segment: 'logout',
        title: 'Sign Out',
        icon: <PowerSettingsNew />,
    },
];
