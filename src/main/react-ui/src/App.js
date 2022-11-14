import logo from './logo.svg';
import './App.scss';
import FormUser from "./components/FormUser";
import {BrowserRouter, Route, Router, Routes, useLocation} from "react-router-dom";
import Home from "./components/Home";
import {useSelector} from "react-redux";
import PrivateRoute from "./PrivateRoute";

function App() {
    const isAuthenticated = useSelector(state => state.isAuthenticated);

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>

                    <Route path="/register"
                           element={<FormUser title="SIGN UP" hideUsernameField={false} login={false}/>}/>
                    <Route path="/login" element={<FormUser title="LOGIN" hideUsernameField={true} login={true}/>}/>
                    <Route path="/home"
                           element={<PrivateRoute element={<Home/>} isAuthenticated={isAuthenticated}/>} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
