const url = "https://simple-store-api.vercel.app/products";

const accessToken = localStorage.getItem("access-token");

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
    console.log(data);
    data.forEach((item) => {
      console.log(item.nama);
    });

    renderData(data);
  } catch (err) {
    console.log(`Gagal ambil produk:`, err);
  }
};

const renderData = (data) => {
  const list = document.getElementById("product-list");
  const addProduk = document.getElementById("add-produk");
  console.log(list);

  list.innerHTML = "";

  if (!data || !Array.isArray(data)) {
    list.innerHTML =
      '<h1 class="text-xl italic text-red-500">Tidak ada product!</h1>';
  }

  //   list.innerHTML = data;
  list.innerHTML = data
    .map((item) => {
      return `
      <tr class="hover:bg-gray-50 transition">
        <td class="px-6 py-4">${item._id}</td>
        <td class="px-6 py-4">${item.nama}</td>
        <td class="px-6 py-4">${item.harga}</td>
        <td class="px-6 py-4">${item.stok}</td>
        <td class="px-6 py-4">${item.kategori}</td>
        <td class="px-6 py-4">
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

      if (request.ok) {
        alert("update data berhasil");
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
  const konfirmasi = confirm("Yakin ingin menghapus produk ini??");
  if (!konfirmasi) {
    return;
  }
  try {
    const response = await fetch(
      `https://simple-store-api.vercel.app/products/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Gagal menghapus data. Status: ${response.status}`);
    }

    const { message } = await response.json();
    alert(`${message}`);
    fetchProducts(accessToken);
  } catch (err) {
    console.log("Error:", err);
  }
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

    await createData();
    form.reset();
    addBtn.classList.remove("flex");
    addBtn.classList.add("hidden");
  });
};

const createData = async () => {
  try {
    const addNama = document.getElementById("add-nama");
    const addHarga = document.getElementById("add-harga");
    const addStok = document.getElementById("add-stok");
    const addKategori = document.getElementById("add-kategori");

    const request = await fetch(url, {
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
    });

    if (!request.ok) {
      throw new Error(`Gagal menghapus data. Status: ${response.status}`);
    }

    const { message } = await request.json();
    alert(`${message}`);

    fetchProducts(accessToken);
  } catch (err) {
    console.log("Error:", err);
  }
};

const logOut = () => {
  localStorage.removeItem("access-token");

  window.location.href = "/login.html";
};

fetchProducts(accessToken);
