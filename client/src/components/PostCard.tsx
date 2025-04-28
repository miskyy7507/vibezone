import { useState } from "react";
import { ProfilePicture } from "./ProfilePicture";
import { UserNamesDisplay } from "./UserNamesDisplay";

export interface PostData {
    id: string;
    authorDisplayName?: string;
    authorUsername: string;
    authorPfpUri?: string;
    content: string;
    imageUri?: string;
    likes: number;
    isLikedByUser: boolean;
    timestamp: string;
}

export function PostCard({ postData }: { postData: PostData }) {
    const [isLiked, setIsLiked] = useState(postData.isLikedByUser);
    const [likes, setLikes] = useState(postData.likes);

    const likeButtonClick = () => {
        const toLike = !isLiked;

        setIsLiked(toLike);

        setLikes((count) => count + (toLike ? 1 : -1));
    };

    return (
        <div className="flex flex-col p-4 border-b border-gray-200 max-w-2xl w-full">
            <div className="flex flex-row">
                <ProfilePicture
                    uri={postData.authorPfpUri}
                    username={
                        postData.authorDisplayName ?? postData.authorUsername
                    }
                />
                <div className="flex flex-col ml-2 ">
                    <div className="flex flex-row space-x-2 items-center">
                        <UserNamesDisplay
                            username={postData.authorUsername}
                            displayName={postData.authorDisplayName}
                        />
                    </div>
                    <span className="text-gray-600">
                        {postData.timestamp}
                    </span>
                </div>
            </div>

            <div>
                <p className="mt-2">{postData.content}</p>
                {postData.imageUri && (
                    <img
                        src={postData.imageUri}
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
                        <span>{likes}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
