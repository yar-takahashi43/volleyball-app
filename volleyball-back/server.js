const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const app = express()
const userRouter = require("./routes/users")
const authRouter = require("./routes/auth")
const opponentRouter = require("./routes/opponent")
const matchRouter = require("./routes/match")
const playerRouter = require("./routes/player")
const setRouter = require("./routes/set")
const scoreRouter = require("./routes/scores")
const verifyToken = require("./middleware/verifyToken")
const mongoose = require("mongoose")
// process.envはdotenvより下に書くこと
require("dotenv").config()

const isProduction = process.env.NODE_ENV === "production"
const PORT = process.env.PORT || 5001
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000"

/**
 * CORS で許可するオリジンを決める。
 * 開発時は CRA が 127.0.0.1 で開くことがあるため、localhost と両方可にする。
 */
function resolveCorsOrigin() {
    if (isProduction) {
        return CLIENT_ORIGIN
    }
    return [
        CLIENT_ORIGIN,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
}

/**
 * JWT_SECRET を確定する。本番では未設定なら起動を止める。
 */
function resolveJwtSecret() {
    if (process.env.JWT_SECRET) {
        return process.env.JWT_SECRET
    }
    if (isProduction) {
        console.error("本番では JWT_SECRET の設定が必須です。起動を中止します。")
        process.exit(1)
    }
    console.warn("JWT_SECRET が未設定です。開発用の仮シークレットを使います。本番では必ず設定してください。")
    return "dev-insecure-jwt-secret-change-me"
}

process.env.JWT_SECRET = resolveJwtSecret()

if (!process.env.MONGOURL) {
    console.error("MONGOURL が未設定です。起動を中止します。")
    process.exit(1)
}

// DBとの接続
mongoose
    .connect(process.env.MONGOURL)
    .then(() => {
        console.log("DBに接続しました。")
    })
    .catch((err) => {
        console.log(err)
    })

// ミドルウェアのルーティング設定
app.use(helmet())
app.use(cors({
    origin: resolveCorsOrigin(),
}))
app.use(express.json())

// 認証は公開。それ以外の API は JWT 必須
app.use("/api/auth", authRouter)
app.use("/api/users", verifyToken, userRouter)
app.use("/api/opponent", verifyToken, opponentRouter)
app.use("/api/match", verifyToken, matchRouter)
app.use("/api/set", verifyToken, setRouter)
app.use("/api/scores", verifyToken, scoreRouter)
app.use("/api/player", verifyToken, playerRouter)

app.get("/", (req, res) => {
    res.send("hello")
})

app.listen(PORT, () => console.log(`サーバーが起動しました (PORT: ${PORT})`))
