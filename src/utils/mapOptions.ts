import { AuthenticationType, AuthenticationOptions } from 'azure-maps-control';
import { Options } from 'azure-maps-control';

const mapOptions: Options = {
    authOptions: {
        authType: AuthenticationType.subscriptionKey,
        subscriptionKey: 'gEsl1QnuuampM1x3yMlRiBiqMSUoiesXKa5EVflrhWo'
    } as AuthenticationOptions,
    view: 'fly',
    showLogo: false,
    style: 'satellite_road_labels',
    language: 'pt-BR',
    zoom: 17,
};




export default mapOptions;