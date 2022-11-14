import {useEffect} from "react";
import * as api from "../services/serviceApi";
import {pageAuthentication} from "../services/serviceApi";

const authContext = (state = false, action) => {
            api.pageAuthentication()
                .then(data => console.log(data))
                .catch(error => {
                    console.log(error);
                    return state = false;
                });
}

export default authContext;