"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Updated import
import {
  Input,
  Button,
  Spinner,
  Card
} from "@nextui-org/react";

interface User {
  id: number;
  name: string;
  age: number;
  region: string;
  avatar?: string;
  email?: string;
}

export default function ModifyClient() {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlId = urlParams.get('id');
    if (urlId) {
      setId(urlId);
      fetchUser(urlId);
    }
  }, []);

  const fetchUser = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/user/${userId}`);
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof User, value: string | number) => {
    if (user) {
      setUser({ ...user, [field]: value });
    }
  };

  const handleSave = async () => {
    if (user) {
      try {
        const response = await fetch("http://localhost:3001/api/updateuser", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });
        if (response.ok) {
          alert("User updated successfully");
          router.push("/clients");
        } else {
          console.error("Failed to update user");
        }
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center">
        <Spinner label="Loading..." />
      </div>
    );
  }

  return (
    <Card className="max-w-md mx-auto p-4">
      {user && (
        <form>
          <Input
            label="Name"
            value={user.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="mb-4"
          />
          <Input
            type="number"
            label="Age"
            value={String(user.age)}
            onChange={(e) => handleInputChange("age", Number(e.target.value))}
            className="mb-4"
          />
          <Input
            label="Region"
            value={user.region}
            onChange={(e) => handleInputChange("region", e.target.value)}
            className="mb-4"
          />
          <Button onClick={handleSave} color="success" className="mt-4">
            Save
          </Button>
        </form>
      )}
    </Card>
  );
}