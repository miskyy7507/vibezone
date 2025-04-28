import { UserData, UserListItem } from "../components/UserListItem";

export function Users() {
    const placeholderUsers: Array<UserData> = [
        {
            id: "2",
            displayName: "/[Mm]iskyy?/g",
            username: "miskyy_",
            aboutDesc: "Founder and developer of vibezone"
        },
        {
            id: "1",
            displayName: "Arthur",
            username: "arthuro",
        },
        {
            id: "3",
            username: "chad",
            aboutDesc: "front end developer",
            profilePictureUri: "https://i.pinimg.com/originals/25/bd/8b/25bd8b7f6e57cdfd17747b25d753b2ce.jpg"
        }
    ];

    return (
        <div className="flex flex-col items-center">
            {
                placeholderUsers.map((user) => (
                    <UserListItem user={user} />
                ))
            }
        </div>
    );
}
