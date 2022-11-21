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
import {
  DeleteOutlined,
  AccessAlarmOutlined,
  ModeEditOutlineOutlined,
} from "@mui/icons-material";
import MuiAccordionDetails from "@mui/material/AccordionDetails";

import distinct_json from "../../utils/distinct";
import { Edit, Delete, Padding } from "@mui/icons-material";
import { ILamp, FormNewGroup } from "../../_types";
import NewGroup from "../../components/newGroup/NewGroup";
import "./styleGrupos.scss";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { toast } from "react-toastify";

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

export default function Groups() {
  const [age, setAge] = useState("");
  const [groups, setGroups] = useState<string[]>([]);
  const [isModalGroupVisible, setIsModalGroupVisible] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [isModalScheduling, setIsModalScheduling] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string>();
  const [openModalDelete, setOpenModalDelete] = useState(false);

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  const sendApi = useApi();

  const getGroups = async () => {
    const res = await sendApi("/groups-collect-dev", "get");
    if (res?.data && res?.data?.FL_STATUS) {
      setGroups(res?.data?.groups);
    }
  };

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
          <div className="cabecalhoAtivos">
            <Grid container>
              <Grid item xs={3} container justifyContent="flex-start">
                <h1 className="txtCabecalho">Nome do Grupo</h1>
              </Grid>
              <Grid item xs={3} container justifyContent="center">
                <h1 className="txtCabecalho">Editar</h1>
              </Grid>
              <Grid item xs={5} container justifyContent="center">
                <h1 className="txtCabecalho">Deletar</h1>
              </Grid>

              <Grid item xs={3}></Grid>
            </Grid>
          </div>
        </Grid>

        <Grid item xs={12}>
          {groups.map((list) => {
            return (
              <div className="accordion">
                <Accordion>
                  <AccordionSummary key={list}>
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
                    <Grid 
                                    container
                                    item xs={12}
                                    justifyContent="flex-end"
                                    > 
                                      <ModeEditOutlineOutlined
                                        className="iconEdit"
                                        fontSize='large'
                                       />
                                      <DeleteOutlined
                                      className="iconDelete"
                                        fontSize='large'
                                      />
                                      
                                  </Grid>
                  </AccordionSummary>
                </Accordion>
              </div>
            );
          })}
        </Grid>
      </Grid>
    </div>
  );
}
