import Post from "../Post";
import {useEffect, useState} from "react";

export default function IndexPage() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/post')
            .then(response => response.json())
            .then(data => {
                console.log(data); // Check the data being fetched
                setPosts(data);    // Update state with fetched posts
            })
            .catch(error => console.error('Error fetching posts:', error));
    }, []);

    return (
        <>
            {posts.length > 0 && posts.map(post => (
                <Post key={post._id}  // Ensure to add a key for each item
                      id={post._id}
                      title={post.title}
                      summary={post.summary}
                      content={post.content}
                      img={post.img}
                      createdAt={post.createdAt}
                      author={post.author}/>

            ))}
        </>
    );
}