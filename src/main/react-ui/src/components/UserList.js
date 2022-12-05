import './UserList.scss';
import ReactPaginate from "react-paginate";
import {Fragment, useState} from "react";
import {retrieveUsers} from "../services/serviceApi";

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
            <h2>ALL USERS</h2>
            <ul className="userList--wrapper">
                {users && currentItems.map(
                    (obj, index) =>(
                        <li id={obj.id} key={index}>
                            <p>USERNAME:</p>
                            <p>{obj.username}</p>
                            <p>EMAIL:</p>
                            <p>{obj.email}</p>
                        </li>
                    )
                )}

            </ul>
            <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={6}
                pageCount={pageCount}
                previousLabel="<"
                renderOnZeroPageCount={null}
            />
        </div>


    );
}

export default UserList;