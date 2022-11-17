export type RequestBaseProps<props = any> = {
    FL_STATUS: boolean
    data: any
}
/* Tipagem dos Cards da telemetria */
export type Telemetry = {
    FL_STATUS: boolean | null;
    Installed: number | null;
    Maintenance: number;
    'Not installed' : number;
    'total of poles': number;
  }
  
/*Grafico de temperatura*/
export type ILamp = {
    long: string;
    lat: string;
    datetime: string;
    desc: string;
    device: string;
    group: string;
    geoloc: string;
    lamp1: boolean;
    lamp2: boolean;
    maint: boolean;
    status: boolean;
    tempESP: number;
}

export type influxProps = {
    device: string 
    time: string
    value: string
}
export type influxPropsTemp = {
    device: string 
    time: string
    ambTemp: string
}
export type PolesStatusResponse = {
    FL_STATUS: boolean;
    data: ILamp[];
}

export type date = {
    data: string[]
}

export type PoleProps = {
	datetime: string
    desc: string
    device: string
    lamp1: boolean
    lamp2: boolean
    lat: string
    lightSensor: boolean
	long: string
	lux: number
    maint: boolean
    movementSensor: boolean
    status: boolean
    tempESP: number
    turnedBy: string
}

export type MenuProps= {​​​​
    "name":string
    "icon"?:React.ReactNode
    "isCentralized":boolean
    "link"?:string   
    "Submenus"? : MenuProps[]
    }


    
export interface DrawerMenuProps{​​​​
    drawerWidth:number   
    open:boolean   
    onClose: () =>void
    
    }

export type FormNewActive ={
    device: string
    lat:string
    long:string
    group:string
    desc:string
    }

export type FormNewGroup ={
    group: string
    }

