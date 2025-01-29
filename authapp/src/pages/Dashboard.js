import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const Dashboard = ({ setAuth }) => {
  const [tableData, setTableData] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", dob: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [editingIndex, setEditingIndex] = useState(null); // Track which user is being edited
  const navigate = useNavigate();

  // Ref to scroll to the add user section
  const addItemRef = useRef(null);

  // Calculate Age based on Date of Birth
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  // Simulate fetching data from a backend API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = Array.from({ length: 20 }, (_, index) => ({
          name: `User ${index + 1}`,
          dob: `199${index % 10}-01-01`,
        }));

        const formattedData = data.map((item) => ({
          ...item,
          age: calculateAge(item.dob),
        }));

        setTableData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setAuth(false);
    navigate("/");
  };

  const handleAddItem = () => {
    if (newItem.name.trim() === "" || newItem.dob.trim() === "") {
      setMessage({ text: "Please fill in both fields.", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 2000);
      return;
    }

    setLoading(true);
    const newUser = {
      ...newItem,
      age: calculateAge(newItem.dob),
    };
    setTableData([...tableData, newUser]);
    setNewItem({ name: "", dob: "" });
    setMessage({ text: "User added successfully!", type: "success" });
    setTimeout(() => setMessage({ text: "", type: "" }), 1000);
    setLoading(false);
  };

  const handleEditItem = (index) => {
    setEditingIndex(index); // Set the index of the user being edited
    const userToEdit = tableData[index];
    setNewItem({ name: userToEdit.name, dob: userToEdit.dob });

    // Scroll to the Add/Update User section after loading the data
    addItemRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUpdateItem = () => {
    if (newItem.name.trim() === "" || newItem.dob.trim() === "") {
      setMessage({ text: "Please fill in both fields.", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 2000);
      return;
    }

    const updatedData = [...tableData];
    updatedData[editingIndex] = {
      ...updatedData[editingIndex],
      name: newItem.name,
      dob: newItem.dob,
      age: calculateAge(newItem.dob),
    };
    setTableData(updatedData);
    setNewItem({ name: "", dob: "" });
    setMessage({ text: "User updated successfully!", type: "success" });
    setTimeout(() => setMessage({ text: "", type: "" }), 1000);
    setEditingIndex(null); // Reset editing mode
  };

  const handleDeleteItem = (index) => {
    const updatedData = tableData.filter((_, i) => i !== index);
    setTableData(updatedData);
    setMessage({ text: "User deleted successfully", type: "error" });  // Using error type to show in red for deletion
    setTimeout(() => setMessage({ text: "", type: "" }), 1000);
  };

  // Scroll to the add user section
  const scrollToAddUser = () => {
    addItemRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome to the Dashboard</h2>

      <button onClick={scrollToAddUser} className="add-user-btn">
        Add User
      </button>
      <div className="table-container">
        <h3>User Data</h3>
        {loading && <div className="skeleton-loader">Loading data...</div>}
        {!loading && tableData.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Date of Birth</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td>{row.name}</td>
                  <td>{row.age}</td>
                  <td>{row.dob}</td>
                  <td>
                    <button className="action-btn" onClick={() => handleEditItem(index)}>
                      Edit
                    </button>
                    <button className="action-btn" onClick={() => handleDeleteItem(index)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="add-item-container" ref={addItemRef}>
        <h3>{editingIndex !== null ? "Edit User" : "Add New User"}</h3>
        <input
          type="text"
          placeholder="Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="date"
          value={newItem.dob}
          onChange={(e) => setNewItem({ ...newItem, dob: e.target.value })}
        />
        <button onClick={editingIndex !== null ? handleUpdateItem : handleAddItem} className="add-item-btn">
          {editingIndex !== null ? "Update" : "Add User"}
        </button>

        {message.text && (
          <div className={`message-container ${message.type}`}>
            <p className={`message ${message.type}`} style={{ textAlign: "center" }}>
              {message.text}
            </p>
          </div>
        )}

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
