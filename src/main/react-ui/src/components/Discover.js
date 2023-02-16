import "./Discover.scss";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logoutUser} from "../actions/userActions";
import {retrieveUsers} from "../services/serviceApi";
import UserList from "./UserList";


function Discover () {
    const [users, setUsers] = useState(null);
    const [loggedUser, setLoggedUser] = useState({});
    const history = useNavigate();
    const {loading, error, results, success, actionType} = useSelector(state => state.user);

    const dispatch = useDispatch();

    const logoutHandler = () => {
        let id = loggedUser.id;
        dispatch(logoutUser({id}));



    };

    const retrieveAsyncUsers = async (page) => {
        let size = 6;
        let id = loggedUser.id;
        await retrieveUsers({page, size, id})
            .then(data => setUsers(data))
            .catch(error => console.log(error));
    };
    const getLoggedUserDetails = () => {
        const userDetails = JSON.parse(sessionStorage.getItem("login-details"));
        setLoggedUser({
            username:userDetails.username,
            id:userDetails.id,
            email:userDetails.email,
            roleName: userDetails.roles[0].name

        });
    };

    useEffect(() => {
        retrieveAsyncUsers(1);
        getLoggedUserDetails();


    }, []);

    return(
        <div className="discover-people--wrapper">
            <UserList retrieveAsyncUsers={retrieveAsyncUsers} users={users} totalElements={users?.totalElements}/>
        </div>
    );
}


export default Discover;