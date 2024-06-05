// @ts-nocheck

import Axios from "axios";

// Immediately-invoked function to determine if we are server-side
const isServerSide = typeof window === "undefined";

const axios = Axios.create({
  baseURL: "http://139.59.91.252/api/v1",
  // withCredentials: true,
});

if (isServerSide) {
  // Only import the `cookies` module server-side to prevent issues during build
  // const { cookies } = require("next/headers");
  // Attach the interceptor only server-side
  // axios.interceptors.request.use(
  //   (config) => {
  //     // Try to get the JWT from the cookies
  //     const jwt = localStorage.getItem("jwt");
  //     // If there is a JWT, add the Authorization header
  //     if (jwt) {
  //       config.headers.Authorization = `Bearer ${jwt}`;
  //     }
  //     return config;
  //   },
  //   (error) => {
  //     return Promise.reject(error);
  //   },
  // );
}

export default axios;
