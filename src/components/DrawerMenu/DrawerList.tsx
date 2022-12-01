import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material';

import MenuItemsJSON from "./itens";
import logoPng from "../../assets/img/logo.png";

import { MenuProps } from '../../_types';
export default function DrawerList() {
    return (

        <>
            <a href='/' className='a-not-effect'><img src={logoPng} className="logo" alt="logo" /></a>
            <List className='menu-list'>
                {MenuItemsJSON.map(item => (
                    // <ListItem key={item.name} className={`mb-4 ${item.name === "Sair" && "mt-5"}`} disablePadding>
                    <ListContent {...item} key={item.name} />
                    // </ListItem>
                ))}


            </List>
        </>
    );
}


function ListContent(item: MenuProps) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);


    const handleClick = (item: MenuProps) => {
        if (item.Submenus) return setOpen(value => !value);
        if (item.link) return navigate(item.link);
    }




    const { icon, name, isCentralized } = item;
    return (
        <>
            <ListItemButton className={`${isCentralized && "justify-content-center"}`} onClick={() => handleClick(item)}>
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText primary={name} style={{ flex: isCentralized ? "none" : "inherit" }} />
            </ListItemButton>

            {item.Submenus && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div">
                        {item.Submenus.map(Submenus => <ListContent key={Submenus.name} {...Submenus} />)}
                    </List>
                </Collapse>)}




        </>

    );

}