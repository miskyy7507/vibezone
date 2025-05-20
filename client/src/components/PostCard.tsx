import { useState, useRef } from "react";
import { clsx } from "clsx";
import { Link } from "react-router";
import { toast } from "react-toastify";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowUpRightFromSquare,
    faEllipsisVertical,
    faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { faMessage } from "@fortawesome/free-regular-svg-icons";

import { useAuth } from "../hooks/useAuth";
import { handleFetchError } from "../utils/handleFetchError";

import { UserNamesDisplay } from "./UserNamesDisplay";
import { ProfilePicture } from "./ProfilePicture";
import { DropdownMenu } from "./DropdownMenu";
import { DropdownItem } from "./DropdownItem";
import { CreationDate } from "./CreationDate";
import { LikeButton } from "./LikeButton";
import { DropdownLink } from "./DropdownLink";
import { apiUrl, uploadsUrl } from "../config";

import type { Post } from "../interfaces/post.interface";

export function PostCard({
    postData,
    deletePostCb,
    link
}: {
    postData: Post;
    deletePostCb: (id: string) => void;
    link?: boolean
}) {
    const { user, logout } = useAuth();

    const { _id, author, content, imageUrl, createdAt, likeCount, commentCount, isLikedByUser } = postData;

    const dropdownBtnRef = useRef<HTMLButtonElement | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const deletePost = async () => {
        const confirmation = confirm(`WARNING!\nAre you sure you want to delete this post? This cannot be undone!`);
        if (!confirmation) return;
        try {
            const response = await fetch(
                `${apiUrl}/post/${_id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );
            if (response.status === 204 || response.status === 404) {
                deletePostCb(_id);
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
        <article
            className={clsx(
                "flex flex-col gap-3 px-5 py-4 max-w-2xl w-full bg-zinc-800 rounded-xl shadow-sm ring-1 ring-zinc-700"
            )}
        >
            <div className="flex flex-row gap-3">
                <Link
                    to={`/user/${author._id}`}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <ProfilePicture user={author} />
                </Link>
                <div className="flex flex-col">
                    <Link
                        to={`/user/${author._id}`}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        className="hover:underline"
                    >
                        <UserNamesDisplay user={author} />
                    </Link>
                    <Link className="hover:underline" to={`/post/${_id}`}>
                        <CreationDate dateString={createdAt} />
                    </Link>
                </div>
            </div>

            <p
                className={clsx(
                    "px-0.5 mb-1 text-zinc-100 break-words whitespace-pre-line",
                    !imageUrl &&
                        content.length <= 60 &&
                        (content.match(/\n/g) || []).length <= 2
                        ? "text-3xl"
                        : "text-base" // If post content is short enough, we can show it with large font size.
                )}
            >
                {content}
            </p>
            {imageUrl && (
                <div className="-mx-5 -mb-3 border-t border-zinc-700">
                    <img
                        src={`${uploadsUrl}/${imageUrl}`}
                        alt="Post image"
                        className="object-cover"
                    />
                </div>
            )}
            <div className="-mx-5 px-4.5 pt-4 flex items-center text-sm border-t border-zinc-700 ">
                <div className="flex flex-row justify-start gap-8">
                    <LikeButton
                        what="post"
                        id={_id}
                        isLiked={isLikedByUser}
                        likeCount={likeCount}
                    />
                    <Link
                        className="flex items-center gap-x-2 text-sm text-zinc-500 hover:text-zinc-100 cursor-pointer transition"
                        to={`/post/${_id}#comments`}
                        // onClick={(e) => void handleClick(e)}
                    >
                        <FontAwesomeIcon icon={faMessage} />
                        <span>{commentCount}</span>
                    </Link>
                </div>
                <div className="flex flex-row flex-1 justify-end gap-3 items-center">
                    <button
                        className="w-[20px] rounded-full cursor-pointer text-zinc-500 hover:bg-zinc-50/5 transition"
                        onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen((p) => !p);
                        }}
                        ref={dropdownBtnRef}
                    >
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                    </button>
                    {menuOpen && (
                        <DropdownMenu
                            anchorRef={dropdownBtnRef}
                            onClose={() => {
                                setMenuOpen(false);
                            }}
                        >
                            {link && (
                                <DropdownLink
                                    text="Go to post"
                                    icon={faArrowUpRightFromSquare}
                                    link={`/post/${_id}`}
                                />
                            )}
                            {/* show only this when logged in user is author of the post or moderator */}
                            {(user?._id === postData.author._id ||
                                user?.role === "moderator") && (
                                <DropdownItem
                                    text="Delete"
                                    icon={faTrashCan}
                                    onClick={() => {
                                        void deletePost();
                                        setMenuOpen(false);
                                    }}
                                    danger
                                />
                            )}
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </article>
    );
}
