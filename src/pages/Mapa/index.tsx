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
import { Popover, RenderPoint } from '../../components/map';

import option from '../../utils/mapOptions';
import { RequestBaseProps, PoleProps } from "../../_types";
import useApi from '../../hooks/useApi';
// import api from "../../api/api";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Drawer, Box, Typography } from '@mui/material';

import "./styles.scss";

const Mapa = () => {
    const requestApi = useApi();
    const [poles, setPoles] = useState<PoleProps[]>([]);
    const [selectedPole, setSelectedPole] = useState<PoleProps>();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [openedPopover, setOpenedPopover] = useState(false);
    const [popupOptions, setPopupOptions] = useState<PopupOptions>({});

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

    async function btnLampada(lamp: string, { device }: any, state: boolean) {
        const paramets = { [lamp]: state, devices: [device] }
        await requestApi('/farmstech_aut', "POST", paramets);
        state ? toast.success('Acendeu a Lâmpada!') : toast.info('Desligou a Lâmpada!')
    }
    const getPole = async (long: string, lat: string) => {
        const pole = poles.find(pole => pole.long === long && pole.lat === lat);
        if (!pole) return;
        console.log(pole)
        setSelectedPole(pole);
    };

    useEffect(() => {

        if (selectedPole) {

            setIsDrawerOpen(true);

        }

    }, [selectedPole]);

    //grabs long and lat from the first pole
    const { long, lat } = poles[0] || { long: 0, lat: 0 };
    console.log(parseFloat(long), parseFloat(lat))
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
                            LÂMPADA 1: <br/> <button className='itembtn' onClick={() => btnLampada('lamp1', selectedPole, !selectedPole?.lamp1)}> <h4 >{selectedPole?.lamp1 ? 'Desligar' : 'Ligar'}</h4> </button>  <br/> <br/>
                            LÂMPADA 2: <br/> <button className='itembtn' onClick={() => btnLampada('lamp1', selectedPole, !selectedPole?.lamp2)}> <h4 >{selectedPole?.lamp2 ? 'Desligar' : 'Ligar'}</h4> </button> <br/> <br/> <br/>
                            LATITUDE: {selectedPole?.lat} <br/>
                            LONGITUDE: {selectedPole?.long} <br/>
                            TEMPERATURA: {selectedPole?.tempESP}°c<br/>
                        </Typography>
                    </Box>
                </Drawer>
                <AzureMap options= {option}
                cameraOptions={{
                    zoom: 17,
                    center: [parseFloat(long), parseFloat(lat)],
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