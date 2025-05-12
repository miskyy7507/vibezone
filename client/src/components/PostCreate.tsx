import { useState, useRef } from "react";
import { clsx } from "clsx";

import { useAuth } from "../auth";
import { ProfilePicture } from "./ProfilePicture";
import { UserNamesDisplay } from "./UserNamesDisplay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { Post } from "../interfaces/post.interface";
import { handleFetchError } from "../utils/handleFetchError";

export function PostCreate({ addPost }: { addPost: (post: Post) => void }) {
    const MAX_POST_LENGTH = 150;

    const [isFocused, setIsFocused] = useState(false);
    const [content, setContent] = useState("");
    const [collapsed, setCollapsed] = useState(true);
    const [remainingChars, setRemainingChars] = useState(MAX_POST_LENGTH);
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    const { user, logout } = useAuth();

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const target = e.currentTarget;

        setCollapsed(false);

        const newContent = e.currentTarget.value;

        setContent(newContent);
        setRemainingChars(MAX_POST_LENGTH - newContent.length);

        // If post content is short enough, we can show it with large font size.

        target.style.height = "36px"; // set to height of one line of large font size to force scroll overflow
        target.style.fontSize = "30px";

        if (target.scrollHeight > parseInt(getComputedStyle(target).lineHeight) * 2.5) {
            // if large font size does not fit in two lines, switch to normal font size
            target.style.fontSize = "16px";
        } else {
            target.style.fontSize = "30px";
        }
        target.style.height = `${target.scrollHeight.toString()}px`;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:6660/api/post", {
                method: "POST",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content
                }),
            });
            if (response.status === 200) {
                const newPost = (await response.json()) as Post;
                addPost(newPost);
                resetForm();
            } else if (response.status === 401) {
                alert("Your session has expired. Please log in back.");
                logout();
            } else {
                console.error(await response.text());
                alert(`Something went wrong when trying to do this action. Try to reload the page.`);
            }
        } catch (error) {
            handleFetchError(error);
        }
    };

    const resetForm = () => {
        setIsFocused(false);
        setCollapsed(true);
        setContent("");
    }

    if (!user) return;

    return (
        <form
            className={clsx(
                "flex flex-col gap-3 px-5 py-4 max-w-2xl w-full bg-zinc-800 rounded-xl shadow-2xl ring-1 transition",
                isFocused ? "ring-zinc-200" : "ring-zinc-700",
                !isFocused && collapsed && "opacity-65"
            )}
            onSubmit={(e) => {void handleSubmit(e)}}
        >
            <div
                className={clsx(
                    "flex gap-4 text-zinc-100 relative",
                    collapsed ? "flex-row items-center" : "flex-col"
                )}
                onFocus={() => {
                    setIsFocused(true);
                }}
                onClick={() => {
                    setIsFocused(true);
                    textAreaRef.current?.focus();
                }}
                onBlur={() => {
                    setIsFocused(false);
                }}
            >
                <div className="flex flex-row gap-3">
                    <ProfilePicture user={user} />
                    {!collapsed && (
                        <div className="flex flex-col">
                            <UserNamesDisplay user={user} />
                            <span className="text-gray-500">just now</span>
                        </div>
                    )}
                </div>

                <textarea
                    className={clsx("px-0.5 text-3xl resize-none focus:outline-0", !collapsed && "mb-2.5")}
                    ref={textAreaRef}
                    placeholder="💭 What's vibin'?"
                    rows={1}
                    maxLength={MAX_POST_LENGTH}
                    value={content}
                    onInput={handleInput}
                ></textarea>
                {remainingChars / MAX_POST_LENGTH < 1 / 3 && (
                    <span
                        className={clsx(
                            remainingChars !== 0
                                ? "text-zinc-400"
                                : "text-red-400",
                            "absolute -bottom-2 right-0.5 text-sm"
                        )}
                    >
                        {remainingChars}
                    </span>
                )}
            </div>
            {!collapsed && (
                <div className="-mx-5 px-4.5 pt-4 flex flex-row items-center border-t border-zinc-700 ">
                    <div className="flex flex-row flex-1 justify-start"></div>
                    <div className="flex flex-row flex-1 justify-end gap-3 items-center">
                        <button
                            type="reset"
                            className="text-zinc-200 cursor-pointer px-1 my-2 hover:text-red-400 transition"
                            title="Discard"
                            onClick={(e) => {
                                e.preventDefault();
                                resetForm();
                            }}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                        <button
                            type="submit"
                            disabled={!content}
                            className="flex items-center space-x-2 bg-zinc-200 text-zinc-900 rounded-full px-4 py-2 disabled:opacity-60 enabled:cursor-pointer transition"
                        >
                            <FontAwesomeIcon icon={faPaperPlane} />
                            <span>Send</span>
                        </button>
                    </div>
                </div>
            )}
        </form>
    );
}
