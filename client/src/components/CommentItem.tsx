import { Link } from "react-router";
import { Comment } from "../interfaces/comment.interface";
import { ProfilePicture } from "./ProfilePicture";
import { UserNamesDisplay } from "./UserNamesDisplay";
import { getRelativeTime } from "../utils/getRelativeDate";

export function CommentItem({comment}: {comment: Comment}) {
    const { user, content, likeCount, createdAt } = comment;

    return (
        <article>
            <div className="flex flex-row gap-3">
                <Link to={`/user/${user._id}`} onClick={(e) => {e.stopPropagation()}}>
                    <ProfilePicture user={user} />
                </Link>
                <div className="flex flex-col">
                    <Link to={`/user/${user._id}`} onClick={(e) => {e.stopPropagation()}}>
                        <UserNamesDisplay user={user} />
                    </Link>
                    <span
                        className="text-gray-500"
                        title={new Date(createdAt).toLocaleString("en-GB", {
                            dateStyle: "long",
                            timeStyle: "short",
                        })}
                    >
                        {getRelativeTime(new Date(createdAt))}
                    </span>
                </div>
            </div>
            <p
                className="px-0.5 mb-1 text-base/[1.2] text-zinc-100 break-words whitespace-pre-line"
            >
                {content}
            </p>
            <span>Like count: {likeCount}</span>
        </article>
    )
}
