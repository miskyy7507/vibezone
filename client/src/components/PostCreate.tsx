import { useState, useRef, useMemo } from "react";
import { clsx } from "clsx";

import { useAuth } from "../hooks/useAuth";
import { ProfilePicture } from "./ProfilePicture";
import { UserNamesDisplay } from "./UserNamesDisplay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTrashCan,
    faPaperPlane,
    faImage,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Post } from "../interfaces/post.interface";
import { handleFetchError } from "../utils/handleFetchError";
import { toast } from "react-toastify";
import TextareaAutosize from 'react-textarea-autosize';
import { apiUrl } from "../config";
import { Spinner } from "./Spinner";

export function PostCreate({ addPost }: { addPost: (post: Post) => void }) {
    const MAX_POST_LENGTH = 150;

    const [isFocused, setIsFocused] = useState(false);
    const [content, setContent] = useState("");
    const [collapsed, setCollapsed] = useState(true);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [isSending, setIsSending] = useState(false);

    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const remainingChars = MAX_POST_LENGTH - content.length;

    const { user, logout } = useAuth();

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        setCollapsed(false);
        setContent(e.currentTarget.value);
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
            setCollapsed(false);
        }
    };

    const selectedImagePreview = useMemo(() => {
        return selectedImage !== null ? URL.createObjectURL(selectedImage) : null;
    }, [selectedImage]);

    const removeSelectedImage = () => {
        setSelectedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Clear the file input
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsSending(true);

        let imageUrl: string | undefined;

        if (selectedImage) {
            const formData = new FormData();
            formData.append("image", selectedImage);

            try {
                const response = await fetch(
                    `${apiUrl}/post/image`,
                    {
                        method: "POST",
                        credentials: "include",
                        body: formData,
                    }
                );

                if (response.status === 200) {
                    const imageData = await response.json() as {"imageUrl": string};
                    imageUrl = imageData.imageUrl;
                } else if (response.status === 400) {
                    toast.error("An error occured uploading this picture. It may not be uploaded. Supported formats: png, jpg, gif, webp. Max size: 10MB.");
                } else if (response.status === 401) {
                    toast.warn("Your session has expired. Please log in back.");
                    logout();
                } else {
                    console.error(await response.text());
                    toast.error("Something went wrong when trying to upload the image. Try to reload the page.");
                }
            } catch (error) {
                handleFetchError(error);
            }
        }

        if (selectedImage && !imageUrl) {
            // at this point the image upload failed so return
            setIsSending(false);
            return;
        }

        try {
            const postResponse = await fetch(`${apiUrl}/post`, {
                method: "POST",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content,
                    imageUrl,
                }),
            });

            if (postResponse.status === 200) {
                const newPost = (await postResponse.json()) as Post;
                addPost(newPost);
                resetForm();
            } else if (postResponse.status === 401) {
                toast.warn("Your session has expired. Please log in back.");
                logout();
            } else {
                console.error(await postResponse.text());
                toast.error("Something went wrong when trying to do this action. Try to reload the page.");
            }
        } catch (error) {
            handleFetchError(error);
        } finally {
            setIsSending(false);
        }
    };

    const resetForm = () => {
        setIsFocused(false);
        setCollapsed(true);
        setContent("");
        removeSelectedImage();
    };

    if (!user) return;

    return (
        <form
            className={clsx(
                "flex flex-col gap-3 px-5 py-4 max-w-2xl w-full bg-zinc-800 rounded-xl ring-zinc-700 shadow-sm ring-1 transition",
                isFocused && "!ring-zinc-200 !shadow-2xl",
                !isFocused && collapsed && "opacity-65"
            )}
            onSubmit={(e) => {
                void handleSubmit(e);
            }}
        >
            <div
                className={clsx(
                    "flex gap-4 text-zinc-100 relative cursor-text",
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
                            <span className="text-zinc-500">just now</span>
                        </div>
                    )}
                </div>

                <TextareaAutosize
                    className={clsx(
                        "px-0.5 resize-none focus:outline-0",
                        !collapsed && "mb-2.5",
                        !selectedImage &&
                            content.length <= 60 &&
                            (content.match(/\n/g) || []).length <= 2
                            ? "text-3xl"
                            : "text-base" // If post content is short enough, we can show it with large font size.
                    )}
                    ref={textAreaRef}
                    placeholder="💭 What's vibin'?"
                    minRows={1}
                    maxLength={MAX_POST_LENGTH}
                    value={content}
                    onInput={handleInput}
                ></TextareaAutosize>
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
                <>
                    {selectedImagePreview && (
                        <div className="relative overflow-hidden -mx-5 -mb-3 border-t border-zinc-700">
                            <img
                                src={selectedImagePreview}
                                alt="Selected preview"
                                className="object-cover w-full h-full"
                            />
                            <button
                                type="button"
                                onClick={removeSelectedImage}
                                className="absolute top-2 right-2 size-[32px] bg-red-400 text-white rounded-full"
                                title="Remove image"
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                    )}
                    <div className="-mx-5 px-4.5 pt-4 flex flex-row items-center border-t border-zinc-700 ">
                        <div className="flex flex-row flex-1 justify-start">
                            <input
                                type="file"
                                id="filePicker"
                                accept="image/png, image/jpeg, image/gif, image/webp"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleImageSelect}
                                disabled={isSending}
                            />
                            <label
                                htmlFor="filePicker"
                                className="text-zinc-200 cursor-pointer px-1 my-2 hover:text-zinc-400 transition"
                                title="Upload image"
                            >
                                <FontAwesomeIcon icon={faImage} />
                            </label>
                        </div>
                        <div className="flex flex-row flex-1 justify-end gap-3 items-center">
                            <button
                                type="reset"
                                className="text-zinc-200 enabled:cursor-pointer px-1 my-2 enabled:hover:text-red-400 transition"
                                title="Discard"
                                disabled={isSending}
                                onClick={(e) => {
                                    e.preventDefault();
                                    resetForm();
                                }}
                            >
                                <FontAwesomeIcon icon={faTrashCan} />
                            </button>
                            <button
                                type="submit"
                                disabled={isSending || !content}
                                className="flex items-center justify-center w-24 text-center space-x-2 bg-zinc-200 text-zinc-900 rounded-full py-2 disabled:opacity-60 enabled:cursor-pointer transition"
                            >
                                {isSending ? (
                                    <Spinner size="tiny" theme="light" />
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faPaperPlane} />
                                        <span>Send</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </form>
    );
}
