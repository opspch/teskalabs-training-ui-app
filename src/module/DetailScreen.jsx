import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { Alert, Card, CardBody, CardHeader, Container, Spinner } from "reactstrap";
import { DateTime } from "asab_webui_components";
import axios from 'axios';

function DetailRow({ label, children }) {
	return (
		<div className="row py-2 border-bottom">
			<span className="col-sm-3 mb-0 text-body-secondary fw-bold ">{label}</span>
			<span className="col-sm-9 mb-0">{children}</span>
		</div>
	);
}

export function DetailScreen() {
	const { id } = useParams();

	const [detail, setDetail] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const controller = new AbortController();

		async function loadDetail() {
			setIsLoading(true);
			setError(null);

			try {
				const response = await axios.get(
					`https://devtest.teskalabs.com/detail/${id}`,
					{ signal: controller.signal }
				);

				setDetail(response.data);
			} catch (e) {
				if (e.name !== "CanceledError") {
					setError(e);
				}
			} finally {
				setIsLoading(false);
			}
		}

		loadDetail();

		return () => {
			controller.abort();
		};
	}, [id]);

	if (isLoading) {
		return <Spinner />;
	}

	if (error) {
		return <Alert color="danger">Failed to load detail.</Alert>;
	}

	if (!detail) {
		return <Alert color="warning">Detail was not found.</Alert>;
	}

	return (
		<Container className="py-3">
			<Link to="/">Back to table</Link>

			<Card className="mt-3">
				<CardHeader>{detail.username}</CardHeader>
				<CardBody>
					<div className="mb-0">
						<DetailRow label="ID">{detail.id}</DetailRow>
						<DetailRow label="Username">{detail.username}</DetailRow>
						<DetailRow label="Email">{detail.email}</DetailRow>
						<DetailRow label="Created"><DateTime value={detail.created} /></DetailRow>
						<DetailRow label="Last sign in"><DateTime value={detail.last_sign_in} /></DetailRow>
						<DetailRow label="Address">{detail.address}</DetailRow>
						<DetailRow label="Phone number">{detail.phone_number}</DetailRow>
						<DetailRow label="IP address">{detail.ip_address}</DetailRow>
						<DetailRow label="MAC address">{detail.mac_address}</DetailRow>
					</div>
				</CardBody>
			</Card>
		</Container>
	);
}
