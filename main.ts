import { APP_CONFIG } from './config';
import { AgencyServer } from './src/agency_service/server';
import { AgencyServiceProvider } from './src/agency_service/provider';

const SERVER = new AgencyServer(AgencyServiceProvider.createProvider());
SERVER.route();
SERVER.on("startup", (port) => {
    console.log("server run on port " + port);
});

SERVER.run(APP_CONFIG.PORT);
