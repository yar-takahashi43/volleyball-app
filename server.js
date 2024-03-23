const express = require("express")
const app = express()
const userRouter = require("./routes/users")
const authRouter = require("./routes/auth")
const postsRouter = require("./routes/posts")
const opponentRouter = require("./routes/opponent")
const matchRouter = require("./routes/match")
const playerRouter = require("./routes/player")
const PORT = 3000
const mongoose = require("mongoose")
require("dotenv").config()

// DBとの接続
mongoose
    .connect(process.env.MONGOURL)
    .then(() => {
        console.log("DBに接続しました。")
    })
    .catch((err) => {
        console.log(err)
    })

//ミドルウェアのルーティング設定
app.use(express.json())
app.use("/api/users", userRouter)
app.use("/api/auth", authRouter)
// app.use("/api/posts", postsRouter)
app.use("/api/opponent", opponentRouter)
app.use("/api/match", matchRouter)
app.use("/api/player", playerRouter)

app.get("/", (req, res) => {
    res.send("hello")
})

app.listen(PORT, () => console.log("サーバーが起動しました"))