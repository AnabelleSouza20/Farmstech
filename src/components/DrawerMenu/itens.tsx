import { MenuProps } from '../../_types';
import {Settings, Addchart, Home} from '@mui/icons-material';


const MenuItemsJSON: MenuProps[] = [
    {
        "name": "Home",
        "icon": <Home/>,
        "isCentralized": false,
        "link": "/",
    },
    {
        "name": "Automação",
        "icon": <Settings/>,
        "isCentralized": false,
        "Submenus": [
        { 
            "name": "Mapa",
            "isCentralized": false,
            "link": "/mapa"
        },
        {
            "name": "Ativos",
            "isCentralized": false,
            "link": "/ativos"
        },
        {
            "name": "Grupos",
            "isCentralized": false,
            "link": "/grupos"
        }, 
    ]
        
    
        
    },
    

    
   
    // {
    //     "name": "Usuários",
    //     "icon": UsersSVG,
    //     "isCentralized": false,
    //     "link": "/adm/users"
    // },
 
]
export default MenuItemsJSON;