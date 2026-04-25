import React from "react";
import { useParams } from "react-router";

export function DetailScreen() {
	const { id } = useParams();

	return (
		<div>
			Detail for: {id}
		</div>
	);
}