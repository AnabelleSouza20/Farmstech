import { AuthenticationType, AuthenticationOptions } from 'azure-maps-control';
import { Zoom } from 'react-toastify';
import { PoleProps } from '../_types';


const option: AuthenticationOptions = {
    authOptions: {
        authType: AuthenticationType.subscriptionKey,
        subscriptionKey:"gEsl1QnuuampM1x3yMlRiBiqMSUoiesXKa5EVflrhWo"
    },
    view: 'fly',
    showLogo: false,
    style: 'satellite_road_labels',
    language: 'pt-BR',
    zoom: 17,
    
};
export default option;