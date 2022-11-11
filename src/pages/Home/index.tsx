import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import "./index.scss";
import Logo from "../../assets/img/logo.png";
import Grid from "@mui/material/Grid";
import Icon1 from "../../assets/imgPgHome/iconPoste.png";
import Icon2 from "../../assets/imgPgHome/iconArvore.png";
//import chartTemp from "../../components/chartTemp";

export default function Home() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [anchorEl2, setAnchorEl2] = React.useState<null | HTMLElement>(null);
  const open2 = Boolean(anchorEl2);
  const handleClick2 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const [anchorEl3, setAnchorEl3] = React.useState<null | HTMLElement>(null);
  const open3 = Boolean(anchorEl3);
  const handleClick3 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl3(event.currentTarget);
  };
  // const handleClose3 = () => {
  //   setAnchorEl3(null);
  // };

  return (
    <div className="Fundo">
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <div className="Logo"></div>
          <a href="/" className="a-not-effect">
            <img src={Logo} className="logo" alt="" />
          </a>
        </Grid>
        <Grid
          item
          xs={6}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            id="fade-button"
            className="btnMenu"
            aria-controls={open3 ? "fade-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open3 ? "true" : undefined}
            onClick={handleClick3}
          >
            Home
          </Button>
          <Button
            id="fade-button"
            className="btnMenu"
            aria-controls={open ? "fade-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            Métricas
          </Button>
          <Menu
            id="fade-menu"
            MenuListProps={{
              "aria-labelledby": "fade-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
          >
            <MenuItem onClick={handleClose}>Energia</MenuItem>
            <MenuItem onClick={handleClose}>Horas Ligadas</MenuItem>
            <a href="/dash" className="a-not-effect">
              <MenuItem onClick={handleClose}>Temperatura</MenuItem>
            </a>
          </Menu>
          <Button
            id="fade-button"
            className="btnMenu"
            aria-controls={open2 ? "fade-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open2 ? "true" : undefined}
            onClick={handleClick2}
          >
            Automação
          </Button>
          <Menu
            id="fade-menu"
            MenuListProps={{
              "aria-labelledby": "fade-button",
            }}
            anchorEl={anchorEl2}
            open={open2}
            onClose={handleClose2}
            TransitionComponent={Fade}
          >
            <a href="/mapa" className="a-not-effect">
              <MenuItem onClick={handleClose2}>Mapa</MenuItem>
            </a>
            <MenuItem onClick={handleClose2}>Postes</MenuItem>
            <MenuItem onClick={handleClose2}>Programação</MenuItem>
            <a href="/ativos" className="a-not-effect">
              <MenuItem onClick={handleClose2}>Ativos</MenuItem>
            </a>
          </Menu>
        </Grid>
      </Grid>
      <div className="descHome">
        <Grid
          container
          spacing={15}
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Grid item xs={4} container justifyContent="flex-end">
            <img src={Icon1} className="iconPage" alt="" />
          </Grid>
          <Grid item xs={8}>
            <Grid item xs={12}>
              <h2 className="titulo">Ativos</h2>
            </Grid>
            <Grid item xs={12}>
              <h4 className="desc">
                Conectar os ativos por forma remota <br />
                controlando sua iniciação e desligamento.
              </h4>
            </Grid>
          </Grid>
        </Grid>
        <div className="descLazer">
          <Grid
            container
            spacing={15}
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Grid item xs={4} container justifyContent="flex-end">
              <img src={Icon2} className="iconPage" alt="" />
            </Grid>
            <Grid item xs={8}>
              <Grid item xs={12}>
                <h2 className="titulo">Áreas de Lazer</h2>
              </Grid>
              <Grid item xs={12}>
                <h4 className="desc">
                  Controlar iluminação de ativos, banheiros <br />e
                  churrasqueira.
                </h4>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}
