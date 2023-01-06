import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import {
  Button,
  createTheme,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import distinct_json from "../../utils/distinct";
import {
  DeleteOutlined,
  ModeEditOutlineOutlined,
} from "@mui/icons-material";
import { ILamp, RequestBaseProps } from "../../_types";
import NewActive from "../../components/newActive/NewActive";
import EditAssets from "../../components/EditAssets/index";
import DeleteAssets from  "../../components/DeleteAssets/DeleteAssets"
import "./style.scss";
import useApi from "../../hooks/useApi";
import { toast } from "react-toastify";
import formatDate from "../../utils/formatDate";
import { useNavigate } from "react-router-dom";



export default function Ativos() {
  const [lamps, setLamps] = useState<ILamp[]>([]);
  const [age, setAge] = useState("");
  const [isActiveVisible, setIsActiveVisible] = useState(false);
  const [isActiveEdit, setIsActiveEdit] = useState(false);
  const [isActiveDelete, setIsActiveDelete] = useState(false);
  const [selectActive, setselectActive] = useState<ILamp>();
  const requestApi = useApi();
  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await requestApi<RequestBaseProps<ILamp[]>>(
          "/poles-status-dev",
          "get"
        );

        if (response && response.data?.FL_STATUS) {
          setLamps(response.data.data);
        }
      } catch (err) {}
    })();
  }, []);


  //Function responsible for listing the groups to list the assets from the groups
  const series = distinct_json(lamps, "group");

  // Turns the asset lights on and off
  async function btnLamp(lamp: string, { device }: ILamp, state: boolean) {
    const paramets = { [lamp]: state, devices: [device] };

      const res = await requestApi<{ FL_STATUS: boolean; message: string }>(
      "lamps-aut-dev",
      "post",
      paramets
    );
    state
      ? toast.success("Acendeu a Lâmpada!")
      : toast.info("Desligou a Lâmpada!");
  }

  // function to delete assets
  

  return (
    <div>
      {isActiveDelete?(<DeleteAssets onClose={()=> setIsActiveDelete(false)} assets={selectActive?.device}/>):null}
      {isActiveEdit ? ( <EditAssets onClose={() => setIsActiveEdit(false)} assets={selectActive}/>) : null}
      
      {/*Modal to confirm asset deletion*/}
    

      <Grid container spacing={1}>
        <Grid item xs={2}>
          <Button
            className="btnIncluir01"
            variant="outlined"
            onClick={() => setIsActiveVisible(true)}
          >
            Incluir
          </Button>
          {isActiveVisible ? (
            <NewActive onClose={() => setIsActiveVisible(false)} />
          ) : null}
        </Grid>
        <Grid item xs={2}>
          <Button
            className="btnIncluir01"
            variant="outlined"
            onClick={() => navigate("/grupos")}
          >
            Grupos
          </Button>
        </Grid>
        <Grid
          item
          xs={4}
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <FormControl sx={{ minWidth: 300 }}>
            <InputLabel id="demo-simple-select-label" color="primary" className="inputlabel">
              Grupo
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Age"
              className="filtro"
              onChange={handleChange}
            >
              <MenuItem value={"Todos"}>Todos</MenuItem>
              {series.map((data) => {
                return <MenuItem value={data}>{data}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={2}>
          <div></div>
        </Grid>
        <Grid
          item
          xs={2}
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <div></div>
        </Grid>

        <Grid item xs={12}>
          <div className="cabecalhoAtivos">
            <Grid container>
              <Grid item xs={3} container justifyContent="flex-start">
                <h1 className="txtCabecalho">Ativos</h1>
              </Grid>
              <Grid item xs={3} container justifyContent="center">
                <h1 className="txtCabecalho">Grupos</h1>
              </Grid>
              <Grid item xs={3} container justifyContent="center">
                <h1 className="txtCabecalho">Status</h1>
              </Grid>
              <Grid item xs={3}></Grid>
            </Grid>
          </div>
        </Grid>

        <Grid item xs={12}>
          {lamps.map((pole) => {
            if (pole.group === age) {
              return (
                <MuiAccordion key={pole.device }
                className="accordion"
                >
                  <MuiAccordionSummary
                    aria-controls="panel1d-content"
                    id="panel1d-header"
                  >
                    <Grid item xs={4}>
                      <div className="txtAtivos">
                        {pole.device} <br />
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "grey",
                          }}
                        >
                          última alreração:{" "}
                          {formatDate(
                            new Date(pole.datetime),
                            "DD/MM/YYYY HH:ss"
                          )}
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography> {pole.group} </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography>
                          <Switch
                            checked={pole.lamp1 || pole.lamp2 ? true : false}
                            onClick={(e) => {
                              e.stopPropagation();
                              const status =
                                pole.lamp1 || pole.lamp2 ? false : true;
                              btnLamp("lamp1", pole, status);
                              btnLamp("lamp2", pole, status);
                            }}
                          />
                        </Typography>
                    </Grid>
                    <Grid
                      container
                      item
                      xs={3}
                      justifyContent="flex-end"
                    >
                      <ModeEditOutlineOutlined
                        className="iconEdit"
                        fontSize="large"
                        onClick={(e) => {
                          e.stopPropagation();
                          setselectActive(pole);
                          setIsActiveEdit(true);
                        }}
                      />
                      <DeleteOutlined
                        className="iconDelete"
                        onClick={(e) => {
                          e.stopPropagation();
                          setselectActive(pole);
                          setIsActiveDelete(true)
                        }}
                        fontSize="large"
                      />
                     
                    </Grid>
                  </MuiAccordionSummary>
                  <MuiAccordionDetails className="accordionDetails">
                    
                      Localização: {pole.desc} <br />
                      latitude:{pole.lat} <br />
                      longitude:{pole.long} <br />
                  </MuiAccordionDetails>
                </MuiAccordion>
              );
            } else if (age === "" || age === "Todos")
              return (
                <MuiAccordion key={pole.device} className="accordion">
                  <MuiAccordionSummary
                    aria-controls="panel1d-content"
                    id="panel1d-header"
                  >
                    <Grid item xs={4}>
                      <Typography>
                        {pole.device} <br />
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "grey",
                          }}
                        >
                          última alreração:{" "}
                          {formatDate(
                            new Date(pole.datetime),
                            "DD/MM/YYYY HH:ss"
                          )}
                        </div>
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography> {pole.group} </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography>
                          <Switch
                            checked={pole.lamp1 || pole.lamp2 ? true : false}
                            onClick={(e) => {
                              e.stopPropagation();
                              const status =
                                pole.lamp1 || pole.lamp2 ? false : true;
                              btnLamp("allLamps", pole, status);
                            }}
                          />
                        </Typography>
                    </Grid>
                    <Grid
                      container
                      item
                      xs={3}
                      justifyContent="flex-end"
                    >
                      <ModeEditOutlineOutlined
                        className="iconEdit"
                        fontSize="large"
                        onClick={(e) => {
                          e.stopPropagation();
                          setselectActive(pole);
                          setIsActiveEdit(true);
                        }}
                      />
                      <DeleteOutlined
                        className="iconDelete"
                        onClick={(e) => {
                          e.stopPropagation();
                          setselectActive(pole);
                          setIsActiveDelete(true)
                        }}
                        fontSize="large"
                      />
                      
                    </Grid>
                  </MuiAccordionSummary>
                  <MuiAccordionDetails className="accordionDetails">
                   
                      Localização: {pole.desc} <br />
                      latitude:{pole.lat} <br />
                      longitude:{pole.long} <br />
                      <br />{" "}
                 
                  </MuiAccordionDetails>
                </MuiAccordion>
              );
          })}
        </Grid>
      </Grid>
    </div>
  );
}
