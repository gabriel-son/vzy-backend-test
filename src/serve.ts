import { App } from "@config/index";
import app from "./server";

app.listen(App.webserver.port, () => {
	console.info(`${App.name} listening at ${App.webserver.port}`);
});
