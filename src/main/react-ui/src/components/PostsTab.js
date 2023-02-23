import './PostsTab.scss';


function PostsTab(){
    return(
        <div className="posts--tab">
            <div className="posts--tab__post">
                <div className="posts--tab__header">
                    <p>FullName</p>
                    <p>Posted date</p>
                </div>
                <div className="posts--tab__description">
                    <p>Description...</p>
                </div>
                <img alt="" className="posts--tab__image"/>
            </div>
        </div>
    );
}

export default PostsTab