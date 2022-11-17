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
import { ILamp, FormNewGroup } from "../../_types";
import NewGroup from "../../components/newGroup/NewGroup";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";

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





export default function Groups() {
  const [groups, setGroups] = useState<string[]>([]);
  const [isModalGroupVisible, setIsModalGroupVisible] = useState(false);

  const sendApi = useApi()
  const getGroups = async () => {
    const res = await sendApi(
      "/groups-collect-dev",
      "get"
  );
  if(res?.data && res?.data?.FL_STATUS){
    setGroups(res?.data?.groups)
  }
  }
    

  useEffect(() => {
    getGroups();
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

  const navigate = useNavigate();

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
            onClick={() => navigate("/ativos")}
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
          {groups.map((list) => {
            return(
              <div>
                <Accordion >
                  <AccordionSummary key={list}
                  
                 >
                    <Grid item xs={4}>
                    <Typography>
                    {list} <br />
                    {/* <div
                      style={{
                        fontSize:"0.8rem",
                        color: "red"
                      }}>
                        Última alteração: {list}
                    </div> */}
                    </Typography>

                    </Grid>
                    
                  </AccordionSummary>
                </Accordion>
            </div>
            )
            
          })}


        </Grid>
      </Grid>
    </div>
  );
}
