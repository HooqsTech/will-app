import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";

interface ICustomTabProps {
    tabItems: ICustomTabItem[]
}

interface ICustomTabItem {
    label: string
    value: string
    children: React.ReactNode
}

const CustomTabs: React.FC<ICustomTabProps> = ({ tabItems }) => {
    return (
        <Tabs value={tabItems[0].value}>
            <TabsHeader className="bg-slate-200">
                {tabItems.map((item) => (
                    <Tab key={item.label} value={item.value}>
                        {item.label}
                    </Tab>
                ))}
            </TabsHeader>
            <TabsBody>
                {tabItems.map((item) => (
                    <TabPanel key={item.label} value={item.value}>
                        {item.children}
                    </TabPanel>
                ))}
            </TabsBody>
        </Tabs>
    );
}

export default CustomTabs;