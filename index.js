const express = require("express");
const connectMongoDB = require('./Connection');
const dotenv = require("dotenv");
const URL = require("./models/url");
const path = require("path")
const staticRouter = require("./routes/staticrouter")
const router = require('./routes/url');
const userRouter = require("./routes/user")
const cookieParser = require("cookie-parser")
const {restrictToLoggedinUserOnly, checkAuth} = require('./middlewares/Auth')

dotenv.config();
const app = express();
const PORT = 8001;
const MONGO_URL = process.env.MONGO_URL;

connectMongoDB(MONGO_URL)
    .then(() => {
        console.log('MongoDB Connected');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
    
app.set("view engine", "ejs");
app.set("views", path.resolve('./views'));

app.use('/',checkAuth, staticRouter)
app.use("/url",restrictToLoggedinUserOnly, router);
app.use('/user',userRouter)

app.get('/:shortID', async (req, res) => {
    const shortID = req.params.shortID;
    const entry = await URL.findOneAndUpdate(
        { shortID },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now()
                }
            }
        }
    );

    if (entry) {
        res.redirect(entry.redirectURL);
    } else {
        res.status(404).json({ error: "Short URL not found" });
    }
});

app.listen(PORT, () => {
    console.log(`Server started at PORT ${PORT}`);
});