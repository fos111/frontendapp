"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Button,
  Input,
  Spinner,
} from "@nextui-org/react";
import { DeleteIcon } from "@/components/icons";
import { EditIcon } from "@/components/icons";
import { FaSave } from 'react-icons/fa';

interface User {
  id: number;
  name: string;
  age: number;
  region: string;
  avatar?: string;
  email?: string;
}

const columns = [
  { name: "NAME", uid: "name" },
  { name: "AGE", uid: "age" },
  { name: "REGION", uid: "region" },
  { name: "ACTIONS", uid: "actions" },
];

export default function ClientsPage() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterValue, setFilterValue] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users`);
      const data = await response.json();
      console.log("Fetched Users:", data);
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/supprimerClient/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("User deleted successfully");
        // Refresh the user list after deletion
        fetchUsers();
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEditClick = (user: User) => {
    const queryParams = new URLSearchParams({
      id: user.id.toString(),
      name: user.name,
      age: user.age.toString(),
      region: user.region,
    }).toString();

    window.location.href = `${window.location.origin}/ajouteClient?${queryParams}`;
  };

  const handleInputChange = (field: keyof User, value: string | number) => {
    if (editingUser) {
      setEditingUser({ ...editingUser, [field]: value });
    }
  };

  const filteredUsers = useMemo(() => {
    if (!filterValue.trim()) {
      return users;
    }
    return users.filter((user) =>
      user.name.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [users, filterValue]);

  const renderCell = (user: User, columnKey: keyof User | "actions") => {
    const cellValue = user[columnKey as keyof User];
    switch (columnKey) {
      case "name":
        return (
          <div>{editingUser?.id === user.id ? (
            <Input
              value={user.name}
              onChange={(e) => handleInputChange(columnKey, e.target.value)}
              size="sm"
            />
          ) : (
            cellValue
          )}</div>
        );
      case "age":
      case "region":
        return editingUser?.id === user.id ? (
          <Input
            value={String(cellValue)} // Convert number to string
            onChange={(e) => handleInputChange(columnKey, e.target.value)}
            size="sm"
          />
        ) : (
          <div>{cellValue}</div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content={editingUser?.id === user.id ? "Save" : "Edit user"}>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onClick={() => handleEditClick(user)}
              >
                {editingUser?.id === user.id ? <FaSave /> : <EditIcon />}
              </Button>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <Button
                isIconOnly
                size="sm"
                color="danger"
                variant="light"
                onClick={() => handleDeleteClick(user.id)}
              >
                <DeleteIcon />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };

  return (
    <>
      <Input
        isClearable
        className="w-full sm:max-w-[44%] mb-4"
        placeholder="Search by name..."
        value={filterValue}
        onValueChange={(value) => setFilterValue(value || "")}
      />
      {loading ? (
        <div className="flex justify-center">
          <Spinner label="Loading..." />
        </div>
      ) : (
        <Table aria-label="Editable users table">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={filteredUsers}>
            {(item: User) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>
                    {renderCell(item, columnKey as keyof User | "actions")}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </>
  );
}
