import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = "https://user1719412282323.requestly.tech"; // Reemplaza con la URL de tu API
//https://user1719412282323.requestly.tech

// Interceptor para registrar las solicitudes
axios.interceptors.request.use((request) => {
  console.log("Starting Request", JSON.stringify(request, null, 2));
  return request;
});

// Interceptor para registrar las respuestas
axios.interceptors.response.use(
  (response) => {
    console.log("Response:", JSON.stringify(response, null, 2));
    return response;
  },
  (error) => {
    console.log("Error Response:", JSON.stringify(error.response, null, 2));
    return Promise.reject(error);
  }
);

export const register = async (
  name: string,
  email: string,
  password: string,
  age: number,
  gender: string
) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
      age,
      gender,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al registrar");
  }
};

/*export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`https://user1719412282323.requestly.tech/login`, {
      email,
      password,
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const { token, user } = response.data.data;
    await SecureStore.setItemAsync('token', token);
    return user;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
  }
};*/
const delayTest = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `https://requestly.tech/api/mockv2/login?username=user1719412282323`,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        maxRedirects: 5, 
      }
    );
    //console.log("Response:", response); 

    const { token, user } = response.data.data;
    await SecureStore.setItemAsync("token", token);
    await delayTest(3000);

    return user;
  } catch (error: any) {
    console.error("Error Response:", error.response); 

    if (error.response) {
      if (error.response.status === 401) {
        throw new Error("AUTHENTICATION_ERROR");
      }
    } else {
      throw new Error("NETWORK_ERROR");
    }
  }
};

export const logout = async () => {
  await SecureStore.deleteItemAsync("token");
};
