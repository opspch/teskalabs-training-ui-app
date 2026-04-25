import { Module } from "asab_webui_components";
import { DetailScreen } from "./DetailScreen.jsx";
import { TableScreen } from './TableScreen.jsx';

export default class TableApplicationModule extends Module {
	constructor(app, name) {
		super(app, "TableApplicationModule");

		app.Router.addRoute({
			path: "/",
			end: false,
			name: 'Table',
			component: TableScreen,
		});

		app.Router.addRoute({
			path: "/detail/:id",
			end: true,
			name: "Detail",
			component: DetailScreen,
		});

		app.Navigation.addItem({
			name: "Table",
			icon: 'bi bi-table',
			url: "/",
		});
	}
}
