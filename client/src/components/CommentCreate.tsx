import { useAuth } from "../hooks/useAuth";
import { ProfilePicture } from "./ProfilePicture";
import { UserNamesDisplay } from "./UserNamesDisplay";
import TextareaAutosize from "react-textarea-autosize";

import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { handleFetchError } from "../utils/handleFetchError";
import { toast } from "react-toastify";
import { apiUrl } from "../config";

import type { Comment } from "../interfaces/comment.interface";

export function CommentCreate({
    addComment,
    postId,
    focus
}: {
    addComment: (comment: Comment) => void;
    postId: string;
    focus: boolean;
}) {
    const MAX_COMMENT_LENGTH = 150;

    const [content, setContent] = useState("");

    const textArea = useRef<HTMLTextAreaElement | null>(null);

    const { user, logout } = useAuth();

    useEffect(() => {
        if (!focus) return;
        textArea.current?.focus();
    }, [focus])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch(`${apiUrl}/comment/${postId}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content,
                }),
            });

            if (response.status === 200) {
                const newComment = (await response.json()) as Comment;
                addComment(newComment)
                setContent("");
            } else if (response.status === 401) {
                toast.warn("Your session has expired. Please log in back.");
                logout();
            } else {
                console.error(await response.text());
                toast.error(
                    "Something went wrong when trying to do this action. Try to reload the page."
                );
            }
        } catch (error) {
            handleFetchError(error);
        }
    };

    if (!user) return;

    const remainingChars = MAX_COMMENT_LENGTH - content.length;

    return (
        <form
            onSubmit={(e) => void handleSubmit(e)}
            className="flex flex-row gap-3"
        >
            <div className="mt-2">
                <ProfilePicture user={user} size="small" />
            </div>
            <div className="flex flex-col flex-1 relative">
                <UserNamesDisplay user={user} />
                <TextareaAutosize
                    ref={textArea}
                    className="text-base mb-3.5 resize-none border-b border-zinc-400 focus:outline-0"
                    placeholder="💬 Write a comment..."
                    value={content}
                    onInput={(e) => {
                        setContent(e.currentTarget.value);
                    }}
                    maxLength={150}
                    rows={1}
                    minRows={1}
                ></TextareaAutosize>
                {remainingChars / MAX_COMMENT_LENGTH < 1 / 3 && (
                    <span
                        className={clsx(
                            remainingChars !== 0
                                ? "text-zinc-400"
                                : "text-red-400",
                            "absolute -bottom-1.5 right-0.5 text-sm"
                        )}
                    >
                        {remainingChars}
                    </span>
                )}
            </div>
            <button
                type="submit"
                disabled={!content}
                className="size-[32px] mt-auto mb-4 rounded-full enabled:hover:bg-zinc-50/5 transition disabled:opacity-60 enabled:cursor-pointer"
                title="Add a comment"
            >
                <FontAwesomeIcon icon={faPaperPlane} />
            </button>
        </form>
    );
}
