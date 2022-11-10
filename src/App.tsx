import { BrowserRouter } from "react-router-dom";
import { AzureMapsProvider } from 'react-azure-maps';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Theme from './theme';
import RoutesComponent from "./RoutesComponent";


const App = () => {
	return (
		<BrowserRouter>

			<ToastContainer
				position="top-right"
				autoClose={8000}
				hideProgressBar={false}
				pauseOnHover={false}
				closeOnClick
				draggable
				theme="colored"
			/>
			<Theme>
				<AzureMapsProvider>
					<RoutesComponent />
				</AzureMapsProvider>
			</Theme>

		</BrowserRouter>
	);
}
export default App;