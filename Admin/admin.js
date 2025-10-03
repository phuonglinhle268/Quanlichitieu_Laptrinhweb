document.addEventListener("DOMContentLoaded", () => {
  const userTableBody = document.getElementById("userTableBody");
  const users = JSON.parse(localStorage.getItem("users")) || [];

  users.forEach((user, index) => {
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