import './UserList.scss';
import ReactPaginate from "react-paginate";
import {Fragment, useState} from "react";
import {retrieveUsers} from "../services/serviceApi";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

function UserList({retrieveAsyncUsers, users, totalElements}) {

    const [currentPage, setCurrentPage] = useState(0);

    const currentItems = users?.content;
    const pageCount = Math.ceil(totalElements / 6);

    const handlePageClick = (event) => {

       console.log(event.selected + 1);
        retrieveAsyncUsers(event.selected + 1);
    };
    return (
        <div className="userList--container">
            <ul className="userList--wrapper">
                {users && currentItems.map(
                    (obj, index) =>(
                        <li id={obj.id} key={index}>
                            <img alt="" className="userList__profileImage"/>
                            <p>{obj.firstName} {obj.lastName}</p>
                            <div className="userList__actions">
                                <button type="button" className="profile--wrapper__action add-friend">
                                    <AddIcon />
                                    <p>ADD FRIEND</p>
                                </button>
                                {/*<button type="button" className="profile--wrapper__action delete-friend">*/}
                                {/*    <RemoveIcon />*/}
                                {/*    <p>DELETE</p>*/}
                                {/*</button>*/}
                            </div>
                        </li>
                    )
                )}

            </ul>
            {totalElements > 6 &&<ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={6}
                pageCount={pageCount}
                previousLabel="<"
                renderOnZeroPageCount={null}
            />}
        </div>


    );
}

export default UserList;