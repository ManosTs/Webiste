import {Navigate} from "react-router-dom";
import Cookies from 'js-cookie';

export function ProtectedRouter({children}) {
    const token = Cookies.get('token');

    if(!token){
        return <Navigate to="/login" replace={true} />
    }

    return children;

}
