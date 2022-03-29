import axios from "axios";

export default async function Post(
    url: string,
    body: FormData,
    headers:Record<string, unknown> = {}
    ): Promise<any>{
    try {
        const axiosInstance = axios.create({});

        const response: Response = await axiosInstance.post(url, body, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...headers
            }
        });
        return response;
    } catch (e) {
        throw new Error(e);
    }
}
