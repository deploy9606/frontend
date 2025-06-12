import React from "react";
import type { TenantRanking } from "../../../types";

interface TenantRankingTableProps {
	tenants: TenantRanking[];
	onTenantClick?: (tenant: TenantRanking) => void;
}

const TenantRankingTable: React.FC<TenantRankingTableProps> = ({
	tenants,
	onTenantClick,
}) => {
	return (
		<div>
			{onTenantClick && (
				<div className="mb-4">
					<p className="text-sm text-gray-500">
						💡 Click on any row to view detailed analysis
					</p>
				</div>
			)}
			<div className="overflow-x-auto">
				<table className="w-full table-auto">
					<thead>
						<tr className="bg-gray-50">
							<th className="px-4 py-2 text-left">Rank</th>
							<th className="px-4 py-2 text-left">Company</th>
							<th className="px-4 py-2 text-left">Score</th>
							<th className="px-4 py-2 text-left">Operations</th>
							<th className="px-4 py-2 text-left">Industry</th>
						</tr>
					</thead>
					<tbody>
						{tenants.slice(0, 20).map((tenant, index) => (
							<tr
								key={index}
								className={`border-b transition-colors ${
									onTenantClick ? "hover:bg-blue-50 cursor-pointer" : "hover:bg-gray-50"
								}`}
								onClick={() => onTenantClick?.(tenant)}
							>
								<td className="px-4 py-2 font-semibold">{index + 1}</td>
								<td className="px-4 py-2 font-medium text-blue-600">{tenant.company}</td>
								<td className="px-4 py-2">
									<div className="flex items-center">
										<div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
											<div
												className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
												style={{ width: `${tenant.score}%` }}
											></div>
										</div>
										<span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
											{tenant.score}/100
										</span>
									</div>
								</td>
								<td className="px-4 py-2 text-sm">{tenant.operations}</td>
								<td className="px-4 py-2 text-sm">{tenant.industryType}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default TenantRankingTable;
