import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "../hooks/useAuth";
import { apiUrl, uploadsUrl } from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { Spinner } from "../components/Spinner";
import { handleFetchError } from "../utils/handleFetchError";
import { toast } from "react-toastify";

export function UpdateProfile() {
    const { user, logout } = useAuth();

    // File - update pfp to the new image.
    // null - explicitly remove the currently set profile picture.
    // undefined - no change, do not send any requests regarding pfp to api.
    const [selectedPfp, setSelectedPfp] = useState<File | null | undefined>(undefined);

    const [displayNameInput, setDisplayNameInput] = useState<string>(user?.displayName || "");
    const [aboutDescInput, setAboutDescInput] = useState<string>(user?.aboutDesc || "");

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.files && e.currentTarget.files[0]) {
            setSelectedPfp(e.currentTarget.files[0]);
        }
    };

    const handleImageRemoval = () => {
        setSelectedPfp(user?.profilePictureUri ? null : undefined);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        if (selectedPfp) {
            const formData = new FormData();
            formData.append("avatar", selectedPfp);

            try {
                const response = await fetch(
                    `${apiUrl}/profile/picture`,
                    {
                        method: "POST",
                        credentials: "include",
                        body: formData,
                    }
                );

                if (response.status === 400) {
                    toast.error("An error occured uploading this picture. It may not be uploaded. Supported formats: png, jpg, gif, webp. Max size: 10MB.");
                    setIsLoading(false);
                    return;
                } else if (response.status === 401) {
                    toast.warn("Your session has expired. Please log in back.");
                    logout();
                } else if (response.status !== 200) {
                    console.error(await response.text());
                    toast.error("Something went wrong when trying to upload the image. Try to reload the page.");
                    setIsLoading(false);
                    return;
                }
            } catch (error) {
                handleFetchError(error);
                setIsLoading(false);
                return;
            }
        } else if (selectedPfp === null) {
            try {
                const response = await fetch(
                    `${apiUrl}/profile/picture`,
                    {
                        method: "DELETE",
                        credentials: "include",
                    }
                );

                if (response.status === 401) {
                    toast.warn("Your session has expired. Please log in back.");
                    logout();
                } else if (response.status !== 204) {
                    console.error(await response.text());
                    toast.error("Something went wrong when trying to remove the image. Try to reload the page.");
                    setIsLoading(false);
                    return;
                }
            } catch (error) {
                handleFetchError(error);
                setIsLoading(false);
                return;
            }
        }

        try {
            const response = await fetch(`${apiUrl}/profile/update`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "displayName": displayNameInput === "" ? null : displayNameInput,
                    "aboutDesc": aboutDescInput === "" ? null : aboutDescInput
                }),
            });
            if (response.status === 200) {
                toast.success("Updated profile info!");
                window.location.reload();
            } else if (response.status === 401) {
                toast.warn("Your session has expired. Please log in back.");
                logout();
            } else {
                console.error(await response.text());
                toast.error("An unexpected error occured when trying to do this action. Please try again later.")
            }
        } catch (error) {
            handleFetchError(error);
        } finally {
            setIsLoading(false);
        }
    }

    // "cache" picked profile picture object URL for preview to avoid memory leaks
    const selectedPfpPreview = useMemo(() =>
        selectedPfp != null ? URL.createObjectURL(selectedPfp) : null
    , [selectedPfp]);

    // if user is not logged in, move to the home page
    useEffect(() => {
        if (!user) {
            void navigate("/");
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!user) {
        return;
    }

    return (
        <main className="m-auto p-6 pb-16 max-w-2xl w-full">
            <h2 className="text-5xl text-center my-6 font-bold">
                Update your profile
            </h2>
            <form
                className="flex flex-col gap-5 text-xl "
                onSubmit={(e) => {
                    void handleSubmit(e);
                }}
            >
                <div className="flex flex-col items-center">
                    <img
                        className="size-32 rounded-full object-cover"
                        src={selectedPfp === null ? "/pfp_placeholder.svg" :
                            (selectedPfpPreview ??
                            (user.profilePictureUri
                                ? `${uploadsUrl}/${user.profilePictureUri}`
                                : "/pfp_placeholder.svg"))
                        }
                    />
                    <div className="flex gap-4">
                    <input
                        type="file"
                        id="filePicker"
                        accept="image/png, image/jpeg, image/gif, image/webp"
                        className="hidden"
                        onChange={handleImageSelect}
                    />
                    <label
                        htmlFor="filePicker"
                        className="text-zinc-200 cursor-pointer px-1 my-2 hover:text-zinc-400 transition"
                        title="Upload picture"
                    >
                        <FontAwesomeIcon icon={faUpload} />
                    </label>
                    {(selectedPfp || user.profilePictureUri && selectedPfp === undefined) && (
                        <button
                            type="button"
                            className="text-zinc-200 cursor-pointer px-1 my-2 hover:text-red-400 transition"
                            title="Remove current profile picture"
                            onClick={handleImageRemoval}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                    )}
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <input
                    className="peer border border-zinc-200 rounded-xl p-5 focus:outline-3 focus:outline-zinc-200 focus:outline-offset-1"
                    type="text"
                    placeholder="Display name"
                    value={displayNameInput}
                    maxLength={32}
                    onChange={(e) => {
                        setDisplayNameInput(e.target.value);
                    }}
                   />
                    <p className="hidden peer-focus:block text-sm">Custom name displayed next to your posts and comments.</p>
                </div>
                <div className="flex flex-col gap-1.5">
                    <input
                        className="peer border border-zinc-200 rounded-xl p-5 focus:outline-3 focus:outline-zinc-200 focus:outline-offset-1"
                        type="text"
                        placeholder="About description"
                        value={aboutDescInput}
                        maxLength={150}
                        onChange={(e) => {
                            setAboutDescInput(e.target.value);
                        }}
                    />
                    <p className="hidden peer-focus:block text-sm">Profile description. Up to 150 characters.</p>
                </div>
                <button
                    className={clsx(
                        isLoading
                            ? "opacity-55"
                            : "hover:opacity-85 cursor-pointer",
                        "py-5.25 text-zinc-900 bg-zinc-200 rounded-xl h-80px focus:outline-3 focus:outline-zinc-200 focus:outline-offset-1"
                    )}
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="-m-0.5">
                            <Spinner size="small" theme="light" />
                        </div>
                    ) : (
                        "Update profile"
                    )}
                </button>
            </form>
        </main>
    );
}
