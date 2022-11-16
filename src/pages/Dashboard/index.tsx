import { useState, useEffect } from "react";
import { sendApi } from "../../api/api";
import { Telemetry } from "../../_types";
import Grid from '@mui/material/Grid';
import "./style.css";
import Grafico from "../../components/chartTemp";

function App() {
  const [info, setInfo] = useState<Telemetry>();

  let res = async () => {
    const data: Telemetry = await sendApi('/poles-cards')
    console.log(data)
    setInfo(data)
  }

  useEffect(() => {
    res()
  }, [])

  return (


    <Grid container spacing={1} id="dash-page">
      <Grid item xs={4}>
        <div className="cards">
          <h4>Quantidade de Ativos</h4>
          <p className="number">{info?.["total of poles"]}</p>
        </div>
     </Grid>

      <Grid item xs={2}>
        <div className="cards">
          <h4>Ativos ligados</h4>
          <p className="number">{info?.Installed}</p>
        </div>
      </Grid>

      <Grid item xs={2}>
        <div className="cards">
          <h4>Ativos desligados</h4>
          <p className="number">{info?.["Not installed"]}</p>
        </div>
     </Grid>

      <Grid item xs={3}>
        <div className="cards">
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

