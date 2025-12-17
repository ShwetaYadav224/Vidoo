import { Server } from "socket.io";
let connections = {}
let messages = {}
let timeOnline = {}

export const connectToSocket = (server) => {
    const io = new Server(server);
    io.on("connection", (socket) => {
        socket.on("accept-call", (path) => {


        })
        socket.on("join-call", (path) => {
            if (connections[path] === undefined) {
                connections[path].push(socket.id)
            }
        })
        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message)

        })
        socket.on("chat-message", (data, sender) => {
            const [matchingRoom, found] = Object.entries(connections).reduce(([room, isFound], [roomKey, roomValue]) => {
                if (!isFound && roomValue.includes(socket.id)) {
                    return [roomKey, true]
                }
                return [room, isFound]
            }, ["", false])
            if (found === true) {
                if (messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = []
                }
                messages[matchingRoom].push({
                    ' sender': sender,
                    'data': data,
                    'socket-id-sender': socket.id
                })
                console.log("message", key, ":", sender, data);
                connections[matchingRoom].forEach((id) => {
                    io.to(elem).emit("chat-message", data, sender, socket.id)

                })

                io.to(matchingRoom).emit("chat-message", data, socket.id)
            }
        })
        socket.on("disconnect", () => {
            var diffTime = Math.abs(timeOnline[socket.id] - Date.now())
            var key
            for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
                for (let a = 0; a < v.length; ++a) {
                    if (v[a] === socket.id) {
                        key = k
                        for (let a = 0; a < connections[key].length; ++aa) {
                            io.to(connections[key][a]).emit("user-left", socket.id)
                        }
                        var index = connections[key].indexOf(socket.id)
                        connections[key].splice(index, 1)
                        if (connections[key].length === 0) {
                            delete connections[key]
                        }
                    }
                }
            }
            console.log("diffTime", diffTime);

        })
    })
}
return io;
