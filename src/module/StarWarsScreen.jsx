import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router";
import { Alert, Card, CardBody, CardHeader, Container, Spinner } from "reactstrap";
import { DateTime } from "asab_webui_components";
import { DetailRow } from "../components/DetailRow";
import axios from 'axios';

export function StarWarsScreen() {
    const { t } = useTranslation();
    
	const [data, setData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const controller = new AbortController();

		async function loadData() {
			setIsLoading(true);
			setError(null);

			try {
				const response = await axios.get(
					`https://swapi.info/api/films`,
					{ signal: controller.signal }
				);

				setData(response.data);
			} catch (e) {
				if (e.name !== "CanceledError") {
					setError(e);
				}
			} finally {
				setIsLoading(false);
			}
		}

		loadData();

		return () => {
			controller.abort();
		};
	}, []);

	if (isLoading) {
		return <Spinner />;
	}

    if (error) {
        return <Alert color="danger">{t("Training|Failed to load data.")}</Alert>;
    }

    if (!data) {
        return <Alert color="warning">{t("Training|Data was not found.")}</Alert>;
    }

	return (
		<Container className="py-3">
            <Link to="/">{t("Training|Back to index")}</Link>

			{ data.map(ep =>
                <Card className="mt-3" key={ep.episode_id}>
                    <CardHeader>{ep.title}</CardHeader>
                    <CardBody>
                        <div className="mb-0">
                            <DetailRow label={t("Training|Episode number")}>{ep.episode_id}</DetailRow>
                            <DetailRow label={t("Training|Director")}>{ep.director}</DetailRow>
                            <DetailRow label={t("Training|Producer")}>{ep.producer}</DetailRow>
                            <DetailRow label={t("Training|Release Date")}><DateTime value={ep.release_date} dateTimeFormat="MMMM d, yyyy" /></DetailRow>
                            <DetailRow label={t("Training|Description")}>{ep.opening_crawl}</DetailRow>
                        </div>
                    </CardBody>
                </Card>
            )}
		</Container>
	);
}
