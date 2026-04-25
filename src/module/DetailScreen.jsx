import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useTranslation } from 'react-i18next';
import { Alert, Card, CardBody, CardHeader, Container, Spinner } from "reactstrap";
import { DateTime } from "asab_webui_components";
import { DetailRow } from "../components/DetailRow";
import axios from 'axios';

export function DetailScreen() {
	const { id } = useParams();

    const { t } = useTranslation();
    
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
		return <Alert color="danger">{t("Training|Failed to load detail.")}</Alert>;
	}

	if (!detail) {
		return <Alert color="warning">{t("Training|Detail was not found.")}</Alert>;
	}

	return (
		<Container className="py-3">
			<Link to="/" className="fs-3">
                <i className="bi bi-arrow-left pe-2"></i>
                {t("Training|Back to table")}
            </Link>

			<Card className="mt-3">
				<CardHeader>{detail.username}</CardHeader>
				<CardBody>
					<div className="mb-0">
						<DetailRow label="ID">{detail.id}</DetailRow>
						<DetailRow label={t("Training|Username")}>{detail.username}</DetailRow>
						<DetailRow label="Email">{detail.email}</DetailRow>
						<DetailRow label={t("Training|Created")}><DateTime value={detail.created} /></DetailRow>
						<DetailRow label={t("Training|Last sign in")}><DateTime value={detail.last_sign_in} /></DetailRow>
						<DetailRow label={t("Training|Address")}>{detail.address}</DetailRow>
						<DetailRow label={t("Training|Phone number")}>{detail.phone_number}</DetailRow>
						<DetailRow label={t("Training|IP address")}>{detail.ip_address}</DetailRow>
						<DetailRow label={t("Training|MAC address")}>{detail.mac_address}</DetailRow>
					</div>
				</CardBody>
			</Card>
		</Container>
	);
}
