export function convertToCSV<T extends object>(data: T[]): string {
	if (!data.length) return "";

	const headers = Object.keys(data[0]);
	const rows = data.map((row) =>
		headers.map((field) => {
			const value = row[field as keyof T];
			return `"${String(value ?? "").replace(/"/g, '""')}"`;
		})
	);

	return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export function downloadCSV(csvString: string, filename: string): void {
	const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.setAttribute("download", filename);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}