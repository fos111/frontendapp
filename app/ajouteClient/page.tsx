"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Toaster, toast } from "sonner";

// Updated list of regions based on the provided cities
const regions = [
  { ID_region: 1, libelle: "Mahdia" },
  { ID_region: 2, libelle: "Tunis" },
  { ID_region: 3, libelle: "Gafsa" },
  { ID_region: 4, libelle: "Kef" },
  { ID_region: 5, libelle: "Tataouine" },
];

export default function AddUserPage() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const searchParams = useSearchParams(); // Get query parameters from the URL
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    age: "",
    ID_region: "",
  });

  // Use useEffect to populate the form when the component mounts or when the query params change
  useEffect(() => {
    const id = searchParams.get("id");
    const fullName = searchParams.get("name");
    const age = searchParams.get("age");
    const region = searchParams.get("region");

    if (fullName) {
      const [nom, prenom] = fullName.split(" ");
      setFormData({
        nom: nom || "",
        prenom: prenom || "",
        age: age || "",
        ID_region: regions.find((r) => r.libelle === region)?.ID_region.toString() || "",
      });
    }
  }, [searchParams]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setFormData({ ...formData, ID_region: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/adduser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        // Show success notification
        toast.success("Utilisateur ajouté avec succès");
        // Redirect to /clients page
        router.push('/clients');
      } else {
        // Handle error
        toast.error("Échec de l'ajout de l'utilisateur");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Une erreur s'est produite");
    }
  };

  return (
    <>
      <Toaster />
      <form onSubmit={handleSubmit}>
        <Input
          label="Nom"
          name="nom"
          value={formData.nom}
          onChange={handleInputChange}
          required
        />
        <Input
          label="Prénom"
          name="prenom"
          value={formData.prenom}
          onChange={handleInputChange}
          required
        />
        <Input
          label="Âge"
          name="age"
          type="number"
          value={formData.age}
          onChange={handleInputChange}
          required
        />
        <Select
          label="Région"
          name="ID_region"
          value={formData.ID_region}
          onChange={handleSelectChange}
        >
          {regions.map((region) => (
            <SelectItem key={region.ID_region} value={region.ID_region.toString()}>
              {region.libelle}
            </SelectItem>
          ))}
        </Select>
        <Button type="submit">Ajouter</Button>
      </form>
    </>
  );
}
