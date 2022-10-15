import './App.scss';
import {Header} from "./main-ui/Header";
import {Footer} from "./main-ui/Footer";
import { Routes ,Route } from 'react-router-dom';
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";
import {ProtectedRouter} from "./security/ProtectedRouter";
import Profile from "./components/Profile/Profile";

function App() {
  return (
    <div className="App">
      <Header />
        <Routes>
            <Route path='/login' element={<Login/>} />
            <Route path='/register' element={<Register/>} />

            <Route path='/home' element={
                <ProtectedRouter>
                    <Home/>
                </ProtectedRouter>
            } />

            <Route path={`/profile/:id`} element={
                <ProtectedRouter>
                    <Profile />
                </ProtectedRouter>
            } />
        </Routes>
    </div>

  );
}

export default App;
