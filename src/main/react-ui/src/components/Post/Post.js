import "./Post.scss";
import ProfByline from "../ProfByline/ProfByline";
import PostItem from "./PostItem";

function Post(props) {
    return (
        <div className="post--container">
            <PostItem />

            <PostItem />

            <PostItem />
        </div>
    );
}

export default Post;
