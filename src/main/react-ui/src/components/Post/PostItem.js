import ProfByline from "../ProfByline/ProfByline";
import "./PostItem.scss";

function PostItem(){
    return(
        <div className="postItem--container">
            <div className="postItem--wrapper">
                <div className="postItem--wrapper__head">
                    <ProfByline />
                </div>
                <div className="postItem--wrapper__body">

                </div>
            </div>
        </div>
    );
}

export default PostItem;
