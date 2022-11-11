import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Button, createTheme, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Switch, TextField, ThemeProvider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps} from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import distinct_json from "../../utils/distinct";
import { Edit, Delete, WatchLater, Star } from '@mui/icons-material';
import { ILamp, RequestBaseProps } from '../../_types';
import NewActive from '../../components/newActive/NewActive'
import "./style.scss";
import useApi from '../../hooks/useApi';
import { toast } from 'react-toastify';
import formatDate from '../../utils/formatDate';
import { group } from 'console';
import { boolean } from 'yup/lib/locale';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 1,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '1.6rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginBottom: theme.spacing(0),
  },
}));

//  ALTERAR CADASTRO        http://52.226.69.167:6000/poles-update/byfront
// {"device": "FARMSTECH-POSTE-SEUNOME", "desc":"alto do morro", "group":"blueland", "lat":"-22.49733837","long": "-46.47321031"}
const AccordionDetails: any = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));
export default function Ativos() {
    const [lamps, setLamps] = useState<ILamp[]>([]);
    const [age, setAge] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<string>()
    const [open, setOpen] = useState(false);
    const [selectPole, setSelectPole] = useState<ILamp>();
    const requestApi = useApi();
    const confirm:string = ""
    
    const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
     };

    useEffect(() => {
      (async () => {
          try {
              const response = await requestApi<RequestBaseProps<ILamp[]>>('/poles-status-dev', "get");

              if (response && response.data?.FL_STATUS) {
                  setLamps(response.data.data);
              }
          } catch (err) { }
      })();
    }, []);
    
    const series = distinct_json(lamps, 'group')    
    
    const theme = createTheme({
      palette: {
        primary: {
          main: '#7F00FF', 
        },
        secondary: {
          main: '#7F00FF',
        },
      },
    });

    async function btnLamp(lamp:string, { device }:ILamp, state:boolean) {
      const paramets = {[lamp]:state, devices:[device]}
      console.log(paramets)
      const res = await requestApi<{ FL_STATUS: boolean; message: string }>(
        "",
        "post",
        paramets
      );
      state? toast.success('Acendeu a Lâmpada!') : toast.info('Desligou a Lâmpada!')
    }

    async function btnDelete( device:string | undefined) {
      const paramets = {device:device}
      console.log('teste')
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

    }
    return (
      
        <div >
          <div>
            <Dialog
              open={open}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              >
              <DialogTitle id="alert-dialog-title">
                <h3>Você tem certeza que deseja deletar o ativo:</h3>
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                <p><strong>Ativo:</strong> {selectPole?.device}</p>
                <p><strong>Grupo:</strong> {selectPole?.group}</p>
                <p><strong>Descrição:</strong> {selectPole?.desc}</p>
                </DialogContentText>
                <TextField
                  autoFocus
                  size="small"
                  id="name"
                  label="Nome do Ativo"
                  type="text"
                  variant="standard"
                  color='primary'
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={
                 ()=>{
                      if (selectPole?.device===confirm) btnDelete(selectPole?.device);
                      console.log(selectPole?.device)
                      console.log(confirm)
                      setOpen(false)
                    }
                  }
                  >Confirmar</Button>
                <Button onClick={()=>{setOpen(false)}}>Cancelar</Button>
              </DialogActions>
            </Dialog>
          </div>

            <Grid container spacing={1}>
                <Grid item xs={4}>
                    <Button 
                      className='btnIncluir' 
                      variant="outlined"
                      onClick={() => setIsModalVisible(true)}
                    >Incluir</Button>
                    {isModalVisible ? (<NewActive onClose={() => setIsModalVisible(false)} />):null}
                </Grid>
                <Grid item xs={4}
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  >
                    <FormControl sx={{  minWidth:300}}>
                        <InputLabel id="demo-simple-select-label" color='primary'>Grupo</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Age"
                            onChange={handleChange}
                        >
                            <MenuItem value={"Todos"}>Todos</MenuItem>
                            {series.map((date)=>{
                                return <MenuItem value={date}>{date}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={2}>
                  <div>
                      
                  </div>
                </Grid>
                <Grid item xs={2}
                  container
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                    <div>
                    </div>
                </Grid>
                
                <Grid
                item xs={12}>
                   <Box sx={{ width: '100%',
                   backgroundColor: 'purple'
                    }}>
                      <Grid container>
                        <Grid item xs={3}
                          container
                          justifyContent="flex-start"
                        >
                          <h1>Ativos</h1>
                        </Grid> 
                        <Grid item xs={3}
                          container
                          justifyContent="center"
                        >
                          <h1>Grupos</h1>
                        </Grid>
                        <Grid item xs={3}
                          container
                          justifyContent="center"
                        >
                          <h1>Status</h1>
                        </Grid>
                        <Grid item xs={3}>

                        </Grid>
                      </Grid> 
                    </Box>
                </Grid>
                
                <Grid item xs={12}>   
                    {lamps.map((pole)=>{
                        if(pole.group === age){
                          return(
                            <div>
                              <Accordion key={pole.device}>
                                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                  <Grid item xs={4}>
                                    <Typography>{pole.device} <br />
                                      <div
                                        style={{
                                          fontSize: '0.8rem', 
                                          color: 'grey', 
                                        }}
                                      >última alreração: {formatDate(new Date(pole.datetime), "DD/MM/YYYY HH:ss")}</div>
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={3}>
                                    <Typography> {pole.group} </Typography>
                                  </Grid>
                                  <Grid item xs={2}>
                                    <ThemeProvider theme={theme}>
                                      <Typography>
                                        <Switch
                                          checked= {pole.lamp1 || pole.lamp2?true:false}
                                          onClick={
                                            (e) => {
                                              e.stopPropagation();
                                              const status = pole.lamp1 || pole.lamp2?false:true
                                              btnLamp("allLamps", pole, status)
                                              
                                            }
                                          }    
                                        /> 
                                      </Typography>
                                    </ThemeProvider>
                                  </Grid>
                                  <Grid 
                                    container
                                    item xs={3}
                                    justifyContent="flex-end"
                                    alignItems="center"
                                  >
                                      <Edit
                                        onClick={
                                          (e) => {
                                            e.stopPropagation();
                                          }
                                        }
                                        fontSize='large'
                                       />
                                      <Delete
                                        onClick={
                                          (e) => {
                                            e.stopPropagation();
                                            setOpen(true)
                                            setSelectPole(pole)
                                          }
                                        }
                                        fontSize='large'
                                      />
                                      <WatchLater
                                        onClick={
                                          (e) => {
                                            e.stopPropagation();
                                          }
                                        }
                                        fontSize='large'
                                      />
                                  </Grid>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <Typography>
                                    Localização: {pole.desc} <br/>
                                    latitude:{pole.lat} <br/>
                                    longitude:{pole.long} <br /><br />{' '}
                                  </Typography>
                                </AccordionDetails>
                              </Accordion>
                        </div>
                    )}
                        else if(age === '' || age === 'Todos' )
                            return (
                              <div>
                              <Accordion key={pole.device}>
                                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                  <Grid item xs={4}>
                                    <Typography>{pole.device} <br />
                                      <div
                                        style={{
                                          fontSize: '0.8rem', 
                                          color: 'grey', 
                                        }}
                                      >última alreração: {formatDate(new Date(pole.datetime), "DD/MM/YYYY HH:ss")}</div>
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={3}>
                                    <Typography> {pole.group} </Typography>
                                  </Grid>
                                  <Grid item xs={2}>
                                    <ThemeProvider theme={theme}>
                                      <Typography>
                                        <Switch
                                          checked= {pole.lamp1 || pole.lamp2?true:false}
                                          onClick={
                                            (e) => {
                                              e.stopPropagation();
                                              const status = pole.lamp1 || pole.lamp2?false:true
                                              btnLamp("allLamps", pole, status)
                                            }
                                          }    
                                        /> 
                                      </Typography>
                                    </ThemeProvider>
                                  </Grid>
                                  <Grid 
                                    container
                                    item xs={3}
                                    justifyContent="flex-end"
                                    alignItems="center"
                                  >
                                      <Edit
                                        onClick={
                                          (e) => {
                                            e.stopPropagation();
                                          }
                                        }
                                        fontSize='large'
                                       />
                                      <Delete
                                        onClick={
                                          (e) => {
                                            e.stopPropagation();
                                          }
                                        }
                                        fontSize='large'
                                      />
                                      <WatchLater
                                        onClick={
                                          (e) => {
                                            e.stopPropagation();
                                          }
                                        }
                                        fontSize='large'
                                      />
                                  </Grid>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <Typography>
                                    Localização: {pole.desc} <br/>
                                    latitude:{pole.lat} <br/>
                                    longitude:{pole.long} <br /><br />{' '}
                                  </Typography>
                                </AccordionDetails>
                              </Accordion>
                        </div>
                            )
                        })}
                </Grid>
            </Grid>
        </div>


    )
}