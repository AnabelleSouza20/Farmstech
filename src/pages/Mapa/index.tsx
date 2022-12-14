import { useState, useEffect, useCallback } from "react";
import {
  AzureMap,
  AzureMapDataSourceProvider,
  AzureMapLayerProvider,
  AzureMapsProvider,
  AzureMapPopup,
} from "react-azure-maps";
import { data, MapMouseEvent, PopupOptions } from "azure-maps-control";
import { toast } from "react-toastify";
import { RenderPoint } from "../../components/map";
import { RequestBaseProps, PoleProps } from "../../_types";
import useApi from "../../hooks/useApi";
// import api from "../../api/api";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Drawer, Box, Typography, CircularProgress } from "@mui/material";
import "./styles.scss";
import mapOptions from "../../utils/mapOptions";
import simprao_imagem from "../../assets/img/simprao_imagem.jpg";
import Chart from "./chartTemp";
import Scheduling from "../../components/Scheduling";
import AccessTimeIcon from '@mui/icons-material/AccessTime';


const Mapa = () => {
  const requestApi = useApi();
  const [poles, setPoles] = useState<PoleProps[]>([]);
  const [selectedPole, setSelectedPole] = useState<PoleProps>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openedPopover, setOpenedPopover] = useState(false);
  const [popupOptions, setPopupOptions] = useState<PopupOptions>({});
  const [isLoading1, setLoading1] = useState(false);
  const [isLoading2, setLoading2] = useState(false);
  const [lamp1isOn, setLamp1isOn] = useState(false);
  const [lamp2isOn, setLamp2isOn] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isPolesInitialized, setIsPolesInitialized] = useState(false);



  // esse efeito ouve o estado de isPolesInitialized e executa a função de requisição
  useEffect(() => {
    (async () => {
      try {
        const response = await requestApi<RequestBaseProps<PoleProps[]>>(
          "/poles-status-dev",
          "get"
        );
  
        if (response && response.data?.FL_STATUS) {
          setPoles(response.data.data);
          setIsPolesInitialized(true);
        }
      } catch (err) {}
    })();
  }, [isPolesInitialized]);
  
  useEffect(() => {
    setOpenedPopover(!!selectedPole);
  }, [selectedPole]);



  async function btnLampada(lamp: string, { device }: any, state: boolean) {
    const paramets = { [lamp]: state, devices: [device] };
    const response = await requestApi<{ FL_STATUS: boolean }>(
      "lamps-aut-dev",
      "POST",
      paramets,
      false
    );
    if (response?.data && response.data.FL_STATUS) {
      if (lamp === "allLamps") {
        lamp1isOn ? setLamp1isOn(false) : setLamp1isOn(true);
        lamp2isOn ? setLamp2isOn(false) : setLamp2isOn(true);
        setLoading1(false);
        setLoading2(false);
        if (lamp1isOn && lamp2isOn) { 
          toast.success("Apagou as Lâmpadas!");
        } else {
          toast.success("Acendeu as Lâmpadas!");
        }
      }
      // controle individual das lampadas
      /* else 
      if (lamp === "lamp1") {
        lamp1isOn ? setLamp1isOn(false) : setLamp1isOn(true);
        setLoading1(false);
        if (lamp1isOn) {
          toast.success("Apagou a Lâmpada!");
        } else {
          toast.success("Acendeu a Lâmpada!");
        }
      } else {
        lamp2isOn ? setLamp2isOn(false) : setLamp2isOn(true);
        setLoading2(false);
        if (lamp2isOn) {
          toast.success("Apagou a Lâmpada!");
        } else {
          toast.success("Acendeu a Lâmpada!");
        }
      } */
    } else {
      toast.error("Não foi possível acender a Lâmpada!, verifique a conexão");
    }
  }

  //função que recebe a longitude e latitude do ponto clicado e busca no array de lampadas
  const getPole = async (long: string, lat: string) => {
    const pole = poles.find((pole) => pole.long === long && pole.lat === lat);
    if (!pole) {
      setIsPolesInitialized(false);
      return;
    }
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
  //const lati = parseFloat(poles[1]?.lat || "0");
  //const longi = parseFloat(poles[1]?.long || "0");
 //here

  return (
    <AzureMapsProvider

    >
      <div
        style={{
          height: "100vh",
          width: "100vw",
        }}
      >
        {selectedPole && (
        <ArrowBackIcon
          onClick={() => setIsDrawerOpen(true)}
          className="arrow"
          sx={{
            position: "absolute",
            bottom: "50%",
            right: 0,
            zIndex: 1000,
            padding: "10px",
            cursor: "pointer",
          }}
        ></ArrowBackIcon>
        )}
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          sx={{
            alignItems: "center",
          }}
        >
          <Box className="drawer" textAlign="center">
            <h1>{selectedPole?.device}   <AccessTimeIcon
          fontSize="large"
          className="timeIcon"
          onClick={() => setIsRendered(true)}
          /></h1>
          {/**  renderização condicional do formulário de agendamento. */}
          {isRendered ? (
              <Scheduling onClose={() => setIsRendered(false)
        } assets={undefined} pole={selectedPole}
        />
              ) : ( null )}
              <div className="lampadasTitle">
                <h3>
                  Lâmpadas
                </h3>
                  {isLoading1 ? (
                    <CircularProgress />
                  ) : (
                    <button
                      className="itembtn"
                      onClick={() => {
                        setLoading1(true);
                        btnLampada("allLamps", selectedPole, !selectedPole?.lamp1);
                      }}
                    >
                      {lamp1isOn ? "Desligar" : "Ligar"}
                    </button>
                  )}
                
              </div>
              
              <Chart
              className="chart"
              pole={selectedPole}
              />
            <div
            className="imgheader"
            >
              <h2>{selectedPole?.desc}</h2>
            </div>
              <img height={300} width={500} src={simprao_imagem}
              className="drawerimg"></img>
            
          </Box>
  
        </Drawer>

        <AzureMap
          options={
            mapOptions}
          cameraOptions={{
            zoom: 18.5,
           // type: "fly", //animação de abertura do mapa
            duration: 3000,
            center: [-46.472809010590716, -22.49694307185298],
          }}
        >
           {/**  renderização condicional dos marcadores, só aparecerão se o "poles" estiver populado*/}
          {isPolesInitialized ? (
          <AzureMapDataSourceProvider id="MultiplePoint">
            <AzureMapLayerProvider
              options={{
                iconOptions: { image: "pin-red" },
              }}
              events={{
                click: (e: MapMouseEvent) => {

                  if (e.shapes && e.shapes.length > 0) {
    
                    const prop: any = e.shapes[0];
                    setPopupOptions({
                      ...popupOptions,
                      pixelOffset: [0, 0],
                      position: new data.Position(
                        prop.data.geometry.coordinates[0],
                        prop.data.geometry.coordinates[1]
                      ),
                    });
                    getPole(
                      prop.data.geometry.coordinates[0].toString(),
                      prop.data.geometry.coordinates[1].toString()
                    );
                  }
                },
              }}
              type="SymbolLayer"
            />
            {poles.map(({ long, lat }, index) => (
              <RenderPoint
                key={`render-point-${index + 1}`}
                {...new data.Position(Number(long), Number(lat))}
              />
            ))}
            <AzureMapPopup
              isVisible={openedPopover}
              options={popupOptions}
              popupContent={
                <div>
                  <h1 className="styledtext">{selectedPole?.device}</h1>
                </div>
              }
            />
          </AzureMapDataSourceProvider>
          ) : (
            <CircularProgress />
          )}
        </AzureMap>
      </div>
    </AzureMapsProvider>
  );
};
export default Mapa;
