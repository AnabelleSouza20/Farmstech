import { useState, useEffect } from "react";
import { sendApi } from "../../api/api";
import Grid from "@mui/material/Grid";
import {
  Button,
  createTheme,
  FormControl,
  IconButton,
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
import Box from "@mui/material/Box";
import MuiAccordionDetails from "@mui/material/AccordionDetails";

import distinct_json from "../../utils/distinct";
import { Edit, Delete, Padding } from "@mui/icons-material";
import { ILamp } from "../../_types";
import NewGroup from "../../components/newGroup/NewGroup";
import "./style.scss";
import { useNavigate } from "react-router-dom";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
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
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginBottom: theme.spacing(0),
  },
}));

//  ALTERAR CADASTRO        http://52.226.69.167:6000/poles-update/byfront
// {"device": "FARMSTECH-POSTE-SEUNOME", "desc":"alto do morro", "group":"blueland", "lat":"-22.49733837","long": "-46.47321031"}

const handleEdit = (
  device: string,
  desc: string,
  group: string,
  lat: string,
  long: string
) => {
  const data = {
    device: device,
    desc: desc,
    group: group,
    lat: lat,
    long: long,
  };
};
const AccordionDetails: any = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));
export default function Groups() {
  const [lamps, setLamps] = useState<ILamp[]>([]);
  const [age, setAge] = useState("");
  const [status, setStatus] = useState<boolean>(false);
  const [isModalGroupVisible, setIsModalGroupVisible] = useState(false);

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  // let res = async () => {
  //   const poles = await sendApi("/poles-status");
  //   const polesData = poles.data;
  //   setLamps(polesData);
  // };

  // useEffect(() => {
  //   res();
  // }, []);

  const series = distinct_json(lamps, "group");

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
  function statusLamp(pole: ILamp) {
    const status = pole.lamp1 || pole.lamp2 ? false : true;
    console.log("olá");
  }

  const navigate = useNavigate()

  return (
    <div className="menuSuperior">
      <Grid container spacing={2}>
        <Grid item xs={2.3}>
          <Button
            className="btnIncluir"
            variant="outlined"
            onClick={() => setIsModalGroupVisible(true)}
          >
            Adicionar Grupo
          </Button>
          {isModalGroupVisible ? (
            <NewGroup onClose={() => setIsModalGroupVisible(false)} />
          ) : null}
        </Grid>
        <Grid item xs={2.3}>
          <Button
            className="btnIncluir"
            variant="outlined"
            onClick={()=>navigate ('/ativos')}
          >
            Voltar
          </Button>
          
        </Grid>

        <Grid
          item
          xs={4}
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        ></Grid>

        <Grid item xs={12}>
          <Box padding={1.5} sx={{ width: "auto", backgroundColor: "purple" }}>
            <Grid container>
              <Grid item xs={2} container justifyContent="flex-start">
                <h1>Nome do Grupo</h1>
              </Grid>
              <Grid item xs={8} container justifyContent="center">
                <h1>Editar</h1>
              </Grid>
              <Grid item xs={2} container justifyContent="center">
                <h1>Deletar Grupo</h1>
              </Grid>
              <Grid item xs={3}></Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12}>
          {lamps.map((pole) => {
            if (pole.group === age) {
              return (
                <div>
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
                            última alreração: {pole.datetime}
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
                                statusLamp(pole);
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
                        <Edit
                          onClick={(e) => {
                            handleEdit(
                              "FARMSTECH-POSTE-SEUNOME",
                              "alto do morro",
                              "blueland",
                              "-22.49733837",
                              "-46.47321031"
                            );
                            e.stopPropagation();
                          }}
                          fontSize="large"
                        />
                        <Delete fontSize="large" />
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
                <div>
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
                            última alreração: {pole.datetime}
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
                                statusLamp(pole);
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
                        <Edit
                          onClick={(e) => {
                            handleEdit(
                              "FARMSTECH-POSTE-SEUNOME",
                              "alto do morro",
                              "blueland",
                              "-22.49733837",
                              "-46.47321031"
                            );
                            e.stopPropagation();
                          }}
                          fontSize="large"
                        />
                        <Delete fontSize="large" />
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
