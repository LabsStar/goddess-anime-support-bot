import express from 'express';
const app = express();
import logger from '../utils/logger';

app.set("trust proxy", 1);
app.use((req, res, next) => {
    res.setHeader("X-Powered-By", "Hyperstar");
    next();
});




function webServer() {

    app.get("/", (req, res) => {
        res.status(200).send("Goddess Anime support bot is online!");
    });


    app.listen(process.env.PORT || 80, () => {
        logger.info(`Goddess Anime is listening at http://localhost:${process.env.PORT || 80}`);

    });
}

export default webServer;
