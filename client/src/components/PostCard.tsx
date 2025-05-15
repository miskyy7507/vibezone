import { useState, useEffect, useRef } from "react";
import { ProfilePicture } from "./ProfilePicture";
import { UserNamesDisplay } from "./UserNamesDisplay";
import { getRelativeTime } from "../utils/getRelativeDate";
import type { Post } from "../interfaces/post.interface";
import { useAuth } from "../hooks/useAuth";
import { handleFetchError } from "../utils/handleFetchError";
import {
    faEllipsisVertical,
    faTrashCan,
    faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartHollow } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DropdownMenu from "./DropdownMenu";
import clsx from "clsx";
import { DropdownItem } from "./DropdownItem";
import { Link, useNavigate } from "react-router";

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

    const { _id, author, content, imageUrl, createdAt } = postData;

    const [isLiked, setIsLiked] = useState(
        user !== null && postData.isLikedByUser
    );
    const [likeCount, setLikeCount] = useState(postData.likeCount || 0);
    const [likeButtonDisabled, setLikeButtonDisabled] = useState(user === null);

    const dropdownBtnRef = useRef<HTMLButtonElement | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const postTextContent = useRef<HTMLParagraphElement | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (user === null) {
            setIsLiked(false);
            setLikeButtonDisabled(true);
        }
    }, [user]);

    useEffect(() => {
        // If post text content is short enough, we can show it with large font size. But only when post does not contain an image.

        if (imageUrl || postTextContent.current === null) return;
        const target = postTextContent.current;

        target.style.fontSize = "30px";

        if (
            target.scrollHeight >
            parseInt(getComputedStyle(target).lineHeight) * 2.5
        ) {
            // if large font size does not fit in two lines, switch to normal font size
            target.style.fontSize = "16px";
        } else {
            target.style.fontSize = "30px";
        }
    }, [imageUrl, content]);

    const likeButtonClick = async () => {
        setLikeButtonDisabled(true);

        const toLike = !isLiked;

        try {
            const response = await fetch(
                `http://localhost:6660/api/post/${_id}/like`,
                {
                    method: toLike ? "PUT" : "DELETE",
                    credentials: "include",
                }
            );
            if (response.ok) {
                setIsLiked(toLike);
                setLikeCount((count) => count + (toLike ? 1 : -1));
            } else if (response.status === 401) {
                alert("Your session has expired. Please log in back.");
                logout();
            } else {
                console.error(await response.text());
                alert(
                    `Something went wrong when trying to do this action. Try to reload the page.`
                );
            }
        } catch (error) {
            handleFetchError(error);
        } finally {
            setLikeButtonDisabled(false);
        }
    };

    const deletePost = async () => {
        const confirmation = confirm(`WARNING!\nAre you sure you want to delete this post? This cannot be undone!`);
        if (!confirmation) return;
        try {
            const response = await fetch(
                `http://localhost:6660/api/post/${_id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );
            if (response.status === 204 || response.status === 404) {
                deletePostCb(_id);
            } else if (response.status === 401) {
                alert("Your session has expired. Please log in back.");
                logout();
            } else if (response.status === 403) {
                alert("You cannot delete this post.");
            } else {
                console.error(await response.text());
                alert(
                    `Something went wrong when trying to do this action. Try to reload the page.`
                );
            }
        } catch (error) {
            handleFetchError(error);
        }
    };

    const goToPostPage = (e: React.MouseEvent<HTMLElement>) => {
        if (!link) return;
        e.stopPropagation();
        void navigate(`/post/${_id}`);
    }

    return (
        <article className={clsx("flex flex-col gap-3 px-5 py-4 max-w-2xl w-full bg-zinc-800 rounded-xl shadow-sm ring-1 ring-zinc-700", link && "hover:shadow-2xl cursor-pointer transition-shadow")}
        onClick={(e) => {goToPostPage(e)}}>
            <div className="flex flex-row gap-3">
                <Link to={`/user/${author._id}`} onClick={(e) => {e.stopPropagation()}}>
                    <ProfilePicture user={author} />
                </Link>
                <div className="flex flex-col">
                    <Link to={`/user/${author._id}`} onClick={(e) => {e.stopPropagation()}}>
                        <UserNamesDisplay user={author} />
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
                ref={postTextContent}
                className="px-0.5 mb-1 text-base/[1.2] text-zinc-100 break-words whitespace-pre-line"
            >
                {content}
            </p>
            {imageUrl && (
                <div className="-mx-5 -mb-3 border-t border-zinc-700">
                    <img
                        src={`http://localhost:6660/uploads/${imageUrl}`}
                        alt="Post image"
                        className="object-cover"
                    />
                </div>
            )}
            <div className="-mx-5 px-4.5 pt-4 flex items-center text-gray-500 text-sm border-t border-zinc-700 ">
                <div className="flex flex-row flex-1 justify-start">
                    <button
                        className={clsx(
                            isLiked && "text-pink-500",
                            "flex items-center space-x-2 enabled:hover:text-pink-500 enabled:cursor-pointer transition"
                        )}
                        onClick={(e) => {
                            e.stopPropagation();
                            void likeButtonClick();
                        }}
                        disabled={likeButtonDisabled}
                    >
                        {isLiked ? (
                            <FontAwesomeIcon icon={faHeart} />
                        ) : (
                            <FontAwesomeIcon icon={faHeartHollow} />
                        )}
                        <span>{likeCount}</span>
                    </button>
                </div>
                <div className="flex flex-row flex-1 justify-end gap-3 items-center">
                    {user && (
                        <button
                            className="w-[20px] rounded-full cursor-pointer hover:bg-zinc-50/5 transition"
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
                                    void deletePost();
                                    setMenuOpen(false);
                                }}
                                danger
                            />
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </article>
    );
}
