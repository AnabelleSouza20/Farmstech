import { useState, useEffect } from "react";
import { sendApi } from "../../api/api";
import { RequestBaseProps, Telemetry } from "../../_types";
import Grid from '@mui/material/Grid';
import "./style.css";
import Grafico from "../../components/chartTemp";
import useApi from '../../hooks/useApi';

function App() {
  const [info, setInfo] = useState<Telemetry>();
  const requestApi = useApi();






  useEffect(() => {
    (async () => {
        try {
            const response:any = await requestApi<RequestBaseProps<Telemetry>>('/poles-cards-dev', "get");
            if (response && !response.data?.FL_STATUS) {
              setInfo(response.data);
            }
        } catch (err) { }
    })();
  }, []);

  return (
    <Grid container spacing={1} id="dash-page">
      <Grid item xs={3}>
        <div className="cards02">
          <h4>Quantidade de Ativos</h4>
          <p className="number">{info?.["total of poles"]}</p>
        </div>
     </Grid>
      <Grid item xs={3}>
        <div className="cards02">
          <h4>Ativos ligados</h4>
          <p className="number">{info?.Installed}</p>
        </div>
      </Grid>

      <Grid item xs={3}>
        <div className="cards02">
          <h4>Ativos desligados</h4>
          <p className="number">{info?.["Not installed"]}</p>
        </div>
     </Grid>
      <Grid item xs={3}>
        <div className="cards02">
          <h4>Ativos em manutenção</h4>
          <p className="number">{info?.Maintenance}</p>
        </div>
      </Grid>
      <Grid item xs={6}>
         <Grafico/>
      </Grid>
    </Grid>



  )
}

export default App;

