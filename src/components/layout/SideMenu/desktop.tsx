import * as React from 'react';

import Image from "next/image";

import Box from '@mui/material/Box';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

export default function SideMenu() {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: "240px",
                display: { xs: 'none', md: 'block' },
                [`& .${drawerClasses.paper}`]: {
                    backgroundColor: 'background.paper',
                },
            }}
        >
            <Box
                sx={{
                    width: "240px",
                    flexShrink: 0,
                    boxSizing: 'border-box',
                    height: "100%"
                }}
            >


                <Box sx={{ width: "100%", height: "70px", position: "relative", padding: "10px" }}>
                    <img
                        src="/mapup-logo.png"
                        width={"100%"}
                        alt="Logo"
                    />
                </Box>

                <Divider />
                <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
                    <List dense>
                        <ListItem disablePadding sx={{ display: 'block' }} >
                            <ListItemButton selected={true}>
                                <ListItemIcon sx={{ minWidth: 'fit-content', marginRight: 1 }}><HomeRoundedIcon /></ListItemIcon>
                                <ListItemText primary="Home" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Stack>
            </Box>
        </Drawer>
    )
}