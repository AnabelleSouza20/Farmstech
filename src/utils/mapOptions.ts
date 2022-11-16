import { AuthenticationType, AuthenticationOptions } from 'azure-maps-control';


const option: AuthenticationOptions = {
    authOptions: {
        authType: AuthenticationType.subscriptionKey,
        subscriptionKey: "gEsl1QnuuampM1x3yMlRiBiqMSUoiesXKa5EVflrhWo"
    },
    view: 'fly',
    showLogo: false,
    style: 'satellite_road_labels',
    language: 'pt-BR'

};
export default option;