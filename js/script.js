const products = [
  // ADIDAS
  ["Adidas Samba OG white", "Adidas", 1200000, "Adidas samba OG white.jpg"],
  ["Adidas Handball Spezial Navy", "Adidas", 1100000, "Adidas handball spezial navy.jpg"],
  ["Adidas Handball Spezial Green", "Adidas", 1800000, "Adidas handball spezial green.jpg"],
  ["Adidas Samba OG black", "Adidas", 1300000, "Adidas samba OG black.jpg"],
  ["Adidas Samba OG cream maroon gum", "Adidas", 1400000, "Adidas samba OG Creram white maroon gum.jpg"],
  ["Adidas Samba OG maroon", "Adidas", 1250000, "Adidas samba OG maroon.jpg"],
  ["Adidas Wales Bonner pony hair cream", "Adidas", 1600000, "Adidas walws booner samba pony hair clack cream.jpg"],
  ["Adidas Wales Bonner croc tan", "Adidas", 850000, "Adidas wales bonner samba croc tan.jpg"],
  ["Adidas Wales Bonner pony hair cream", "Adidas", 1150000, "Adidas Wales booner samba pony hair cream.jpg"],
  ["Adidas Wales Bonner croc navy", "Adidas", 950000, "Adidas walws Bonner samba croc nany.jpg"],
  // PUMA — menggunakan foto yang tersedia dalam folder proyek
  ["Puma Puma Club II Era", "Puma", 900000, "Puma Club II Era.jpg"],
  ["Puma Puma speedcat  OG Dark olive", "Puma", 1300000, "Puma speedcat brown.jpg"],
  ["Puma Speedcat red", "Puma", 1100000, "Puma speedcat red.jpg"],
  ["Puma Club II Era", "Puma", 850000, "Puma Club II Era.jpg"],
  ["Puma Speedcat OG green", "Puma", 1000000, "Puma speedcat OG green.jpg"],
  ["Puma Speedcat OG Black Orange", "Puma", 1200000, "Puma speedcat OG Black Orange.jpg"],
  ["Puma Speedcat OG Dark Olive", "Puma", 950000, "Puma speedcat  OG Dark olive.jpg"],
  ["Puma Speedcat Buttercream", "Puma", 1400000, "PUma speedcat Buttercream.jpg"],
  ["Puma Speedcat Sunshine Yellow", "Puma", 750000, "Puma speedcat sunshine yello.jpg"],
  // NEW BALANCE
  ["New Balance 530", "New Balance", 1500000, "New balance 530.jpg"],
  ["New Balance 574 ML574EVB Black White", "New Balance", 1600000, "New balance 574 ML574EVB Black white].jpg"],
  ["New Balance 574 navy beige", "New Balance", 1300000, "New balance 574 navy beige.jpg"],
  ["New Balance 740", "New Balance", 1400000, "New balance 740.jpg"],
  ["New Balance 992 grey", "New Balance", 1900000, "New balance 992 grey.jpg"],
  ["New Balance 993 grey", "New Balance", 2200000, "New balance 993 grey.jpg"],
  ["New Balance 1000 green", "New Balance", 2500000, "New balance 1000 green.jpg"],
  ["New Balance 2002R", "New Balance", 2100000, "New balance 2002R.jpg"],
  ["New Balance 9060 grey", "New Balance", 1200000, "New balance 9060 Grey.jpg"],
  ["New Balance 9060 rain cloud grey", "New Balance", 1700000, "New balance 9060 rain cloud grey.jpg"]
].map((p, id) => ({ id: `base-${id}`, name: p[0], brand: p[1], price: p[2], image: `image/${p[3]}` }));

let extraProducts = [];
try {
  extraProducts = JSON.parse(localStorage.getItem("extraProducts") || "[]");
  if (!Array.isArray(extraProducts)) extraProducts = [];
} catch (e) { extraProducts = []; }
let cart = [];
let currentBrand = "Semua";
let displayedProducts = [];

const rupiah = value => `Rp${Number(value).toLocaleString("id-ID")}`;

