import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

//load environment variales
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//niddleware
app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
}));

//health Check Route
app.get('api/health', (req,res) => {
    res.json({status:'ok', message: 'Guild Code backend is running!'});
});

//start server
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})