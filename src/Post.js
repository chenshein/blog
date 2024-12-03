import {formatISO9075} from 'date-fns';
import Login from "./pages/Login";
import {Link} from "react-router-dom";

export default function Post({ id,title, summary, content, img, createdAt, author }) {
    const imgUrl = `http://localhost:4000/uploads/${img.split('\\').pop()}`;

    return (
        <div className="post">
            <div className="image">
                <Link to={`/post/${id}`}>
                    <img src={imgUrl} />
                </Link>
            </div>
            <div className="texts">
                <Link to={`/post/${id}`}>
                    <h2>{title}</h2>
                </Link>
                <p className="info">
                    <a className="author">{author.username}</a>
                    <time>{formatISO9075(new Date (createdAt))}</time>
                </p>
                <div dangerouslySetInnerHTML={{ __html: summary }}></div>
            </div>
        </div>
    );
}

