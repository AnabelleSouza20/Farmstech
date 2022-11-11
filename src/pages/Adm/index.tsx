import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import DrawerMenu from './../../components/DrawerMenu';
const drawerWidth = 246;
export default function Adm({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
    return (
        <Box sx={{ display: 'flex' }}>
            <DrawerMenu drawerWidth={drawerWidth} onClose={handleDrawerToggle} open={mobileOpen} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: {
                        md: `calc(100% - ${drawerWidth}px)`
                    },
                    height: `calc(100vh - (24px * 2))`, // 24px make reference a padding y, so * 2
                    overflowY: "auto"
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>);
}
