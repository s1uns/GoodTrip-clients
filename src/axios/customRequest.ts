import axios, { AxiosRequestConfig } from "axios";

import { useUserStore } from "../store/userStore";
import { ServerResponse } from "../shared/types/ServerResponse";

axios.defaults.withCredentials = true;
const apiURl = process.env.REACT_APP_API_URL;

const customRequest = async <TData, TResponse>(
	method: string,
	url: string,
	data?: TData,
): Promise<ServerResponse<TResponse>> => {
	try {
		const config: AxiosRequestConfig = {
			method,
			url: `${apiURl}${url}`,
			data,
		};

		const response = await axios(config);
		return response.data as ServerResponse<TResponse>;
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				if (error.response.status === 401) {
					useUserStore.getState().logout();
				}

				return {
					code: error.response.data.code,
					message:
						error.response.data.message ||
						"Couldn't send your request, try again later",
					success: false,
				} as ServerResponse<TResponse>;
			}
		}

		return {
			code: 500,
			message: "Couldn't send your request, try again later",
			success: false,
		} as ServerResponse<TResponse>;
	}
};

export default customRequest;

