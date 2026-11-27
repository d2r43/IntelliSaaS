import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, getAuth } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';

const app = express()

app.use(clerkMiddleware())
app.use(cors())
app.use(express.json())

await connectCloudinary()

app.get('/', (req, res)=>res.send('Server is Live!'))

app.use((req, res, next) => {
    const { isAuthenticated } = getAuth(req)
    if (!isAuthenticated) {
        return res.status(401).json({ success: false, message: 'Unauthorized' })
    }
    next()
})

app.use('/api/ai', aiRouter)
app.use('/api/user', userRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log('Server is running on port', PORT);
})
