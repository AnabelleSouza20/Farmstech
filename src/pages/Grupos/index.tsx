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
import EditGroup from "../../components/EditGroup/EditGroup";

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
  const [confirmDelete, setConfirmDelete] = useState<string>();
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [selectGrup, setSelectGrup] = useState<String>();

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

  async function btnDelete(device: String | undefined) {
    const paramets = { group: device };
    const res = await sendApi<{ FL_STATUS: boolean; message: string }>(
      "groups-delete-dev",
      "delete",
      paramets
    );
    console.log("teste", paramets);
    if (res?.data?.FL_STATUS) {
      toast.success("Grupo deletado com sucesso");
    } else {
      toast.error("ERRO, Grupo não foi deletado");
    }
    setConfirmDelete("");
  }

  const textConfirm = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmDelete(event.target.value);
  };

  function assetsDelete(device: String | undefined) {
    if (confirmDelete === device) {
      btnDelete(device);
    } else {
      setConfirmDelete("");
      toast.error("ERRO, ativo não foi encontrado");
    }
  }

  return (
    <div className="menuSuperior">
      {isModalEdit ? (
        <EditGroup onClose={() => setIsModalEdit(false)} assets={selectGrup} />
      ) : null}
      <div>
        <Dialog
          open={openModalDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            <h3>Tem certeza que deseja deletar o grupo:</h3>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p>
                <strong>Grupo:</strong> {selectGrup}
              </p>
            </DialogContentText>
            <DialogContentText>
              <br />
              <strong>Digite o nome do grupo que você deseja deletar.</strong>
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
                assetsDelete(selectGrup);
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
              <Grid item xs={9} container justifyContent="flex-start">
                <h1 className="txtCabecalho">Nome do Grupo</h1>
              </Grid>
              <Grid item xs={3} container justifyContent="center">
                <h2 className="txtCabecalho">Editar | Deletar</h2>
              </Grid>
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
                    <Grid container item xs={7.5} justifyContent="flex-end">
                      <Grid item xs={1}>
                        <ModeEditOutlineOutlined
                          className="iconEdit"
                          fontSize="large"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectGrup(list);
                            setIsModalEdit(true);
                          }}
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <DeleteOutlined
                          className="iconDelete"
                          fontSize="large"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectGrup(list);
                            setOpenModalDelete(true);
                          }}
                        />
                      </Grid>
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
