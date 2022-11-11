import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Adm from "./pages/Adm";
import Home from "./pages/Home";
import Mapa from "./pages/Mapa";
import Ativos from "./pages/Ativos"
import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Grupos";



export default function RoutesComponent(){
    function RequireAuth({ el }: { el: React.ReactNode }){
        // const location = useLocation();
        // const { authenticated, authenticatedLoading } = useContext(AuthContext);
        
        // if(authenticatedLoading) return <></>;
        // if(!authenticated) return <Navigate to="/" state={{ from: location }} replace />;

        return <Adm>{el}</Adm>
    }
    return(
        <Routes>
            <Route path={`/`} element={ <Home/> } />
            <Route path={`/mapa`} element={ <RequireAuth el={ <Mapa/> } /> } />
            <Route path={`/dash`} element={ <RequireAuth el={ <Dashboard/> } /> } />
            <Route path={`/ativos`} element={ <RequireAuth el={ <Ativos/> } /> } />
            <Route path={`/grupos`} element={ <RequireAuth el={ <Groups/> } /> } />
            <Route path={`*`} />
        </Routes>
    );
}