import './App.scss';
import FormUser from "./components/Form/FormUser";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./components/Home";
import SecureRoute from "./SecureRoute";
import {useSelector} from "react-redux";
import React, {useState} from "react";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from "./components/Layout";
import Discover from "./components/Discover";
import Countdown from "react-countdown";
import Profile from "./components/Profile/Profile";
import Tab from "./components/Profile/Tabs/Tab";
import FriendsTab from "./components/Profile/Tabs/FriendsTab";
import {Info} from "@mui/icons-material";
import InformationTab from "./components/Profile/Tabs/InformationTab";
import PostsTab from "./components/Profile/Tabs/PostsTab";

function App() {
    const CountDownWrapper = () => <Countdown date={Date.now() + 60 * 1000}/>;
    const MemoCountDown = React.memo(CountDownWrapper);
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/register"
                       element={<FormUser title="SIGN UP" hideUsernameField={false} login={false}/>}/>
                <Route path="/login" element={<FormUser title="LOGIN" hideUsernameField={true} login={true}/>}/>
                <Route exact path="/"
                       element={<SecureRoute><Layout memoCountdown={<MemoCountDown/>}><Home/></Layout></SecureRoute>}/>
                <Route path="/discover" element={<SecureRoute><Layout
                    memoCountdown={<MemoCountDown/>}><Discover/></Layout></SecureRoute>}/>
                <Route path="/profile/:id"
                       element={<SecureRoute>
                           <Layout memoCountdown={<MemoCountDown/>}>
                               <Profile/>
                           </Layout>
                       </SecureRoute>}>
                    <Route path="posts" element={<SecureRoute>
                            <PostsTab />
                    </SecureRoute>}/>
                    <Route path="friends" element={<SecureRoute>
                        <FriendsTab />
                    </SecureRoute>}/>
                    <Route path="information" element={<SecureRoute>
                        <InformationTab />
                    </SecureRoute>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
