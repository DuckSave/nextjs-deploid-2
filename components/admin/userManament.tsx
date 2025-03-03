"use client";
import { useEffect, useState } from "react";
import UserAPI from "@/api/admin";
import { toast } from "@/components/hook/use-toast";
import { AdminMenu } from "@/components/admin/admin-menu"
import { Eye, EyeOff } from "lucide-react";
interface User {
  userId: string;
  userName: string;
  gmail: string;
  password: String;
}

const AdminAccount = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ userName: "", gmail: "", password: "" });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  // Fetch user list
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await UserAPI.account.seresere();
      if (response.status === 200) {
        setUsers(response.data);
        console.log(response.data);
      } else {
        console.error("Lỗi: Response không hợp lệ");
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast({ title: "Lỗi", description: "Không thể tải danh sách user.", variant: "destructive" });
    }
  };

  // // Create user
  // const handleCreateUser = async () => {
  //   if (!newUser.userName || !newUser.gmail) {
  //     toast({ title: "Lỗi", description: "Vui lòng nhập đủ thông tin.", variant: "destructive" });
  //     return;
  //   }
  //   try {
  //     const response = await UserAPI.account.createUser(newUser);
  //     if (response.status === 201) {
  //       toast({ title: "Thành công", description: "User đã được tạo." });
  //       setUsers([...users, response.data]);
  //       setNewUser({ userName: "", gmail: "" });
  //     }
  //   } catch (error) {
  //     console.error("Lỗi tạo user:", error);
  //     toast({ title: "Lỗi", description: "Không thể tạo user.", variant: "destructive" });
  //   }
  // };

  // // Edit user
  // const handleEditUser = (user: User) => {
  //   setEditingUser(user);
  // };

  // // Update user
  // const handleUpdateUser = async () => {
  //   if (!editingUser) return;
  //   try {
  //     const response = await UserAPI.account.updateUser(editingUser.userId, editingUser);
  //     if (response.status === 200) {
  //       toast({ title: "Thành công", description: "User đã được cập nhật." });
  //       setUsers(users.map((u) => (u.userId === editingUser.userId ? editingUser : u)));
  //       setEditingUser(null);
  //     }
  //   } catch (error) {
  //     console.error("Lỗi cập nhật user:", error);
  //     toast({ title: "Lỗi", description: "Không thể cập nhật user.", variant: "destructive" });
  //   }
  // };

  // // Delete user
  // const handleDeleteUser = async (userId: string) => {
  //   try {
  //     await UserAPI.account.deleteUser(userId);
  //     toast({ title: "Thành công", description: "User đã bị xóa." });
  //     setUsers(users.filter((user) => user.userId !== userId));
  //   } catch (error) {
  //     console.error("Lỗi xóa user:", error);
  //     toast({ title: "Lỗi", description: "Không thể xóa user.", variant: "destructive" });
  //   }
  // };

  return (
    <div className="min-h-screen bg-background">
      <AdminMenu />
      <main className="container mx-auto p-4 md:p-6">
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-blue-600">
              Quản lý Users
            </h1>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Thêm User</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <input
                type="text"
                name="username" 
                placeholder="Tên user"
                className="border rounded-md px-3 py-2 w-full bg-white text-black placeholder-gray-500 dark:bg-black dark:text-white dark:placeholder-gray-400"
                value={newUser.userName}
                onChange={(e) =>
                  setNewUser({ ...newUser, userName: e.target.value })
                }
                autoComplete="username" 
              />
              <input
                type="email"
                name="email" 
                placeholder="Email"
                className="border rounded-md px-3 py-2 w-full bg-white text-black placeholder-gray-500 dark:bg-black dark:text-white dark:placeholder-gray-400"
                value={newUser.gmail}
                onChange={(e) =>
                  setNewUser({ ...newUser, gmail: e.target.value })
                }
                autoComplete="email"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="border rounded-md px-3 py-2 w-full bg-white text-black placeholder-gray-500 dark:bg-black dark:text-white dark:placeholder-gray-400 pr-10"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600 dark:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <button className="bg-green-500 text-white px-4 py-2 rounded-md">
                Thêm
              </button>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-5">Danh sách Users</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-gray-700 dark:bg-black dark:text-white">
                  <th className="border p-3">User ID</th>
                  <th className="border p-3">Tên</th>
                  <th className="border p-3">Email</th>
                  <th className="border p-3">Password</th>
                  <th className="border p-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.userId} className="text-center">
                      <td className="border p-2">{user.userId}</td>
                      <td className="border p-2">{user.userName}</td>
                      <td className="border p-2">{user.gmail}</td>
                      <td className="border p-2">{user.password}</td>
                      <td className="border p-2 flex justify-center gap-2">
                        <button 
                          className="bg-blue-500 text-white px-3 py-1 rounded-md"
                          onClick={() => setEditingUser(user)}
                        >
                          Sửa
                        </button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded-md">
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-500 py-3">
                      Đang tải...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Cập nhật User */}
          {editingUser && (
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Cập nhật User</h2>
              <div className="grid gap-4">
                <input
                  type="text"
                  className="border rounded-md px-3 py-2 w-full"
                  value={editingUser.userName}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, userName: e.target.value })
                  }
                />
                <input
                  type="email"
                  className="border rounded-md px-3 py-2 w-full"
                  value={editingUser.gmail}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, gmail: e.target.value })
                  }
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
                  Cập nhật
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminAccount;
