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

const DATA_URL = "https://devtest.teskalabs.com/data";
const SEARCHABLE_FIELDS = ["username", "email", "address"];

function parsePositiveInt(value, fallback) {
	const parsed = Number.parseInt(value, 10);
	return parsed > 0 ? parsed : fallback;
}

function compareText(left, right) {
	return String(left ?? "").localeCompare(String(right ?? ""));
}

function compareTimestamp(left, right) {
	const leftTimestamp = Number(left);
	const rightTimestamp = Number(right);

	if (Number.isNaN(leftTimestamp) || Number.isNaN(rightTimestamp)) {
		return compareText(left, right);
	}

	return leftTimestamp - rightTimestamp;
}

const SORTERS = {
	username: (left, right) => compareText(left.username, right.username),
	email: (left, right) => compareText(left.email, right.email),
	created: (left, right) => compareTimestamp(left.created, right.created),
	last_sign_in: (left, right) => compareTimestamp(left.last_sign_in, right.last_sign_in),
};

function getActiveSort(params = {}) {
	const sortParam = Object.entries(params).find(([key, direction]) => {
		const field = key.slice(1);
		return key.startsWith("s") && direction && SORTERS[field];
	});

	if (!sortParam) return null;

	const [key, direction] = sortParam;
	return {
		field: key.slice(1),
		direction,
	};
}

function applyTableParams(rows, params = {}) {
	const page = parsePositiveInt(params.p, 1);
	const pageSize = parsePositiveInt(params.i, 10);
	const filter = params.f?.trim().toLowerCase();

	let processedRows = rows;

	if (filter) {
		processedRows = processedRows.filter(row =>
			SEARCHABLE_FIELDS.some(field =>
				String(row[field] ?? "").toLowerCase().includes(filter)
			)
		);
	}

	const activeSort = getActiveSort(params);
	if (activeSort) {
		const sorter = SORTERS[activeSort.field];
		processedRows = [...processedRows].sort((left, right) => {
			const result = sorter(left, right);
			return activeSort.direction === "d" ? -result : result;
		});
	}

	const count = processedRows.length;
	const start = (page - 1) * pageSize;

	return {
		count,
		rows: processedRows.slice(start, start + pageSize),
	};
}

async function loadRows({ params }) {
	const response = await axios.get(DATA_URL);

	return applyTableParams(response.data.data ?? [], params);
}

const Header = ({ children }) => {
	return	(
		<div className="flex-fill">
			<h3>
				{children}
			</h3>
		</div>
	)
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

	return (
		<Container className="h-100 py-3">
			<Header>
				<i className="bi bi-people-fill pe-2"></i>
				{t("Training|Users")}
			</Header>
			<DataTableCard2
				columns={columns}
				loader={loadRows}
				header={<DataTableFilter2 />}
				initialLimit={10}
			/>
		</Container>
	);
}
