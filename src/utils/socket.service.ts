// import { FastifyInstance } from "fastify";
// import { Server } from "../server/server";
// import {Server as IoServer, Socket}from "socket.io";

// declare module "fastify"{
//     interface FastifyInstance{
//         io: IoServer
//     }
// }
// export class SocketService {
//     private server: FastifyInstance;
//     private _IO: IoServer;
//     constructor(){
//         this.server = Server.Instance.serverInstance;
//     }

//   /**
//    * to set user connection in connected user map with its user_id key
//    *
//    * @access public
//    * @since 1.1.0
//    * @author Abdul Karim Ansari
//    * @memberof socketService
//    * @param {Socket} socket
//    * @returns {void}
//    */

//   private async setUsersInMap(socket: Socket): Promise<void> {
//     try {
//     } catch (error) {
//       throw error;
//     }
//   }

//   /**
//    * to get socket connection of connected user from map
//    *
//    * @access public
//    * @since 1.1.0
//    * @author Abdul Karim Ansari
//    * @memberof socketService
//    * @param {number} userId
//    * @returns {Socket}
//    */

//   public getSocket(userId: number): Socket {
    
//     return {} as any;
//   }
//   /**
//    * initial function to called in server js to handel the new connection
//    *
//    * @access public
//    * @since 1.1.0
//    * @author Abdul Karim Ansari
//    * @memberof socketService
//    * @param {none}
//    * @returns {void}
//    */
//   public connectionHandler(): void {
//     this._IO.on("connection", (socket: Socket) => {
//       this.disconnectHandler(socket);
//       this.setUsersInMap(socket);
//     });
//   }
//   /**
//    * to handel disconnect event and delete user from map
//    *
//    * @access public
//    * @since 1.1.0
//    * @author Abdul Karim Ansari
//    * @memberof socketService
//    * @param {Socket} socket
//    * @returns {void}
//    */
//   public disconnectHandler(socket: Socket): void {
//     socket.on("disconnect", () => {});
//   }

//   /**
//    *  to emit an event in socket
//    *
//    * @access public
//    * @since 1.1.0
//    * @author Abdul Karim Ansari
//    * @memberof
//    * @param {string} event
//    * @param {unknown} data
//    * @returns {boolean}
//    */
//   public emit(userId: number, event: string, data: unknown): void {
//     const socket: Socket = this.getSocket(userId);
//     if (socket) {
//       socket.emit(event, data);
//     }
//   }
//   /**
//    *  to listen an event in socket
//    *
//    * @access public
//    * @since 1.1.0
//    * @author Abdul Karim Ansari
//    * @memberof
//    * @param {string} event
//    * @returns {any}
//    */
//   public listen(event: string, user_id: number): any {
//     const socket = this.getSocket(user_id);
//     return socket.on(event, (data) => {
//       return data;
//     });
//   }

//   // to set socket io server on fastify server ready
//   public set setServerInstance(server: FastifyInstance) {
//     this._IO = server.io;
//   }
// }