import Navbar from "./components/layout/Navbar.jsx";
import MovieDetailsPage from "./pages/MovieDetailsPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import {Route, Router, Routes} from "react-router-dom";

function App() {
    return (
        <main>
            <div className="pattern "/>
            <Navbar/>

            <div className="wrapper ">
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/movie/:id" element={<MovieDetailsPage/>}/>
                </Routes>
            </div>
        </main>
    );
}

export default App;