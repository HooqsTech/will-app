import { useEffect, useState } from "react"
import { getAllUsers } from "../api/user"
import AdminUserCard from "../components/AdminUserCard"
import CustomSearchBox from "../components/CustomSearchBox"
import Header from "../components/Header"
import { IAdminUserData } from "../models/user"

const AdminPage = () => {
    const [users, setUsers] = useState<IAdminUserData[]>([])
    const [filteredUsers, setFilteredUsers] = useState<IAdminUserData[]>([]);
    const [filterText, setFilterText] = useState("");

    useEffect(() => {
        getAllUsersAndSetState();
    }, [])

    const getAllUsersAndSetState = async () => {
        const users = await getAllUsers()
        setUsers(users.filter(u => u.role !== "ADMIN"));
    }

    const filterUser = (query: string) => {
        const fUsers = users.filter(u => u.personaldetails?.details?.firstName?.toLowerCase().includes(query.toLowerCase())
            || u.personaldetails?.details?.lastName?.toLowerCase().includes(query));
        setFilterText(query);
        setFilteredUsers(fUsers);
    }

    return (
        <div>
            <Header isAdmin={true} />
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="top-24 sticky z-30 bg-white">
                    <CustomSearchBox type="text" label="Search" onChange={(e) => filterUser(e)} value={filterText} />
                </div>
                <div className="grid gap-6 pt-4">
                    {
                        filterText !== undefined && filterText !== "" ? (
                            filteredUsers.map((user) => (
                                <div className="py-1" key={user.userid}>
                                    <AdminUserCard user={user} />
                                </div>
                            ))
                        ) : (
                            users.map((user) => (
                                <div className="py-1" key={user.userid}>
                                    <AdminUserCard user={user} />
                                </div>
                            ))
                        )
                    }
                </div>
            </div>
            
        </div>
    )
}

export default AdminPage