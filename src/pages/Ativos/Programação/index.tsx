import { useState, useEffect } from "react";
import { sendApi } from "../../../api/api";
import Grid from "@mui/material/Grid";
import {
  Button,
  createTheme,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
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
import Box from "@mui/material/Box";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import distinct_json from "../../../utils/distinct";
import { Edit, Delete, Height } from "@mui/icons-material";
import { ILamp } from "../../../_types";
import NewActive from "../../../components/newActive/NewActive"
import "./style.scss";
import MaskedInput from "react-text-mask";
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
export default function P() {
  const [lamps, setLamps] = useState<ILamp[]>([]);
  const [age, setAge] = useState("");
  const [status, setStatus] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  let res = async () => {
    const poles = await sendApi("/poles-status");
    const polesData = poles.data;
    setLamps(polesData);
  };

  useEffect(() => {
    res();
  }, []);

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
  return (
    <div className="menuSuperior">
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <Button
            className="btnIncluir"
            variant="outlined"
            onClick={() => setIsModalVisible(true)}
          >
            Incluir
          </Button>
          {isModalVisible ? (
            <NewActive onClose={() => setIsModalVisible(false)} />
          ) : null}
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
              value={age}
              label="Age"
              onChange={handleChange}
            >
              <MenuItem value={"Todos"}>Todos</MenuItem>
              {series.map((date) => {
                return <MenuItem value={date}>{date}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={2}>
          <div className="inconForm">
            <IconButton color="secondary" aria-label="add an alarm">
              <AccessTimeIcon sx={{ fontSize: 60, color: "#fff" }} />
            </IconButton>
          </div>
        </Grid>

        <Grid
          item
          xs={2}
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <div className="inconForm">
            <IconButton color="secondary" aria-label="add an alarm">
              <StarBorderIcon sx={{ fontSize: 60, color: "#fff" }} />
            </IconButton>
          </div>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ width: "100%", backgroundColor: "purple" }}>
            <Grid container>
              <Grid item xs={3} container justifyContent="flex-start">
                <h1>Ativos</h1>
              </Grid>
              <Grid item xs={2} container justifyContent="center">
                <h1>Grupos</h1>
              </Grid>
              <Grid item xs={3} container justifyContent="center">
                <h2>Automação</h2>
              </Grid>
              <Grid item xs={2} container justifyContent="center">
                <h2>Horários</h2>
              </Grid>
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

                        <MaskedInput className="inputTime"
                          placeholder="00:00"
                          mask={[/\d/, /\d/, ":", /\d/, /\d/]}
                          />
                        <Typography
                        paddingTop={2}
                        paddingLeft={2}
                        paddingRight={2}
                        >
                             Até: 
                        </Typography>
                        <MaskedInput className="inputTime"
                          placeholder="00:00"
                          mask={[/\d/, /\d/, ":", /\d/, /\d/]}
                          />
                      <Grid
                        container
                        item
                        xs={2}
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
