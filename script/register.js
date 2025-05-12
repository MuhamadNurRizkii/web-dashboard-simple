const url = "https://simple-store-api.vercel.app/register";

const form = document.getElementById("register");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const namaLengkap = document.getElementById("nama_lengkap");
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirm_password");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nama_lengkap: namaLengkap.value,
      username: username.value,
      password: password.value,
      confirm_password: confirmPassword.value,
    }),
  });

  namaLengkap.value = "";
  username.value = "";
  password.value = "";
  confirmPassword.value = "";

  const data = await response.json();
  console.log(data);

  if (!response.ok) {
    await Swal.fire({
      icon: "error",
      title: "Oops...",
      text: data.message,
    });
  }

  if (response.ok) {
    await Swal.fire({
      title: "Success!",
      text: data.message,
      icon: "success",
    });
  }
  window.location.href = "login.html";
});
