const params = new URLSearchParams(window.location.search);
const user_Id = params.get("id");
const accessToken = localStorage.getItem("access-token");

const namaLengkap = document.getElementById("namaLengkap");
const username = document.getElementById("username");

const showUserId = async (id) => {
  if (!id || !accessToken) {
    console.error("ID atau Access Token tidak tersedia");
  } else {
    try {
      const response = await fetch(
        `https://simple-store-api.vercel.app/profile/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const { data } = await response.json();

      namaLengkap.textContent = data.nama_lengkap;
      username.textContent = data.username;
    } catch (err) {
      console.log("Error:", err);
    }
  }
};

const logOut = () => {
  localStorage.removeItem("access-token");
  localStorage.removeItem("userId");

  window.location.href = "/login.html";
};

showUserId(user_Id);
