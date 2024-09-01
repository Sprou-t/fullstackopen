import app from './app.js'
import { PORT } from "./utils/config.js";
import { info, error } from "./utils/logger.js";

// use the port defined in the environment variable PORT or
// port 3001 if the environment variable PORT is undefined
// const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
	info(`Server running on port ${PORT}`);
});
