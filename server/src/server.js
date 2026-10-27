import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';
import { ensureOwnerAccount } from './services/ownerBootstrap.js';
const port=Number(process.env.PORT||4000);
async function start(){
 if(!process.env.MONGODB_URI)throw new Error('MONGODB_URI is required');
 if(!process.env.JWT_SECRET||process.env.JWT_SECRET.length<32)throw new Error('JWT_SECRET must be at least 32 characters');
 await mongoose.connect(process.env.MONGODB_URI);
 await ensureOwnerAccount();
 const server=app.listen(port,'0.0.0.0',()=>console.log('Easy Life Tools API listening on '+port));
 const shutdown=()=>server.close(async()=>{await mongoose.disconnect();process.exit(0)});
 process.on('SIGTERM',shutdown);process.on('SIGINT',shutdown);
}
start().catch(e=>{console.error('Startup failed:',e.message);process.exit(1)});