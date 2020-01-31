const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const slugify = require("slugify");

const Board = require("./board.js");
const BoardList = require("./boardList.js");
const boardList = new BoardList();

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(express.json());

app.post("/boards", (req, res) => {
  const { boardName } = req.body;
  const slug = slugify(boardName, {
    lower: true
  });
  const board = new Board(boardName, slug);
  boardList.addBoard(board);
  const dir = boardList.getDirectory();
  io.emit("update-directory", dir);
  res.send(slug);
});

app.get("/directory", (req, res) => {
  const dir = boardList.getDirectory();
  res.send(dir);
});

// const boardManager = {
//   boards: [],
//   addBoard(boardName) {
//     const newBoard = {
//       name: boardName,
//       strokes: [],
//       users: []
//     };
//     this.boards.push(newBoard);
//   },
//   getBoardNames() {
//     const names = this.boards.map(brd => brd.name);
//     return names;
//   },
//   getBoardByName(boardName) {
//     return this.boards.find(brd => brd.name === boardName);
//   },
//   clearBoardByName(boardName) {
//     this.getBoardByName(boardName).strokes = [];
//   },
//   addUser({ user, boardName }) {
//     const board = this.getBoardNames(boardName);
//     board.users.push(user);
//   }
// };

// const userManager = {
//   users: [],
//   createUser(user) {
//     this.users.push(user);
//   },
//   removeUser(id) {
//     const filteredUsers = this.users.filter(user => user.id !== id);
//     this.users = filteredUsers;
//   },
//   joinBoard({ id, boardName }) {
//     const user = this.findUser(id);
//     if (user) {
//       user.board = boardName;
//     }
//   },
//   leaveBoard(id) {
//     const user = this.findUser(id);
//     if (user) {
//       user.board = undefined;
//     }
//   },
//   findUser(id) {
//     return this.users.find(user => user.id === id);
//   }
// };

// io.on("connection", socket => {
//   console.log("connect");
//   //   socket.emit("checkForLogin");
//   socket.on("createUser", userName => {
//     console.log("create", userName);
//     // userManager.createUser({ id: socket.id, name: userName });
//     // console.log(userManager.users);
//   });

//   socket.on("disconnect", () => {
//     userManager.removeUser(socket.id);
//     console.log("disconnection", userManager.users);
//     io.emit("updatedUsers", userManager.users);
//   });

//   socket.on("leaveBoard", boardName => {
//     userManager.leaveBoard(socket.id);
//     socket.leave(boardName);
//     io.emit("updatedUsers", userManager.users);
//   });

//   socket.on("getBoardNames", cb => {
//     const boardNames = boardManager.getBoardNames();
//     cb(boardNames);
//   });

//   socket.on("newBoard", (newBoard, cb) => {
//     console.log(newBoard);
//     boardManager.addBoard(newBoard);
//     io.emit("newBoardCreated", newBoard);
//     // cb();
//   });

//   socket.on("joinBoard", ({ boardName, user }, cb) => {
//     const board = boardManager.getBoardByName(boardName);
//     if (board) {
//       socket.join(boardName);
//       board.users.push(user);
//       userManager.joinBoard({ id: socket.id, boardName });
//       io.emit("updatedUsers", userManager.users);

//       cb(undefined, board.strokes);
//     } else {
//       cb("error loading board", undefined);
//     }
//   });

//   socket.on("sendClearStrokes", (boardName, cb) => {
//     const board = boardManager.getBoardByName(boardName);
//     if (board) {
//       board.strokes = [];
//       socket.broadcast.to(boardName).emit("recieveClearStrokes");
//       cb(undefined);
//     } else {
//       cb("error clearing board");
//     }
//   });

//   socket.on("sendStroke", ({ stroke, boardName }, cb) => {
//     const board = boardManager.getBoardByName(boardName);
//     if (board) {
//       board.strokes.push(stroke);
//       socket.broadcast.to(boardName).emit("recieveStroke", stroke);
//       cb(undefined);
//     } else {
//       cb("Error writing to board");
//     }
//   });

//   socket.on("sendRemoveStroke", (boardName, cb) => {
//     const board = boardManager.getBoardByName(boardName);
//     if (board) {
//       boardManager.getBoardByName(boardName).strokes.pop();
//       socket.broadcast.emit("recieveRemoveStroke");
//       cb(undefined);
//     } else {
//       cb("Error editing board");
//     }
//   });
// });

server.listen(port, () => {
  console.clear();
  console.log(`Server is up on port ${port}!`);
});
