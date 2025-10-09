document.addEventListener("DOMContentLoaded", () => {
  const userTableBody = document.getElementById("userTableBody");
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const startDate = new Date("2025-01-01").getTime();
  const filteredUsers = users.filter(user => {
    if (!user.createdAt) return false;
    const userDate = new Date(user.createdAt).getTime();
    return userDate >= startDate && (!user.role || user.role !== "admin");
  });

  filteredUsers.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.createdAt || "Chưa có"}</td>
    `;
    userTableBody.appendChild(row);
  });
});