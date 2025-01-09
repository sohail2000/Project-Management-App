import { useState } from "react";
import useDebounce from "~/hooks/useDebounce";
import { api } from "~/utils/api";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import type { CUser } from "~/types/types";
import { useRouter } from "next/router";

interface SearchUserBoxProps {
    onSelect: (users: CUser[]) => void;
    selectedUsers: CUser[];
}

export default function SearchUserBox({ onSelect, selectedUsers }: SearchUserBoxProps) {
    const router = useRouter();
    const { id } = router.query;
    const projectId = Array.isArray(id) ? id[0] : id;
    const [search, setSearch] = useState<string>("");
    const debouncedSearchTerm = useDebounce(search, 200);

    // Fetch users
    const { data, isLoading } = api.user.searchInProjectByUsername.useQuery(
        { searchTerm: debouncedSearchTerm ?? "", projectId: projectId ?? "" },
        { enabled: true }
    );


    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        const userId = target.dataset.id;
        const userName = target.dataset.name;

        if (userId && userName) {
            const user: CUser = { id: userId, name: userName };

            if (target.dataset.action === "select") {
                if (!selectedUsers.some((selectedUser) => selectedUser.id === user.id)) {
                    onSelect([...selectedUsers, user]);
                }
            } else if (target.dataset.action === "unselect") {
                onSelect(selectedUsers.filter((selectedUser) => selectedUser.id !== user.id));
            }
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2" onClick={handleClick}>
                {selectedUsers.map((user) => (
                    <Badge
                        key={user.id}
                        variant="secondary"
                        data-id={user.id}
                        data-name={user.name}
                        data-action="unselect"
                        className="cursor-pointer bg-slate-200 hover:bg-slate-400"
                    >
                        {user.name}
                    </Badge>
                ))}
            </div>
            <Input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for users"
            />
            <div className="rounded-md mt-2 space-x-1" onClick={handleClick}>
                {isLoading ? (
                    <div className="text-xs text-black p-2">Loading...</div>
                ) : (
                    data?.map((user) => (
                        <Badge
                            key={user.id}
                            variant="outline"
                            data-id={user.id}
                            data-name={user.name}
                            data-action="select"
                            className="cursor-pointer hover:bg-slate-400"
                        >
                            {user.name}
                        </Badge>
                    ))
                )}
            </div>
        </div>
    );
}
