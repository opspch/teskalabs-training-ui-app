import React from "react";
export function DetailRow({ label, children }) {
	return (
		<div className="row py-2 border-bottom">
			<span className="col-sm-3 mb-0 text-body-secondary fw-bold ">{label}</span>
			<span className="col-sm-9 mb-0">{children}</span>
		</div>
	);
}