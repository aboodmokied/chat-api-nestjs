import { Socket } from "socket.io";

export type AuthorizedSoket=Socket & {userId:string};
