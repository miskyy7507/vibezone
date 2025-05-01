import { UserListItem } from "../components/UserListItem";

import { placeholderUsers } from "../placeholderUsers";


export function Users() {

    return (
        <div className="flex flex-col items-center">
            {
                placeholderUsers.map((user) => (
                    <UserListItem user={user} key={user._id} />
                ))
            }
        </div>
    );
}
