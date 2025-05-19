import express from "express";
import logger from "./logger.js";
import morgan from "morgan";

const app = express();
const port = 3000;
const morganFormat = ":method :url :status :response-time ms";

// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });

// app.get("/ice-tea", (req, res) => {
//     res.send("What ice team would you prefer?");
// });

// app.get("/twitter", (req, res) => {
//     res.send("fabian-gobet");
// });

app.use(
    morgan(morganFormat, {
        stream: {
            write: (message) => {
                const logObject = {
                    method: message.split(" ")[0],
                    url: message.split(" ")[1],
                    status: message.split(" ")[2],
                    responseTime: message.split(" ")[3],
                };
                logger.info(JSON.stringify(logObject));
            },
        },
    })
);

app.use(express.json());

let teaData = [];
let nextId = 1;

app.post("/teas", (req, res) => {
    const { name, price } = req.body;
    const newTea = { id: nextId++, name, price };
    teaData.push(newTea);
    res.status(201).send(newTea);
});

app.get("/teas", (req, res) => {
    res.status(200).send(JSON.stringify(teaData));
});

app.get("/teas/:id", (req, res) => {
    const tea = teaData.find((t) => t.id === parseInt(req.params.id));
    if (!tea) {
        return res.status(404).send("Tea not found");
    } else {
        return res.status(200).send(tea);
    }
});

app.listen(port, () => {
    console.log(`Server is running at port ${port}...`);
});
