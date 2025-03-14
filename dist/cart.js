document.addEventListener("DOMContentLoaded", function () {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCountElement = document.getElementById("cart-count");
  const cartSidebar = document.querySelector("#cart-sidebar .space-y-4");

  function updateCart() {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Local Storage is not available:", error);
    }

    if (cartCountElement) {
      cartCountElement.textContent = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
    }

    // อัปเดตรายการสินค้าใน Sidebar
    if (cartSidebar) {
      cartSidebar.innerHTML = "";
      let totalPrice = 0; // เพิ่มตัวแปรเก็บราคารวม
      cart.forEach((item, index) => {
        totalPrice += item.price * item.quantity; // คำนวณราคารวม
        cartSidebar.innerHTML += `
                  <div class="flex justify-between items-center border-b pb-4">
                      <img src="${
                        item.image
                      }" class="w-16 h-16 object-cover rounded" alt="${
          item.name
        }">
                      <p class="flex-1 ml-4 text-black">${item.name}</p>
                      <div class="flex items-center">
                          <button onclick="decreaseQuantity(${index})" class="text-black">-</button>
                          <span class="mx-2 text-black">${item.quantity}</span>
                          <button onclick="increaseQuantity(${index})" class="text-black">+</button>
                      </div>
                      <p class="text-black">${
                        item.price * item.quantity
                      } บาท</p>
                      <button onclick="removeItem(${index})" class="text-black">✖</button>
                  </div>
              `;
      });

      // แสดงราคารวมและปุ่มชำระเงิน
      cartSidebar.innerHTML += `
              <div class="border-t pt-4 mt-4">
                  <div class="flex justify-between text-black">
                      <p>ราคารวม:</p>
                      <p>${totalPrice} บาท</p>
                  </div>
                 <a href="Checkout.html" class="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 flex justify-center items-center">
                    ชำระเงิน
                  </a>
              </div>
          `;
    }
  }

  function increaseQuantity(index) {
    cart[index].quantity++;
    updateCart();
  }

  function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      cart.splice(index, 1);
    }
    updateCart();
  }

  function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
  }

  // ประกาศฟังก์ชันเป็น Global
  window.increaseQuantity = increaseQuantity;
  window.decreaseQuantity = decreaseQuantity;
  window.removeItem = removeItem;

  updateCart();

  function addToCart(name, price, image ) {
    console.log("Adding to cart:", name, price, image);
    const existingItem = cart.find((item) => item.name === name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ name, price, image, quantity: 1 });
    }
    updateCart();
  }

  function toggleCart() {
    const cartElement = document.getElementById("cart-sidebar");
    cartElement.classList.toggle("translate-x-full");
  }

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const name = this.getAttribute("data-name");
      const price = parseFloat(this.getAttribute("data-price"));
      const image = this.getAttribute("data-image");
      addToCart(name, price, image);
    });
  });

  window.addToCart = addToCart;
  window.toggleCart = toggleCart;

  updateCart();
});
