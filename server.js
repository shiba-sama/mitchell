import path, { dirname } from "path"
import { fileURLToPath } from "url"
import fs from "fs"
import express from "express"
import morgan from "morgan"
import { nanoid } from "nanoid"

// —————————————————————————————————————————————————————————————————————————————
// Express Configuration

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PORT = 8080
const app = express()

// —————————————————————————————————————————————————————————————————————————————
// Middleware

function unique_id(req, __, next) {
   req.id = nanoid(36)
   next()
}

const stream = fs.createWriteStream(path.join(__dirname, "log.txt"), { flags: "a" })

morgan.token("id", req => req.id)
app.use(morgan(":id :method :url :response-time :remote-addr", { stream, }))

app.use(express.json())
app.use(unique_id)
app.use("/", express.static(path.join("dist")))

// —————————————————————————————————————————————————————————————————————————————
// Routes

app.get("/test", (__, res) => res.send("Hi."))

// —————————————————————————————————————————————————————————————————————————————
// Serve

app.listen(PORT, () => {
   console.log(`Server listening at port:${PORT}`)
});