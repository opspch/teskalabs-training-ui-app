import React from 'react';
import { Container } from 'reactstrap';
import {
	DataTableCard2,
	DataTableFilter2,
	DateTime,
} from "asab_webui_components";
import { Link } from "react-router";
import { useTranslation } from 'react-i18next';
import axios from 'axios';

async function loadRows({ params }) {
	const response = await axios.get("https://devtest.teskalabs.com/data", {
		params, // includes p, i, f, s<field>, a<field>, etc.
	});

	return {
		count: response.data.count,
		rows: response.data.data, // backend returns `data`, DataTableCard2 expects `rows`
	};
}


export function TableScreen() {
	const { t } = useTranslation();

	const columns = [
		{
			title: t("Training|Username"),
			sort: "username",
			render: ({ row }) => (
				<Link to={`/detail/${row.id}`} title={row.id}>
					{row.username}
				</Link>
			),
		},
		{
			title: "Email",
			sort: "email",
			render: ({ row }) => row.email,
		},
		{
			title: t("Training|Created"),
			sort: "created",
			render: ({ row }) => <DateTime value={row.created} />,
		},
		{
			title: t("Training|Last sign in"),
			sort: "last_sign_in",
			render: ({ row }) => <DateTime value={row.last_sign_in} />,
		},
		{
			title: t("Training|Address"),
			render: ({ row }) => row.address,
		},
	];

	const Header = () => {
		return	(
			<div className="flex-fill">
				<h3>
					<i className="bi bi-people-fill pe-2"></i>
					{t("Training|Users")}
				</h3>
			</div>
		)
	}

	return (
		<Container className="h-100 py-3">
			<Header></Header>
			<DataTableCard2
				columns={columns}
				loader={loadRows}
				header={<DataTableFilter2 />}
				initialLimit={10}
			/>
		</Container>
	);
}
