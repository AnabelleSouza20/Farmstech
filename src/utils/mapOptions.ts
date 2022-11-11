import { AuthenticationType, AuthenticationOptions } from 'azure-maps-control';
const option: AuthenticationOptions = {
    authOptions: {
        authType: AuthenticationType.subscriptionKey,
        subscriptionKey: "gEsl1QnuuampM1x3yMlRiBiqMSUoiesXKa5EVflrhWo"
    },
    center: [-100.01, 45.01],
    zoom: 2,
    view: 'Auto',
    showLogo: false,
    style: 'satellite_road_labels',
    language: 'pt-BR'

};
export default option;