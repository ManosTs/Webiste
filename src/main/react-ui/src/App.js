
import './App.scss';
import FormUser from "./components/FormUser";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./components/Home";
import SecureRoute from "./SecureRoute";
import {useSelector} from "react-redux";
import {useState} from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {

    return (
            <BrowserRouter>
                <Routes>
                    <Route path="/register"
                           element={<FormUser title="SIGN UP" hideUsernameField={false} login={false}/>}/>
                    <Route path="/login" element={<FormUser title="LOGIN" hideUsernameField={true} login={true}/>}/>
                    <Route exact path="/" element={<SecureRoute><Home/></SecureRoute>}/>

                </Routes>
            </BrowserRouter>
    );
}

export default App;
