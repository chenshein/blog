import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";

function EditPost() {
    const { id } = useParams();  // Get post ID from URL
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState(null);
    const [redirect, setRedirect] = useState(false);

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ align: ["right", "center", "justify"] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
        ],
    };

    // fetch post data for editing by id
    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`, {
            credentials: 'include'  // Include token for authentication
        })
            .then(response => response.json())
            .then(post => {
                setTitle(post.title);
                setSummary(post.summary);
                setContent(post.content);
            })
            .catch(err => console.error("Error fetching post data:", err));
    }, [id]);

    // update the post after click
    async function updatePost(ev) {
        ev.preventDefault();

        // create a new FormData object for the request
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);

        if (files) {
            data.set('file', files);  // Add the new file if any
        }


        // Send the updated data to the backend
        const response = await fetch(`http://localhost:4000/post/${id}`, {
            method: 'PUT',
            body: data,
            credentials: 'include',
        });

        // Check for successful response
        if (response.ok) {
            setRedirect(true);  // Redirect after success
        } else {
            const errorData = await response.json();
            console.error('Error details:', errorData);
        }
    }

    // change img
    const handleFileChange = (event) => {
        setFiles(event.target.files[0]);
    };

    // redirect after successful post update
    if (redirect) {
        return <Navigate to={`/post/${id}`} />;  // Redirect to the updated post page
    }

    return (
        <form onSubmit={updatePost}>
            <input
                type="text"
                placeholder={'Title'}
                value={title}
                onChange={event => setTitle(event.target.value)}
            />
            <input
                type="text"
                placeholder={'Summary'}
                value={summary}
                onChange={event => setSummary(event.target.value)}
            />
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
            />
            <ReactQuill
                modules={modules}
                value={content}
                onChange={setContent}
            />
            <button style={{ marginTop: '5px' }}>Update post</button>
        </form>
    );
}

export default EditPost;
