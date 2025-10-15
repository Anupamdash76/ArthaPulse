import { Routes, Route } from "react-router-dom";
import Exchanges from './components/Exhanges';
import Coins from './components/Coins';
import CoinDetails from './components/CoinDetails';
import Layout from './components/Layout'; // Import the new Layout

function App() {
  return (
    <Routes>
      {/* The Layout component now wraps all your pages */}
      <Route path='/' element={<Layout />}>
        <Route index element={<Exchanges />} /> {/* Home page */}
        <Route path='coins' element={<Coins />} />
        <Route path='coins/:id' element={<CoinDetails />} />
      </Route>
    </Routes>
  );
}

export default App;