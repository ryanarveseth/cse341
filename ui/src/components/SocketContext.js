import React from "react";
import socketClient from "socket.io-client";

export const socket = socketClient.connect("/");

export const SocketContext = React.createContext();