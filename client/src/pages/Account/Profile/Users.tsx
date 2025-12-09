"use client";
import { useState, useEffect } from "react";
import * as client from "../client";
import { FaPlus } from "react-icons/fa6";
import PeopleTable from "./PeopleTable";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");

  const createUser = async () => {
    const user = await client.createUser({
      firstName: "Jane",
      lastName: `Doe${users.length + 1}`,
      username: `newuser${Date.now()}`,
      password: "password123",
      email: `newuser${Date.now()}@example.com`,
      role: "CUSTOMER",
    });
    setUsers([...users, user]);
  };

  const fetchUsers = async () => {
    try {
      let response;

      // Apply filters based on what's selected
      if (role && name) {
        response = await client.findUsersByRoleAndName(role, name);
      } else if (role) {
        response = await client.findUsersByRole(role);
      } else if (name) {
        response = await client.findUsersByPartialName(name);
      } else {
        response = await client.findAllUsers();
      }

      setUsers(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
  };

  const handleNameChange = (newName: string) => {
    setName(newName);
  };

  // Re-fetch when filters change
  useEffect(() => {
    fetchUsers();
  }, [role, name]);

  return (
    <div className="wd-people-table">
      <h2>Users</h2>
      <button onClick={createUser} className="float-end btn btn-danger">
        <FaPlus className="me-2" />
        People
      </button>
      <input
        placeholder="Search people"
        value={name}
        onChange={(e) => handleNameChange(e.target.value)}
        className="form-control float-start w-25 me-2"
      />
      <select
        value={role}
        onChange={(e) => handleRoleChange(e.target.value)}
        className="form-select float-start w-25 wd-select-role"
      >
        <option value="">All Roles</option>
        <option value="ADMIN">Admin</option>
        <option value="COURTOWNER">Court Owner</option>
        <option value="CUSTOMER">Customer</option>
      </select>
      <div className="d-flex justify-content-center">
        <PeopleTable users={users} fetchUsers={fetchUsers} />
      </div>
    </div>
  );
}