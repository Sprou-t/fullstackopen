
const config = require("./utils/config");
const logger = require("./utils/logger");
const app = require('./app') 
// app comes from app.js which is equipped w express and all the middleware
//used for this proj 



app.listen(config.PORT, () => {
	logger.info(`Server running on port ${config.PORT}`);
});
