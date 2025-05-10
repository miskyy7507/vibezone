import { useState, useEffect } from "react";
import { ProfilePicture } from "./ProfilePicture";
import { UserNamesDisplay } from "./UserNamesDisplay";
import { getRelativeTime } from "../utils/getRelativeDate";
import type { Post } from "../interfaces/post.interface";
import { useAuth } from "../auth";

export function PostCard({ postData }: { postData: Post }) {
    const { user } = useAuth();

    const { _id, author, content, imageUrl, createdAt } = postData;

    const [isLiked, setIsLiked] = useState(user !== null && postData.isLikedByUser);
    const [likeCount, setLikeCount] = useState(postData.likeCount);
    const [likeButtonDisabled, setLikeButtonDisabled] = useState(user === null);

    useEffect(() => {
        if (user === null) {
            setIsLiked(false);
            setLikeButtonDisabled(true);
        }
    }, [user]);

    const likeButtonClick = async () => {
        setLikeButtonDisabled(true);

        const toLike = !isLiked;

        try {
            await fetch(`http://localhost:6660/api/post/${_id}/like`, {
                method: toLike ? "PUT" : "DELETE",
                credentials: "include"
            });
            setIsLiked(toLike);

            setLikeCount((count) => count + (toLike ? 1 : -1));
        } catch (error) {
            if (error instanceof TypeError) {
                console.error("Fetch failed.", error);
                alert(`Something went wrong: ${error.message}`);
            } else {
                throw error;
            }
        } finally {
            setLikeButtonDisabled(false);
        }
    };

    return (
        <div className="flex flex-col gap-3 px-5 py-4 max-w-2xl w-full bg-zinc-800 rounded-xl shadow-2xl ring-1 ring-zinc-700">
            <div className="flex flex-row gap-3">
                <ProfilePicture user={author} />
                <div className="flex flex-col">
                    <div className="flex flex-row space-x-2 items-center">
                        <UserNamesDisplay user={author} />
                    </div>
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

            <p className="px-0.5 pb-1">{content}</p>
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
        </div>
    );
}
