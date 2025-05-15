import { Comment } from "../interfaces/comment.interface";
import { ProfilePicture } from "./ProfilePicture";
import { UserNamesDisplay } from "./UserNamesDisplay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { CreationDate } from "./CreationDate";
import { LikeButton } from "./LikeButton";

export function CommentItem({comment}: {comment: Comment}) {
    const { _id, user, content, likeCount, isLikedByUser, createdAt } = comment;

    return (
        <article
            className="flex flex-row gap-3"
        >
            <div className="mt-2">
                <ProfilePicture user={user} size="small" />
            </div>
            <div className="flex flex-col flex-1 relative">
                <div className="flex flex-row gap-3">
                    <UserNamesDisplay user={user} />
                    <span className="text-zinc-500">·</span>
                    <CreationDate dateString={createdAt} />
                </div>
                <p className="text-base text-zinc-100 break-words whitespace-pre-line">{content}</p>
                <LikeButton 
                    what="comment"
                    id={_id}
                    isLiked={isLikedByUser}
                    likeCount={likeCount}
                />
            </div>
            <button
                className="size-[32px] my-auto rounded-full enabled:hover:bg-zinc-50/5 transition disabled:opacity-60 enabled:cursor-poigraynter"
            >
                <FontAwesomeIcon icon={faEllipsisVertical} />
            </button>
        </article>
    )
}