function displayProducts() {
  const container = document.getElementById("products");
  const keyword = document.getElementById("search").value.trim().toLowerCase();
  const allProducts = [...products, ...extraProducts];
  displayedProducts = allProducts.filter(p =>
    (currentBrand === "Semua" || p.brand === currentBrand) &&
    p.name.toLowerCase().includes(keyword)
  );

  container.innerHTML = "";
  if (displayedProducts.length === 0) {
    container.innerHTML = '<p class="empty">Produk tidak ditemukan.</p>';
    return;
  }
  displayedProducts.forEach((p, index) => {
    const card = document.createElement("article");
    card.className = "card";
    const img = document.createElement("img");
    img.src = p.image;
    img.alt = p.name;
    img.loading = "lazy";
    img.onerror = () => { img.onerror = null; img.src = "https://placehold.co/300x200?text=Foto+Sepatu"; };
    const name = document.createElement("h3"); name.textContent = p.name;
    const brand = document.createElement("p"); brand.className = "brand"; brand.textContent = p.brand;
    const price = document.createElement("p"); price.className = "price"; price.textContent = rupiah(p.price);
    const btn = document.createElement("button"); btn.type = "button"; btn.textContent = "Tambah Keranjang";
    btn.addEventListener("click", () => addCart(index));
    card.append(img, name, brand, price, btn);
    container.append(card);
  });
}

function filterBrand(brand) { currentBrand = brand; displayProducts(); }

function addProduct() {
  const name = document.getElementById("nama").value.trim();
  const brand = document.getElementById("brand").value;
  const price = Number(document.getElementById("harga").value);
  const file = document.getElementById("foto").files[0];
  if (!name || !Number.isFinite(price) || price <= 0 || !file) { alert("Isi semua data dan pilih foto!"); return; }
  if (!file.type.startsWith("image/")) { alert("File harus berupa gambar!"); return; }
  if (file.size > 1024 * 1024) { alert("Ukuran foto maksimal 1 MB!"); return; }
  const reader = new FileReader();
  reader.onload = event => {
    const newProduct = { id: `extra-${Date.now()}`, name, brand, price, image: event.target.result };
    extraProducts.push(newProduct);
    try { localStorage.setItem("extraProducts", JSON.stringify(extraProducts)); }
    catch (error) { extraProducts.pop(); alert("Penyimpanan penuh. Coba foto yang lebih kecil."); return; }
    document.getElementById("nama").value = "";
    document.getElementById("harga").value = "";
    document.getElementById("foto").value = "";
    currentBrand = "Semua";
    displayProducts();
    alert("Produk berhasil ditambahkan!");
  };
  reader.onerror = () => alert("Foto gagal dibaca. Silakan coba lagi.");
  reader.readAsDataURL(file);
}

function addCart(index) {
  const p = displayedProducts[index];
  if (!p) return;
  cart.push(p);
  updateCartCount();
  alert("Produk berhasil masuk keranjang!");
}
function updateCartCount() { document.getElementById("count").textContent = cart.length; }
function showCart() { document.getElementById("cart").style.display = "block"; updateCart(); }
function closeCart() { document.getElementById("cart").style.display = "none"; }
function updateCart() {
  const items = document.getElementById("cartItems");
  items.innerHTML = "";
  let total = 0;
  if (cart.length === 0) items.textContent = "Keranjang masih kosong.";
  cart.forEach((p, i) => {
    total += Number(p.price);
    const row = document.createElement("div"); row.className = "cart-row";
    const label = document.createElement("span"); label.textContent = `${p.name} — ${rupiah(p.price)}`;
    const remove = document.createElement("button"); remove.type = "button"; remove.textContent = "Hapus";
    remove.addEventListener("click", () => removeCart(i));
    row.append(label, remove); items.append(row);
  });
  document.getElementById("total").textContent = `Total: ${rupiah(total)}`;
}
function removeCart(index) { cart.splice(index, 1); updateCartCount(); updateCart(); }
function checkout() {
  if (cart.length === 0) { alert("Keranjang masih kosong!"); return; }
  const total = cart.reduce((sum, p) => sum + Number(p.price), 0);
  alert(`Terima kasih sudah berbelanja!\nTotal pembayaran: ${rupiah(total)}\n\nIni masih simulasi checkout.`);
  cart = []; updateCartCount(); updateCart(); closeCart();
}
document.getElementById("search").addEventListener("input", displayProducts);
displayProducts();
