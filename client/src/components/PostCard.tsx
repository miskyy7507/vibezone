import { useState } from "react";
import { ProfilePicture } from "./ProfilePicture";
import { UserNamesDisplay } from "./UserNamesDisplay";
import { getRelativeTime } from "../utils/getRelativeDate";
import type { Post } from "../interfaces/post.interface";

export function PostCard({ postData }: { postData: Post }) {
    const { _id, author, content, imageUrl, createdAt, updatedAt } = postData;

    const [isLiked, setIsLiked] = useState(postData.isLikedByUser);
    const [likeCount, setLikeCount] = useState(postData.likeCount);

    const likeButtonClick = () => {
        const toLike = !isLiked;

        setIsLiked(toLike);

        setLikeCount((count) => count + (toLike ? 1 : -1));
    };

    return (
        <div className="flex flex-col p-4 border-b border-gray-200 max-w-2xl w-full">
            <div className="flex flex-row">
                <ProfilePicture
                    user={author}
                />
                <div className="flex flex-col ml-2 ">
                    <div className="flex flex-row space-x-2 items-center">
                        <UserNamesDisplay
                            user={author}
                        />
                    </div>
                    <span
                        className="text-gray-600"
                        title={new Date(createdAt).toLocaleString(
                            "en-GB",
                            { dateStyle: "long", timeStyle: "short" }
                        )}
                    >
                        {getRelativeTime(new Date(createdAt))}
                    </span>
                </div>
            </div>

            <div>
                <p className="mt-2">{content}</p>
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt="Post image"
                        className="rounded-xl border border-gray-200 mt-3 size-160 object-cover"
                    />
                )}
                <div className="flex items-center space-x-2 mt-3 text-gray-500 text-sm">
                    <button
                        className="flex items-center space-x-1 hover:text-pink-500 transition"
                        onClick={likeButtonClick}
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
        </div>
    );
}
