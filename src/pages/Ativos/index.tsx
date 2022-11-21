import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import {
  Button,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
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
  AccessAlarmOutlined,
  ModeEditOutlineOutlined,
} from "@mui/icons-material";
import { ILamp, RequestBaseProps } from "../../_types";
import NewActive from "../../components/newActive/NewActive";
import EditAssets from "../../components/EditAssets/index";
import Scheduling from "../../components/Scheduling/index";
import "./style.scss";
import useApi from "../../hooks/useApi";
import { toast } from "react-toastify";
import formatDate from "../../utils/formatDate";
import { useNavigate } from "react-router-dom";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `10px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 1,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "1.6rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: "rgba(255, 255, 255, .05)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginBottom: theme.spacing(0),
  },
}));

const AccordionDetails: any = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function Ativos() {
  const [lamps, setLamps] = useState<ILamp[]>([]);
  const [age, setAge] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [isModalScheduling, setIsModalScheduling] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string>();
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [selectPole, setSelectPole] = useState<ILamp>();
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

  const theme = createTheme({
    palette: {
      primary: {
        main: "#7F00FF",
      },
      secondary: {
        main: "#7F00FF",
      },
    },
  });

  //Function responsible for listing the groups to list the assets from the groups
  const series = distinct_json(lamps, "group");

  // Turns the asset lights on and off
  async function btnLamp(lamp: string, { device }: ILamp, state: boolean) {
    const paramets = { [lamp]: state, devices: [device] };
    console.log(paramets);
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
  async function btnDelete(device: string | undefined) {
    const paramets = { device: device };
    const res = await requestApi<{ FL_STATUS: boolean; message: string }>(
      "poles-delete-dev",
      "delete",
      paramets
    );
    if (!res?.data?.FL_STATUS) {
      toast.success("Ativo deletado com sucesso");
    } else {
      toast.error("ERRO, ativo não foi deletado");
    }
    setConfirmDelete("");
  }

  const textConfirm = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmDelete(event.target.value);
  };

  function assetsDelete(device: string | undefined) {
    if (confirmDelete === device) {
      btnDelete(device);
    } else {
      setConfirmDelete("");
      toast.error("ERRO, ativo não foi encontrado");
    }
  }

  return (
    <div>
      {isModalScheduling ? (
        <Scheduling
          onClose={() => setIsModalScheduling(false)}
          assets={selectPole}
        />
      ) : null}
      {isModalEdit ? (
        <EditAssets onClose={() => setIsModalEdit(false)} assets={selectPole} />
      ) : null}
      {/*Modal to confirm asset deletion*/}
      <div>
        <Dialog
          open={openModalDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            <h3>Tem certeza que deseja deletar o ativo:</h3>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p>
                <strong>Ativo:</strong> {selectPole?.device}
              </p>
              <p>
                <strong>Grupo:</strong> {selectPole?.group}
              </p>
              <p>
                <strong>Descrição:</strong> {selectPole?.desc}
              </p>
            </DialogContentText>
            <DialogContentText>
              <br />
              <strong>Digite o nome do ativo que você deseja deletar.</strong>
            </DialogContentText>
            <TextField
              size="small"
              id="confirmDelete"
              label="Nome do Ativo"
              type="text"
              value={confirmDelete}
              onChange={textConfirm}
              variant="standard"
              color="primary"
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button
              className="btnConfirmarDelete"
              onClick={() => {
                assetsDelete(selectPole?.device);
                setOpenModalDelete(false);
              }}
            >
              Confirmar
            </Button>
            <Button
              className="btnCancelDelete"
              onClick={() => {
                setConfirmDelete("");
                setOpenModalDelete(false);
              }}
            >
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <Grid container spacing={1}>
        <Grid item xs={2}>
          <Button
            className="btnIncluir01"
            variant="outlined"
            onClick={() => setIsModalVisible(true)}
          >
            Incluir
          </Button>
          {isModalVisible ? (
            <NewActive onClose={() => setIsModalVisible(false)} />
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
            <InputLabel id="demo-simple-select-label" color="primary">
              Grupo
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Age"
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
                <div className="accordion">
                  <Accordion key={pole.device}>
                    <AccordionSummary
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
                        <ThemeProvider theme={theme}>
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
                        </ThemeProvider>
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
                            setSelectPole(pole);
                            setIsModalEdit(true);
                          }}
                        />
                        <DeleteOutlined
                          className="iconDelete"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectPole(pole);
                            setOpenModalDelete(true);
                          }}
                          fontSize="large"
                        />
                        <AccessAlarmOutlined
                          className="iconAlarm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectPole(pole);
                            setIsModalScheduling(true);
                          }}
                          fontSize="large"
                        />
                      </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        Localização: {pole.desc} <br />
                        latitude:{pole.lat} <br />
                        longitude:{pole.long} <br />
                        <br />{" "}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </div>
              );
            } else if (age === "" || age === "Todos")
              return (
                <div className="accordion">
                  <Accordion key={pole.device}>
                    <AccordionSummary
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
                        <ThemeProvider theme={theme}>
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
                        </ThemeProvider>
                      </Grid>
                      <Grid
                        container
                        item
                        xs={3}
                        justifyContent="flex-end"
                        alignItems="center"
                      >
                        <ModeEditOutlineOutlined
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectPole(pole);
                            setIsModalEdit(true);
                          }}
                          fontSize="large"
                        />
                        <DeleteOutlined
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectPole(pole);
                            setOpenModalDelete(true);
                          }}
                          fontSize="large"
                        />
                        <AccessAlarmOutlined
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectPole(pole);
                            setIsModalScheduling(true);
                          }}
                          fontSize="large"
                        />
                      </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        Localização: {pole.desc} <br />
                        latitude:{pole.lat} <br />
                        longitude:{pole.long} <br />
                        <br />{" "}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </div>
              );
          })}
        </Grid>
      </Grid>
    </div>
  );
}
