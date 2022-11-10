import { Box, Drawer } from '@mui/material';
import { DrawerMenuProps } from '../../_types';

import DrawerList from './DrawerList';

import "./styles.scss";
export default function DrawerMenu({ drawerWidth, open, onClose }: DrawerMenuProps) {
    return (
        <Box
            component="nav"
            sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
            aria-label="mailbox folders"
        >
            <Drawer
                className="drawer"
                variant="temporary"
                open={open}
                onClose={onClose}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                <DrawerList />
            </Drawer>
            
            <Drawer
                className="drawer"
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open
            >
                <DrawerList />
            </Drawer>
        </Box>
    );
}
