import {Link, useParams} from 'react-router-dom';
import {useContext, useEffect, useState} from 'react';
import {formatISO9075} from 'date-fns';

export default function SinglePost() {
    const { id } = useParams();
    const [postInfo,setPostInfo]= useState(null)
    const [userInfo, setUserInfo] = useState(null);  //user how is login
    const [isPopUpDeleteOpen, setPopUpDeleteOpen] = useState(false);


    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`) // fetch post info
            .then(response => response.json())
            .then(postInfo => {
                setPostInfo(postInfo);
            });
    },[id]);

    useEffect(() => {
        fetch('http://localhost:4000/profile', {
            credentials: 'include' //  include token in the request
        })
            .then(response => response.json())
            .then(userInfo => {
                setUserInfo(userInfo);
            })
            .catch(err => console.log(err)); // Handle errors
    }, []);

    if (!postInfo) return ''
    const imgUrl = `http://localhost:4000/uploads/${postInfo.img.split('\\').pop()}`;
    const isAuthor = userInfo.id === postInfo.author._id; //check if the author is the one how is login


    const handleDelete = () => {
        fetch(`http://localhost:4000/post/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(() => {
                window.location.href = 'http://localhost:3000/'; // go back to home page
            })
            .catch(err => console.log(err)); // Handle errors
    };

    return (
        <div className="post-page">
            <div className="image">
                <img src={imgUrl}></img>
            </div>
            <h1>{postInfo.title}</h1>
            <time>{formatISO9075(new Date (postInfo.createdAt))}</time>
            <div className="author"> by {postInfo.author.username}</div>
            {isAuthor && (
                <div className="edit-delete-row">
                    <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                        Edit Post
                    </Link>
                    <Link className="delete-btn" onClick={() => setPopUpDeleteOpen(true)}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 12V17" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 12V17" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M4 7H20" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                        Delete Post
                    </Link>
                </div>
            )}

            {isPopUpDeleteOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Are you sure you want to delete this post?</h2>
                        <div className="modal-actions">
                            <button onClick={handleDelete}>Yes, Delete</button>
                            <button onClick={() => setPopUpDeleteOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div dangerouslySetInnerHTML={{ __html: postInfo.content }}></div>
        </div>
    );
}

