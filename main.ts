import { APP_CONFIG } from './config';
import { Server } from './src/server';
new Server(true).listen(APP_CONFIG.PORT);
console.log("server listens on port " + APP_CONFIG.PORT);