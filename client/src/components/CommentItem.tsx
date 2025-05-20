import { Comment } from "../interfaces/comment.interface";
import { ProfilePicture } from "./ProfilePicture";
import { UserNamesDisplay } from "./UserNamesDisplay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { CreationDate } from "./CreationDate";
import { LikeButton } from "./LikeButton";
import { useAuth } from "../hooks/useAuth";
import { useRef, useState } from "react";
import { DropdownMenu } from "./DropdownMenu";
import { DropdownItem } from "./DropdownItem";
import { toast } from "react-toastify";
import { apiUrl } from "../config";
import { handleFetchError } from "../utils/handleFetchError";

export function CommentItem({
    comment,
    deleteCommentCb,
}: {
    comment: Comment;
    deleteCommentCb: (id: string) => void;
}) {
    const { user: authedUser, logout } = useAuth();

    const {
        _id,
        user: author,
        content,
        likeCount,
        isLikedByUser,
        createdAt,
    } = comment;

    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownBtnRef = useRef(null);

    const deleteComment = async () => {
        const confirmation = confirm(`WARNING!\nAre you sure you want to delete this comment? This cannot be undone!`);
        if (!confirmation) return;
        try {
            const response = await fetch(
                `${apiUrl}/comment/${_id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );
            if (response.status === 204 || response.status === 404) {
                deleteCommentCb(_id);
            } else if (response.status === 401) {
                toast.warn("Your session has expired. Please log in back.")
                logout();
            } else if (response.status === 403) {
                toast.error("You cannot delete this post.");
            } else {
                console.error(await response.text());
                toast.error("Something went wrong when trying to do this action. Try to reload the page.");
            }
        } catch (error) {
            handleFetchError(error);
        }
    };

    return (
        <article className="flex flex-row gap-3">
            <div className="mt-2">
                <ProfilePicture user={author} size="small" />
            </div>
            <div className="flex flex-col flex-1 relative">
                <div className="flex flex-row gap-3">
                    <UserNamesDisplay user={author} />
                    <span className="text-zinc-500">·</span>
                    <CreationDate dateString={createdAt} />
                </div>
                <p className="text-base text-zinc-100 wrap-anywhere whitespace-pre-line">
                    {content}
                </p>
                <LikeButton
                    what="comment"
                    id={_id}
                    isLiked={isLikedByUser}
                    likeCount={likeCount}
                />
            </div>
            {(authedUser?._id === author._id || authedUser?.role === "moderator") && (
                <button
                    className="size-[20px] my-auto rounded-full cursor-pointer text-zinc-500 hover:bg-zinc-50/5 transition disabled:opacity-60"
                    onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen((p) => !p);
                    }}
                    ref={dropdownBtnRef}
                >
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                </button>
            )}
            {menuOpen && (
                <DropdownMenu
                    anchorRef={dropdownBtnRef}
                    onClose={() => {
                        setMenuOpen(false);
                    }}
                >
                    <DropdownItem
                        text="Delete"
                        icon={faTrashCan}
                        onClick={() => {
                            void deleteComment();
                            setMenuOpen(false);
                        }}
                        danger
                    />
                </DropdownMenu>
            )}
        </article>
    );
}
