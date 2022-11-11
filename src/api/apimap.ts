import axios from "axios";

const useApi = () => {
    const sendRequest = async (url: string) => {
        return await axios.get(url).then(({ data }) => data).catch(() => undefined);
    }

    return { sendRequest };
}
export default useApi;