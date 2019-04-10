import { APP_CONFIG } from './config';
import { AgencyServer } from './src/agency_service/server';

const SERVER = new AgencyServer();
SERVER.route();
SERVER.on("startup", (port) => {
    console.log("server run on port " + port);
});

SERVER.run(APP_CONFIG.PORT);
