import { useState } from "react";
import { User, Mail, Lock, Edit2, Save, Camera, X } from "lucide-react";
import "../Styles/profile.css";
import styled from "styled-components";
import { updateData as updateUserData } from "../services/authProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const Img = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
`;

const FileInput = styled.input`
  opacity: 0;
  position: absolute;
  z-index: -1;

  & + label {
    cursor: pointer;
    padding: 10px 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f0f0f0;
    font-size: 16px;
    font-weight: bold;
  }

  &:focus + label {
    border-color: #aaa;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  }
`;

const FileInputLabel = styled.label`
  padding: 10px 20px;
`;

export default function Profile({ isOpen, onClose, userData }) {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({
    first_name: userData?.first_name || "islam",
    last_name: userData?.last_name || "boubaker",
    email: userData?.email || "boubaker@.com",
    password: "",
  });

  const [editMode, setEditMode] = useState({
    first_name: false,
    last_name: false,
    email: false,
    password: false,
  });

  const [newPassword, setNewPassword] = useState("");
  const queryClient = useQueryClient();

  const { mutate: updateUser, isPending } = useMutation({
    mutationFn: ({ userId, currentData, newData }) =>
      updateUserData({ userId, currentData, newData }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      // window.location.reload();
      toast.success("Profile updated successfully");
    },
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleInputChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEdit = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
    if (field === "password" && editMode.password) {
      handleInputChange("password", newPassword);
      setNewPassword("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newData = {
      ...user,
      image: file,
    };
    console.log(newData);
    updateUser({
      userId: userData.id,
      currentData: userData,
      newData,
    });
  };

  const FileInputContainer = () => (
    <div>
      <FileInput onChange={handleFileChange} type="file" id="file-input" />
      <FileInputLabel htmlFor="file-input">upload a picture</FileInputLabel>
    </div>
  );

  const closeModal = () => {
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={closeModal}></div>

      <div className="modal-wrapper">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">Profile Settings</h2>
            <button onClick={closeModal} className="close-modal-btn">
              <X size={24} />
            </button>
          </div>

          <div className="modal-body">
            <div className="profile-header">
              <div className="avatar-container">
                <div className="avatar">
                  {file || userData.image ? (
                    <Img src={userData.image} />
                  ) : (
                    <User size={64} className="avatar-placeholder" />
                  )}
                </div>
                <FileInputContainer />
              </div>
              {file && <h3 style={{ color: "lightBlue" }}>{file.name}</h3>}
              <h2 className="profile-name">
                {user.first_name} {user.last_name}
              </h2>
              <p className="profile-email">{user.email}</p>
            </div>

            <div className="profile-info">
              {/* First Name */}
              <div className="info-card">
                <div className="card-header">
                  <div className="card-title-container">
                    <User className="card-icon" size={20} />
                    <h3 className="card-title">First Name</h3>
                  </div>
                  <button
                    onClick={() => toggleEdit("first_name")}
                    className="edit-btn"
                  >
                    {editMode.first_name ? (
                      <Save size={18} />
                    ) : (
                      <Edit2 size={18} />
                    )}
                  </button>
                </div>
                {editMode.first_name ? (
                  <input
                    type="text"
                    value={user.first_name}
                    onChange={(e) =>
                      handleInputChange("first_name", e.target.value)
                    }
                    className="input-field"
                  />
                ) : (
                  <p className="field-value">{user.first_name}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="info-card">
                <div className="card-header">
                  <div className="card-title-container">
                    <User className="card-icon" size={20} />
                    <h3 className="card-title">Last Name</h3>
                  </div>
                  <button
                    onClick={() => toggleEdit("last_name")}
                    className="edit-btn"
                  >
                    {editMode.last_name ? (
                      <Save size={18} />
                    ) : (
                      <Edit2 size={18} />
                    )}
                  </button>
                </div>
                {editMode.last_name ? (
                  <input
                    type="text"
                    value={user.last_name}
                    onChange={(e) =>
                      handleInputChange("last_name", e.target.value)
                    }
                    className="input-field"
                  />
                ) : (
                  <p className="field-value">{user.last_name}</p>
                )}
              </div>

              {/* Email */}
              <div className="info-card">
                <div className="card-header">
                  <div className="card-title-container">
                    <Mail className="card-icon" size={20} />
                    <h3 className="card-title">Email Address</h3>
                  </div>
                  <button
                    onClick={() => toggleEdit("email")}
                    className="edit-btn"
                  >
                    {editMode.email ? <Save size={18} /> : <Edit2 size={18} />}
                  </button>
                </div>
                {editMode.email ? (
                  <>
                    <input
                      type="email"
                      value={user.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="input-field"
                    />
                    <h4 style={{ color: "black" }}>Re-enter your password</h4>
                    <input
                      required
                      placeholder="password"
                      className="input-field"
                      type="password"
                      value={user.password}
                      onChange={(e) => {
                        handleInputChange("password", e.target.value);
                      }}
                    />
                  </>
                ) : (
                  <p className="field-value">{user.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="info-card">
                <div className="card-header">
                  <div className="card-title-container">
                    <Lock className="card-icon" size={20} />
                    <h3 className="card-title">Password</h3>
                  </div>
                  <button
                    onClick={() => toggleEdit("password")}
                    className="edit-btn"
                  >
                    {editMode.password ? (
                      <Save size={18} />
                    ) : (
                      <Edit2 size={18} />
                    )}
                  </button>
                </div>
                {editMode.password ? (
                  <div className="password-inputs">
                    <input
                      type="password"
                      placeholder="Current password"
                      className="input-field"
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input-field"
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="input-field"
                    />
                  </div>
                ) : (
                  <p className="field-value">{user.password}</p>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button onClick={closeModal} className="cancel-btn">
              Cancel
            </button>
            <button onClick={handleSubmit} className="save-btn">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
