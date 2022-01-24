import { HashRouter, Routes, Route } from "react-router-dom";
import PlayingTable from '../components/pages/PlayingTable';
import Home from '../components/pages/Home';
import CreateTable from '../components/pages/CreateTable';

export const Router = () => {
    return(
        <HashRouter>
            <Routes>
                <Route path="playing/:tableId" element={<PlayingTable />} />
                <Route path="generate-table" element={<CreateTable />} />
                <Route path="/" element={<Home />}/>
            </Routes>
        </HashRouter>
    )
}