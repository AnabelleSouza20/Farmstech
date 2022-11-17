import { AuthenticationType, AuthenticationOptions } from 'azure-maps-control';
import { Options } from 'azure-maps-control';

const mapOptions: Options = {
    style: 'satellite',
    authOptions: {
        authType: AuthenticationType.subscriptionKey,
        subscriptionKey: 'gEsl1QnuuampM1x3yMlRiBiqMSUoiesXKa5EVflrhWo'
    } as AuthenticationOptions,
};




export default mapOptions;