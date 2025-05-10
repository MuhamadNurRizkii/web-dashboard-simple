const url = "https://simple-store-api.vercel.app/products";

const accessToken = localStorage.getItem("access-token");
const userId = localStorage.getItem("userId");

let currentPage = 1;
const perPage = 5;
let globalData = [];

const fetchProducts = async (accesToken) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accesToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        console.log("Harap login terlebih dahulu!");
        window.location.href = "login.html";
      }

      throw new Error("http error! status:", response.status);
    }

    const { message, data } = await response.json();
    console.log(message);
    globalData = data;
    console.log(data);
    data.forEach((item) => {
      console.log(item.nama);
    });

    renderData(data);
  } catch (err) {
    console.log(`Gagal ambil produk:`, err);
  }
};

const renderData = () => {
  const list = document.getElementById("product-list");
  const totalPages = Math.ceil(globalData.length / perPage);
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const currentProducts = globalData.slice(start, end);
  console.log(currentProducts);

  list.innerHTML = "";

  if (
    !currentProducts ||
    !Array.isArray(currentProducts) ||
    currentProducts.length === 0
  ) {
    list.innerHTML =
      '<h1 class="text-xl italic text-red-500">Tidak ada product!</h1>';
  }

  //   list.innerHTML = data;
  list.innerHTML = currentProducts
    .map((item, index) => {
      return `
      <tr class="hover:bg-gray-50 transition">
        <td class="px-4 py-3 text-center">${start + index + 1}</td>
        <td class="px-4 py-3 text-center">${item.nama}</td>
        <td class="px-4 py-3 text-center">${item.harga}</td>
        <td class="px-4 py-3 text-center">${item.stok}</td>
        <td class="px-4 py-3 text-center">${item.kategori}</td>
        <td class="px-4 py-3 text-center">
        <a class="edit"  onclick="editData('${item._id}')">
        <i class="fa-solid fa-pen-to-square text-lg text-blue-400"></i>
        </a> | 
        <a onclick="deleteData('${item._id}')">
        <i class="fa-solid fa-trash text-lg text-red-400"></i>
        </a></td>
      </tr>
    `;
    })
    .join("");

  document.getElementById(
    "pageInfo"
  ).textContent = `Halaman ${currentPage} dari ${totalPages}`;
  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage === totalPages;
};

const editData = async (id) => {
  try {
    const response = await fetch(
      `https://simple-store-api.vercel.app/products`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Gagal ambil produk: ${response.status}`);
    }
    const { message, data } = await response.json();
    const dataId = data.find((item) => item._id === id);

    const editData = document.getElementById("edit-data");
    editData.classList.add("flex");
    editData.classList.remove("hidden");

    console.log(data);
    console.log(dataId);

    const namaProduk = document.getElementById("nama_produk");
    const hargaProduk = document.getElementById("harga_produk");
    const stokProduk = document.getElementById("stok_produk");
    const kategoriProduk = document.getElementById("kategori_produk");
    const btnClose = document.getElementById("close-btn");
    const btnSubmit = document.getElementById("btn-submit");
    const editForm = document.getElementById("btn-submit");

    namaProduk.value = dataId.nama;
    hargaProduk.value = dataId.harga;
    stokProduk.value = dataId.stok;
    kategoriProduk.value = dataId.kategori;

    btnSubmit.onclick = async () => {
      const request = await fetch(
        `https://simple-store-api.vercel.app/products/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nama: namaProduk.value,
            harga: hargaProduk.value,
            stok: stokProduk.value,
            kategori: kategoriProduk.value,
          }),
        }
      );

      const { message } = await request.json();

      if (request.ok) {
        // alert("update data berhasil");
        await Swal.fire({
          title: "Success!",
          text: message,
          icon: "success",
        });
        editData.classList.remove("flex");
        editData.classList.add("hidden");
        fetchProducts(accessToken);
      }
    };

    btnClose.onclick = () => {
      editData.classList.remove("flex");
      editData.classList.add("hidden");
    };
  } catch (err) {
    console.log("Error:", err);
  }
};

const deleteData = async (id) => {
  await Swal.fire({
    title: "Are you sure?",
    text: "Yakin ingin menghapus?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`https://simple-store-api.vercel.app/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => ({ message: data.message }))
        .then(({ message }) => {
          Swal.fire({
            title: "Deleted!",
            text: message,
            icon: "success",
          });
          fetchProducts(accessToken);
        });
    }
  });
};

const showFormAdd = async () => {
  const addBtn = document.getElementById("add-data");
  const removeBtn = document.getElementById("close-add-btn");
  const form = document.getElementById("add-form");

  addBtn.classList.add("flex");
  addBtn.classList.remove("hidden");
  removeBtn.onclick = () => {
    addBtn.classList.remove("flex");
    addBtn.classList.add("hidden");
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = document.getElementById("btn-submitt");
    submitButton.disabled = true;

    await createData();
    form.reset();
    addBtn.classList.remove("flex");
    addBtn.classList.add("hidden");

    submitButton.disabled = false;
  });
};

let isProcessing = false;

const createData = async () => {
  if (isProcessing) return;
  try {
    isProcessing = true;
    const addNama = document.getElementById("add-nama");
    const addHarga = document.getElementById("add-harga");
    const addStok = document.getElementById("add-stok");
    const addKategori = document.getElementById("add-kategori");

    const request = await fetch(
      "https://simple-store-api.vercel.app/products",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama: addNama.value,
          harga: addHarga.value,
          stok: addStok.value,
          kategori: addKategori.value,
        }),
      }
    );

    if (!request.ok) {
      throw new Error(`Gagal menghapus data. Status: ${response.status}`);
    }

    const { message } = await request.json();
    // alert(`${message}`);
    await Swal.fire({
      title: "Good job!",
      text: message,
      icon: "success",
    });

    fetchProducts(accessToken);
  } catch (err) {
    console.log("Error:", err);
  } finally {
    isProcessing = false;
  }
};

const logOut = () => {
  localStorage.removeItem("access-token");
  localStorage.removeItem("userId");

  window.location.href = "/login.html";
};

const idProfile = document.getElementById("id-profile");
const profileId = document.getElementById("profile-id");
idProfile.setAttribute("href", `profile.html?id=${userId}`);
profileId.setAttribute("href", `profile.html?id=${userId}`);

document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderData();
  }
});

document.getElementById("nextBtn").addEventListener("click", () => {
  const totalPages = Math.ceil(globalData.length / perPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderData();
  }
});

fetchProducts(accessToken);
