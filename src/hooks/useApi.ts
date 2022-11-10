import axios, { AxiosResponse, AxiosError, Method, CreateAxiosDefaults } from "axios";
import { toast } from "react-toastify";

export type useApiProps<DataProps = any> = {
    requestError: boolean
    data?: DataProps
    status?: number
    
    code?: string
    message?: string
}
const useApi = () => {
    const getHeaders = () => {
        const accessToken = localStorage.getItem('Authorization');
        return {
            'Content-Type': 'application/json', 
            ...(accessToken && {
                "access-token": JSON.parse(accessToken)
            })
        };
    }
    const getBaseURL = () => {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            return `${process.env.REACT_APP_URL_API_PROTOCOL}//${process.env.REACT_APP_URL_API_HOST}${process.env.REACT_APP_URL_API_PORT}`;
        } else {
            return `${document.location.protocol}//${document.location.hostname}${process.env.REACT_APP_URL_API_PORT}`;
        }
    }
    const getDefaultAxiosCreateProps = (): CreateAxiosDefaults => {
        return {
            baseURL: getBaseURL(),
            timeout: Number(process.env.REACT_APP_DEFAULT_TIMEOUT_REQUEST),
            responseType: "json",
            headers: getHeaders()
        }
    }
    /**
     * @params router: API router path
     * @params method: HTTP Request Method
     * @params params: Parameters you want to send to the api
     * @params showMessageError: If true, it will show a message if the request has an error
     * @params axiosOptions: Options for creating the axios instance (import { CreateAxiosDefaults } from axios)
     */
    async function sendRequest<DataProps = any|undefined, ParamsProps = any|undefined>(router: string, method: Method, params?: ParamsProps, showMessageError: boolean=true, axiosOptions?: CreateAxiosDefaults): Promise<useApiProps<DataProps> | undefined>{
        const INSTANCE = axios.create(axiosOptions || getDefaultAxiosCreateProps());
        
        return await INSTANCE.request({
            url: router,
            data: params,
            method: method,
        })
        .then(({ data, status }: AxiosResponse): useApiProps<DataProps> => ({ status, data, requestError: false }))
        .catch(({ code, message, response }: AxiosError): useApiProps<DataProps> => {
            return {
                code,
                message,
                data: response?.data as DataProps,
                status: response?.status,
                requestError: true
            }
        })
        .then((response: useApiProps<DataProps>) => {
            if(response.requestError && showMessageError){
                try{
                    const messageError = `${response.code && `[${response.code}]`}[${response.message}]`;
                    toast.error(`Aconteceu um imprevisto durante a execução da requisição: "${messageError}"`);
                }catch(err){  }
            }else
            return response;
        });
    }

    return sendRequest;
}

export default useApi;