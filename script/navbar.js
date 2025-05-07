const btnOut = document.getElementById("btn-out");

btnOut.addEventListener("click", () => {
  localStorage.removeItem("access-token");

  window.location.href = "/login.html";
});
