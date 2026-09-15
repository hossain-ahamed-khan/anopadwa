"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

type AccessLevel = "Super Admin" | "Admin";

interface AdminUser {
    id: string;
    slNo: string;
    name: string;
    email: string;
    accessLevel: AccessLevel;
}

const MOCK_ADMINS: AdminUser[] = [
    { id: "1", slNo: "#1233", name: "Kathryn Murp", email: "bockely@att.com", accessLevel: "Super Admin" },
    { id: "2", slNo: "#1233", name: "Devon Lane", email: "csilvers@rizon.com", accessLevel: "Admin" },
    { id: "3", slNo: "#1233", name: "Foysal Rahman", email: "qamaho@mail.com", accessLevel: "Admin" },
    { id: "4", slNo: "#1233", name: "Hari Danang", email: "xterris@gmail.com", accessLevel: "Admin" },
    { id: "5", slNo: "#1233", name: "Floyd Miles", email: "xterris@gmail.com", accessLevel: "Admin" },
    { id: "6", slNo: "#1233", name: "Eleanor Pena", email: "xterris@gmail.com", accessLevel: "Admin" },
    { id: "7", slNo: "#1233", name: "Devon Lane", email: "xterris@gmail.com", accessLevel: "Admin" },
    { id: "8", slNo: "#1233", name: "Hari Danang", email: "xterris@gmail.com", accessLevel: "Admin" },
    { id: "9", slNo: "#1233", name: "Hari Danang", email: "xterris@gmail.com", accessLevel: "Admin" },
];

export default function AdminManagementTable() {
    const [admins, setAdmins] = useState<AdminUser[]>(MOCK_ADMINS);

    const handleInvite = () => {
        // eslint-disable-next-line no-console
        console.log("Open invite new admin modal");
    };

    const handleEdit = (id: string) => {
        // eslint-disable-next-line no-console
        console.log("Edit admin", id);
    };

    const handleDelete = (id: string) => {
        setAdmins((prev) => prev.filter((a) => a.id !== id));
    };

    return (
        <div className="w-full rounded-2xl border border-orange-100 bg-orange-50/40 p-4 sm:p-6">
            <div className="rounded-xl bg-white shadow-sm">
                {/* Header action */}
                <div className="p-6">
                    <button
                        onClick={handleInvite}
                        className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600"
                    >
                        <Plus className="h-4 w-4" />
                        Invite new admin
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] border-collapse">
                        <thead>
                            <tr className="text-left text-sm text-gray-700">
                                <th className="px-6 pb-4 font-semibold">SL no.</th>
                                <th className="px-6 pb-4 font-semibold">Name</th>
                                <th className="px-6 pb-4 font-semibold">Email</th>
                                <th className="px-6 pb-4 text-center font-semibold">Has Access to</th>
                                <th className="px-6 pb-4 text-center font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map((admin) => (
                                <tr key={admin.id} className="text-sm text-gray-700">
                                    <td className="px-6 py-3 align-top">{admin.slNo}</td>
                                    <td className="px-6 py-3">{admin.name}</td>
                                    <td className="px-6 py-3">{admin.email}</td>
                                    <td className="px-6 py-3 text-center">{admin.accessLevel}</td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(admin.id)}
                                                className="inline-flex items-center justify-center rounded-md bg-amber-500 p-2 text-white transition hover:bg-amber-600"
                                                aria-label="Edit admin"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(admin.id)}
                                                className="inline-flex items-center justify-center rounded-md bg-red-500 p-2 text-white transition hover:bg-red-600"
                                                aria-label="Delete admin"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {admins.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-400">
                                        No admins found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}