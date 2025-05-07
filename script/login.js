const url = "https://simple-store-api.vercel.app/login";

const form = document.getElementById("login");

form.addEventListener("submit", async function (e) {
  try {
    e.preventDefault();

    const username = document.getElementById("username");
    const password = document.getElementById("password");

    const request = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });
    const data = await request.json();
    console.log(data);

    if (request.ok) {
      // alert(`${data.message}`);
      await Swal.fire({
        title: "Good job!",
        text: data.message,
        icon: "success",
      });

      localStorage.setItem(`access-token`, `${data.data.accessToken}`);

      window.location.href = "/index.html";
    } else {
      // alert(`${data.message}`);
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.message,
      });
      username.value = "";
      password.value = "";
    }
  } catch (err) {
    console.log("Error:", err);
  }
});
