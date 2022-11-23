import { useState, useEffect } from 'react';
import {
    AzureMap,
    AzureMapDataSourceProvider,
    AzureMapLayerProvider,
    AzureMapsProvider,
    AzureMapPopup
} from 'react-azure-maps';
import { data, MapMouseEvent, PopupOptions } from 'azure-maps-control';
import { toast } from 'react-toastify';
import {  RenderPoint } from '../../components/map';
import { RequestBaseProps, PoleProps } from "../../_types";
import useApi from '../../hooks/useApi';
// import api from "../../api/api";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Drawer, Box, Typography, CircularProgress } from '@mui/material';
import "./styles.scss";
import mapOptions from '../../utils/mapOptions';
import { bool } from 'yup';

const Mapa = () => {
    const requestApi = useApi();
    const [poles, setPoles] = useState<PoleProps[]>([]);
    const [selectedPole, setSelectedPole] = useState<PoleProps>();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [openedPopover, setOpenedPopover] = useState(false);
    const [popupOptions, setPopupOptions] = useState<PopupOptions>({});
    const [isLoading, setLoading] = useState(false);
    const [lamp1isOn, setLamp1isOn] = useState(false);
    const [lamp2isOn, setLamp2isOn] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const response = await requestApi<RequestBaseProps<PoleProps[]>>('/poles-status', "get");

                if (response && response.data?.FL_STATUS) {
                    setPoles(response.data.data);
                }
            } catch (err) { }
        })();
    }, []);
    useEffect(() => { setOpenedPopover(!!selectedPole); }, [selectedPole])

    const polesRefresh = async () => {
        try {
            const response = await requestApi<RequestBaseProps<PoleProps[]>>('/poles-status', "get");

            if (response && response.data?.FL_STATUS) {
                setPoles(response.data.data);
            }
        } catch (err) { }
    }

    async function btnLampada(lamp: string, { device }: any, state: boolean) {
        console.log(lamp1isOn);
        const paramets = { [lamp]: state, devices: [device] }
        const response = await requestApi<{FL_STATUS:boolean}>('farmstech_aut', "POST", paramets, false);
        if (response?.data && response.data.FL_STATUS){
            state ? toast.success('Acendeu a Lâmpada!'): toast.info('Desligou a Lâmpada!')
            polesRefresh();
            setTimeout(() => {
            setLoading(false);
            lamp1isOn ? setLamp1isOn(false) : setLamp1isOn(true);
            console.log(lamp1isOn)
            }, 1000);
            
        } else {
            toast.error("Não foi possível acender a Lâmpada!, verifique a conexão")
        }
        
    }
    const getPole = async (long: string, lat: string) => {
        const pole = poles.find(pole => pole.long === long && pole.lat === lat);
        if (!pole) return;
        setSelectedPole(pole);
        setLamp1isOn(pole.lamp1);
        setLamp2isOn(pole.lamp2);
    };

    useEffect(() => {

        if (selectedPole) {

            setIsDrawerOpen(true);

        }

    }, [selectedPole]);

    //extração de longitude e latitude do primeiro ativo carregado
    const lati = parseFloat(poles[3]?.lat || '0');
    const longi = parseFloat(poles[3]?.long || '0');
 
    return (
        <AzureMapsProvider>
            <div
                style={{
                    height: '100vh',
                    width: '100vw',
                }}
            >
                    <ArrowBackIcon
                    onClick={() => setIsDrawerOpen(true)}
                    className='arrow' 
                    sx={{
                        position: 'absolute',
                        bottom: '50%',
                        right: 0,
                        zIndex: 1000,
                        padding: '10px',
                        cursor: 'pointer'
                    }}  ></ArrowBackIcon>
                <Drawer                    
                    anchor="right"
                    open={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    sx={{
                        alignItems: 'center',
                    }}
                >
                    <Box 
                    className='drawer' width='100%' height='100%' textAlign='center'
                    >
                        <Typography  fontWeight='bold'>
                            <h1 className='title'>{selectedPole?.device}</h1> <br/>
                            {selectedPole?.desc.toUpperCase()} <br/> <br/>
                            LÂMPADA 1: <br/> 
                            {isLoading ? <CircularProgress /> : <button className='itembtn' onClick={() => {setLoading(true); btnLampada('lamp1', selectedPole, !selectedPole?.lamp1)}}>{lamp1isOn ? 'Desligar' : 'Ligar'}; </button>} <br/> <br/>                            
                            LÂMPADA 2: <br/> <button className='itembtn' onClick={() => btnLampada('lamp1', selectedPole, !selectedPole?.lamp2)}> <h4 >{selectedPole?.lamp2 ? 'Desligar' : 'Ligar'}</h4> </button> <br/> <br/> <br/>
                            LATITUDE: {selectedPole?.lat} <br/>
                            LONGITUDE: {selectedPole?.long} <br/>
                            TEMPERATURA: {selectedPole?.tempESP}°c<br/>
                        </Typography>
                    </Box>
                </Drawer>
            
                <AzureMap
                options={mapOptions}
               
                cameraOptions={{     
                    zoom:17,
                    type: 'fly',
                    duration: 5000,    
                    center: [longi, lati],
                }}  
                >
                    <AzureMapDataSourceProvider id='MultiplePoint'>
                        <AzureMapLayerProvider
                            
                            options={{
                                iconOptions: { image: 'pin-red' }
                            }}
                            events={{
                                click: 
                                (e: MapMouseEvent) => {
                                    if (e.shapes && e.shapes.length > 0) {
                                        const prop: any = e.shapes[0];
                                        setPopupOptions({
                                            ...popupOptions,
                                            pixelOffset: [0, -20],
                                            position: new data.Position(
                                                prop.data.geometry.coordinates[0],
                                                prop.data.geometry.coordinates[1],
                                            ),
                                        });
                                        getPole(prop.data.geometry.coordinates[0].toString(), prop.data.geometry.coordinates[1].toString());
                                    }
                                
                                },
                            }}
                            type="SymbolLayer"
                        />

                        {poles.map(({ long, lat }, index) => <RenderPoint key={`render-point-${index + 1}`} {...(new data.Position(Number(long), Number(lat)))} />)}
                        <AzureMapPopup
                            isVisible={openedPopover}
                            options={popupOptions}

                            popupContent={
                                <div>
        
                                  <h1
                                  className='styledtext'
                                  >{selectedPole?.device}</h1>       

                              </div>}
                        />
                    </AzureMapDataSourceProvider>

                </AzureMap>
            </div>
        </AzureMapsProvider>
    );
};
export default Mapa;