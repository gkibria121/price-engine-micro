// utils/customAxios.ts
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export async function customAxios<T = unknown>(
  path: string,
  options: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
    },
  }
): Promise<AxiosResponse<T>> {
  // Check if window is undefined (server-side)
  const isServer = typeof window === "undefined";

  // Base URL depending on environment
  const baseURL = isServer
    ? "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local"
    : "";

  // Compose full URL
  const url = baseURL + `${process.env.NEXT_PUBLIC_API_URL}${path}`;

  const { method = "GET", data = undefined, headers = {}, ...rest } = options;
  const serverHeaders = isServer
    ? {
        Host: process.env.NEXT_PUBLIC_HOST_NAME,
      }
    : {};

  try {
    const response = await axios.request<T>({
      url,
      method,
      data,
      headers: {
        ...headers,
        ...serverHeaders,
      },
      ...rest,
    });

    return response;
  } catch (error) {
    throw error;
  }
}
