import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useState } from "react";
import { Navigate } from "react-router-dom";

function Create() {
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

    async function createPost(ev) {
        ev.preventDefault(); // Ensure this is called first

        // Create a new FormData object
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);

        if (files) {
            data.set('file', files); // Use files directly if it's a single file
        }

        // Log the FormData entries for debugging
        for (let pair of data.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        // Send the POST request
        const response = await fetch('http://localhost:4000/post', {
            method: 'POST',
            body: data,
            credentials:'include'
        });

        // Check for a successful response
        if (response.ok) {
            setRedirect(true);
        } else {
            const errorData = await response.json(); // Get error details
            console.error('Error details:', errorData); // Log error details for debugging
        }
    }

    // Handle file selection
    const handleFileChange = (event) => {
        setFiles(event.target.files[0]); // Update state with the selected file
    };

    // Redirect after successful post
    if (redirect) {
        return <Navigate to={'/'} />
    }

    return (
        <form onSubmit={createPost} className="create-form">
            <input
                type="text" // Use "text" for title
                placeholder={'Title'}
                value={title}
                onChange={event => setTitle(event.target.value)}
            />
            <input
                type="text" // Use "text" for summary
                placeholder={'Summary'}
                value={summary}
                onChange={event => setSummary(event.target.value)}
            />
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange} // Handle file change
            />
            <ReactQuill
                modules={modules}
                value={content}
                onChange={setContent}
            />
            <button style={{ marginTop: '5px' }}>Create post</button>
        </form>
    );
}

export default Create;
