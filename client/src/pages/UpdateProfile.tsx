import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "../hooks/useAuth";
import { uploadsUrl } from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { Spinner } from "../components/Spinner";

export function UpdateProfile() {
    const { user } = useAuth();

    // File - update pfp to the new image.
    // null - explicitly remove the currently set profile picture.
    // undefined - no change, do not send any requests regarding pfp to api.
    const [selectedPfp, setSelectedPfp] = useState<File | null | undefined>(undefined);

    const [displayName, setDisplayName] = useState<string>(user?.displayName || "");
    const [aboutDesc, setAboutDesc] = useState<string>(user?.aboutDesc || "");

    const [selectedPfpPreview, setSelectedPfpPreview] = useState<string | null>(null);
    const [buttonDisabled, setButtonDisabled] = useState(false);
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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

    }

    // "cache" pfp preview to avoid memory leaks
    useEffect(() => {
        if (!selectedPfp) {
            setSelectedPfpPreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(selectedPfp);
        setSelectedPfpPreview(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [selectedPfp]);

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
        <main className="flex flex-col p-6 max-w-2xl w-full items-center">
            <h2 className="text-5xl text-center my-6 font-bold">
                Update your profile
            </h2>
            <form className="flex flex-col gap-5 text-xl "
                onSubmit={(e) => {handleSubmit(e)}}>
                <div>
                    <img
                        className="size-32 rounded-full object-cover"
                        src={
                            selectedPfpPreview ??
                            (user.profilePictureUri
                                ? `${uploadsUrl}/${user.profilePictureUri}`
                                : "/pfp_placeholder.svg")
                        }
                    />
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
                    {(user.profilePictureUri || selectedPfp) && (
                        <button
                            className="text-zinc-200 cursor-pointer px-1 my-2 hover:text-zinc-400 transition"
                            title="Remove current profile picture"
                            onClick={handleImageRemoval}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                    )}
                </div>
                <input
                    className="border border-zinc-200 rounded-xl p-5 focus:outline-3 focus:outline-zinc-200 focus:outline-offset-1"
                    type="text"
                    placeholder="Display name"
                    value={displayName}
                    onChange={(e) => {
                        setDisplayName(e.target.value);
                    }}
                />
                <input
                    className="border border-zinc-200 rounded-xl p-5 focus:outline-3 focus:outline-zinc-200 focus:outline-offset-1"
                    type="text"
                    placeholder="About description"
                    value={aboutDesc}
                    onChange={(e) => {
                        setAboutDesc(e.target.value);
                    }}
                />
                <button
                    className={clsx(
                        buttonDisabled
                            ? "opacity-55"
                            : "hover:opacity-85 cursor-pointer",
                        "py-5.25 text-zinc-900 bg-zinc-200 rounded-xl focus:outline-3 focus:outline-zinc-200 focus:outline-offset-1"
                    )}
                    type="submit"
                    disabled={buttonDisabled}
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
