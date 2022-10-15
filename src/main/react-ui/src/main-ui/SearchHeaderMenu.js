import "./SearchHeaderMenu.scss";
import FormInput from "../components/Form/FormInput";
import {useEffect, useState} from "react";
import {getAllUsers} from "../services/UserService";
import ProfByline from "../components/ProfByline/ProfByline";
import Cookies from "js-cookie";
function SearchHeaderMenu({handleSearchChange}) {
    const [openSearchMenu, setOpenSearchMenu] = useState(false);

    const OnFocus = () => {
        setOpenSearchMenu(true);
    }

    const [users, setUsers] = useState([]);

    useEffect(() => {
        getAllUsers().then(async (response) => {
            let data = await response.json();

            for (let i = 0; i < data.length; i++) {
                if(data[i].id === Cookies.get("id")){
                    data.splice(i, 1);
                }
            }
            setUsers(data);
        });
    }, [users]);

    return (
        <span className="searchHeader--wrapper">
            <FormInput name="search" iconName="search" handleChange={handleSearchChange}
                       autoComplete="off"
                       placeholder="Search" type="text" id="header_search" label=""
                       onFocus={OnFocus}/>
            {openSearchMenu && <div className="searchHeaderMenu--container">
                {users.map(
                    (value, index, array) =>
                        (<ProfByline id={value.id}
                                     text={""}
                                     userName={value.firstName + " " +value.lastName} />)
                )}
            </div>}
        </span>

    );
}

export default SearchHeaderMenu;
