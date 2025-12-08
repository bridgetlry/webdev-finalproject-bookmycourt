"use client";
import { Table, Button, FormControl } from "react-bootstrap";
import { FaCircleUser, FaTrash, FaPencil, FaCheck, FaXmark } from "react-icons/fa6";
import { useState } from "react";
import * as client from "../client";
import "../Account.css";

export default function PeopleTable({
  users = [],
  fetchUsers,
}: {
  users?: any[];
  fetchUsers: () => void;
}) {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<any>({});

  const startEdit = (user: any) => {
    setEditingUserId(user._id);
    setEditedUser({ ...user });
  };

  const saveEdit = async () => {
    try {
      await client.updateUser(editedUser);
      setEditingUserId(null);
      setEditedUser({});
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditedUser({});
  };

  const deleteUser = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      try {
        await client.deleteUser(userId);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user");
      }
    }
  };

  return (
    <div className="mx-auto" style={{ display: "inline-block" }}>
      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user._id}>
              {editingUserId === user._id ? (
                <>
                  <td className="wd-full-name">
                    <div className="d-flex gap-2">
                      <FormControl
                        size="sm"
                        value={editedUser.firstName || ""}
                        onChange={(e) =>
                          setEditedUser({
                            ...editedUser,
                            firstName: e.target.value,
                          })
                        }
                        placeholder="First Name"
                      />
                      <FormControl
                        size="sm"
                        value={editedUser.lastName || ""}
                        onChange={(e) =>
                          setEditedUser({
                            ...editedUser,
                            lastName: e.target.value,
                          })
                        }
                        placeholder="Last Name"
                      />
                    </div>
                  </td>
                  <td>
                    <FormControl
                      size="sm"
                      value={editedUser.username || ""}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          username: e.target.value,
                        })
                      }
                      placeholder="Username"
                    />
                  </td>
                  <td>
                    <FormControl
                      size="sm"
                      type="email"
                      value={editedUser.email || ""}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, email: e.target.value })
                      }
                      placeholder="Email"
                    />
                  </td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={editedUser.role || "CUSTOMER"}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, role: e.target.value })
                      }
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="COURTOWNER">Court Owner</option>
                      <option value="CUSTOMER">Customer</option>
                    </select>
                  </td>
                  <td className="text-nowrap">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={saveEdit}
                      className="me-2"
                    >
                      <FaCheck />
                    </Button>
                    <Button variant="secondary" size="sm" onClick={cancelEdit}>
                      <FaXmark />
                    </Button>
                  </td>
                </>
              ) : (
                <>
                  <td className="wd-full-name text-nowrap">
                    <FaCircleUser className="me-2 fs-1 text-secondary" />
                    <span>
                      {user.firstName} {user.lastName}
                    </span>
                  </td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td className="wd-role">{user.role}</td>
                  <td className="text-nowrap">
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => startEdit(user)}
                      className="me-2"
                    >
                      <FaPencil />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        deleteUser(
                          user._id,
                          `${user.firstName} ${user.lastName}`
                        )
                      }
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}