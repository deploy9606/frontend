import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/common/Navigation";
import TenantResearch from "./components/tenant-research/TenantResearch";
import CapRateCalculator from "./components/cap-rate/CapRateCalculator";

function App() {
	return (
		<Router>
			<div className="min-h-screen gradient-bg">
				<Navigation />
				<Routes>
					<Route path="/" element={<TenantResearch />} />
					<Route path="/tenant-research" element={<TenantResearch />} />
					<Route path="/cap-rate" element={<CapRateCalculator />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
