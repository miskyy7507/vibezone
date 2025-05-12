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
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DropdownMenu from "./DropdownMenu";

export function PostCard({ postData, deletePostCb }: { postData: Post, deletePostCb: (id: string) => void }) {
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

        // target.style.height = "36px"; // set to height of one line of large font size to force scroll overflow
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
        // target.style.height = `${target.scrollHeight.toString()}px`;
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
                logout();
            } else {
                console.error(await response.text());
                alert(
                    `Something went wrong when trying to do this action. Try to reload the page.`
                );
            }
        } catch (error) {
            handleFetchError(error);
        }
    }

    return (
        <article className="flex flex-col gap-3 px-5 py-4 max-w-2xl w-full bg-zinc-800 rounded-xl shadow-2xl ring-1 ring-zinc-700">
            <div className="flex flex-row gap-3">
                <ProfilePicture user={author} />
                <div className="flex flex-col">
                    <UserNamesDisplay user={author} />
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
                <div className="-mx-5 -mb-3.25 border-y border-zinc-700">
                    <img
                        src={imageUrl}
                        alt="Post image"
                        className="object-cover"
                    />
                </div>
            )}
            <div className="-mx-5 px-4.5 pt-4 flex items-center text-gray-500 text-sm border-t border-zinc-700 ">
                <div className="flex flex-row flex-1 justify-start">
                    <button
                        className="flex items-center space-x-1 hover:text-pink-500 transition"
                        onClick={() => void likeButtonClick()}
                        disabled={likeButtonDisabled}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill={isLiked ? "currentColor" : "none"}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                            />
                        </svg>
                        <span>{likeCount}</span>
                    </button>
                </div>
                <div className="flex flex-row flex-1 justify-end gap-3 items-center">
                    {user && (<>
                        <button
                            className="w-[20px] cursor-pointer"
                            onClick={() => {
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
                                <button
                                    className="flex flex-row gap-2 items-center cursor-pointer text-red-400"
                                    onClick={() => {
                                        void deletePost();
                                        setMenuOpen(false);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTrashCan} />
                                    <span>Delete</span>
                                </button>
                            </DropdownMenu>
                        )}
                    </>)}
                </div>
            </div>
        </article>
    );
}
