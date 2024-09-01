import mg from 'mongoose';
import dotenv  from 'dotenv';

const { connect, connection } = mg;
dotenv.config();

export default async function mongo() {    
    const db = await connect(process.env.MONGO_URI+process.env.MONGO_DB);
    return db;
}

connection.on('error', (error) => {
    console.error.bind(console, 'connection error:', error)
});

connection.once('open', () => {
    console.log('Connected to MongoDB');
})

connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

connection.on('connected', () => {
    console.log('MongoDB connected');
});

