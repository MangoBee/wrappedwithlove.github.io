// Mobile navigation
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen);
  });

  document.querySelectorAll(".site-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Footer year
const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

// Homepage hero slider
const heroImages = [
  "images/hero-bouquet-1.jpg",
  "images/hero-bouquet-2.jpg",
  "images/hero-bouquet-3.jpg",
  "images/hero-bouquet-4.jpg",
  "images/hero-bouquet-5.jpg",
];

const heroSliderImage = document.querySelector("#heroSliderImage");
const previousZone = document.querySelector(".slider-zone-left");
const nextZone = document.querySelector(".slider-zone-right");

let currentHeroImage = 0;
let sliderTimer;

function showHeroImage(index) {
  if (!heroSliderImage) return;

  heroSliderImage.classList.add("is-fading");

  setTimeout(() => {
    currentHeroImage = (index + heroImages.length) % heroImages.length;
    heroSliderImage.src = heroImages[currentHeroImage];
    heroSliderImage.classList.remove("is-fading");
  }, 250);
}

function startSliderTimer() {
  clearInterval(sliderTimer);

  sliderTimer = setInterval(() => {
    showHeroImage(currentHeroImage + 1);
  }, 10000);
}

if (heroSliderImage && previousZone && nextZone) {
  previousZone.addEventListener("click", () => {
    showHeroImage(currentHeroImage - 1);
    startSliderTimer();
  });

  nextZone.addEventListener("click", () => {
    showHeroImage(currentHeroImage + 1);
    startSliderTimer();
  });

  startSliderTimer();
}

// Success modal
const modal = document.getElementById("successModal");
const closeModal = document.getElementById("closeModal");

if (modal && closeModal) {
  closeModal.addEventListener("click", () => {
    modal.classList.remove("is-open");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("is-open");
    }
  });
}

// Main/subscription request form + inspiration photo upload
const form = document.querySelector(".request-form");
const inspirationInput = document.getElementById("inspirationPhotos");
const fileList = document.getElementById("fileList");

let selectedFiles = [];

function updateFileInput() {
  if (!inspirationInput) return;

  const dataTransfer = new DataTransfer();

  selectedFiles.forEach((file) => {
    dataTransfer.items.add(file);
  });

  inspirationInput.files = dataTransfer.files;
}

function renderFileList() {
  if (!fileList) return;

  fileList.innerHTML = "";

  selectedFiles.forEach((file, index) => {
    const fileItem = document.createElement("div");
    fileItem.className = "file-item";

    const preview = document.createElement("img");
    preview.className = "file-preview";
    preview.src = URL.createObjectURL(file);
    preview.alt = file.name;

    const fileName = document.createElement("span");
    fileName.textContent = file.name;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove";

    removeButton.addEventListener("click", () => {
      selectedFiles.splice(index, 1);
      updateFileInput();
      renderFileList();
    });

    fileItem.appendChild(preview);
    fileItem.appendChild(fileName);
    fileItem.appendChild(removeButton);

    fileList.appendChild(fileItem);
  });
}

if (inspirationInput) {
  inspirationInput.addEventListener("change", () => {
    selectedFiles = [...selectedFiles, ...Array.from(inspirationInput.files)];
    updateFileInput();
    renderFileList();
  });
}

if (form && modal) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    updateFileInput();

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        modal.classList.add("is-open");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Error submitting form.");
    }
  });
}

// Subscription plan auto-select + dynamic pricing
const planButtons = document.querySelectorAll(".plan-button");
const subscriptionPlan = document.getElementById("subscriptionPlan");
const subscriptionLength = document.getElementById("subscriptionLength");

const subscriptionOptions = {
  Standard: [
    "3 Months - $165",
    "6 Months - $330",
    "9 Months - $495",
  ],
  Deluxe: [
    "3 Months - $225",
    "6 Months - $450",
    "9 Months - $675",
  ],
  Premium: [
    "3 Months - $285",
    "6 Months - $570",
    "9 Months - $855",
  ],
};

function populateSubscriptionLengths(plan) {
  if (!subscriptionLength) return;

  subscriptionLength.innerHTML = "";

  if (!plan) {
    subscriptionLength.disabled = true;

    subscriptionLength.innerHTML = `
      <option value="">Select a plan first</option>
    `;

    return;
  }

  subscriptionLength.disabled = false;

  subscriptionLength.innerHTML = `
    <option value="">Select length</option>
  `;

  subscriptionOptions[plan].forEach((option) => {
    const optionElement = document.createElement("option");

    optionElement.value = `${plan} - ${option}`;
    optionElement.textContent = option;

    subscriptionLength.appendChild(optionElement);
  });
}

if (subscriptionPlan) {
  subscriptionPlan.addEventListener("change", () => {
    populateSubscriptionLengths(subscriptionPlan.value);
  });
}

if (planButtons.length > 0 && subscriptionPlan) {
  planButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedPlan = button.dataset.plan;

      subscriptionPlan.value = selectedPlan;

      populateSubscriptionLengths(selectedPlan);
    });
  });
}

// Ready-to-order cart
const addToCartButtons = document.querySelectorAll(".add-to-cart-button");
const cartOpenButton = document.querySelector(".cart-open-button");
const cartModal = document.getElementById("cartModal");
const closeCartModal = document.getElementById("closeCartModal");
const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartItemsInput = document.getElementById("cartItemsInput");
const cartRequestForm = document.querySelector(".cart-request-form");

let cart = JSON.parse(localStorage.getItem("flowerCart")) || [];

function saveCart() {
  localStorage.setItem("flowerCart", JSON.stringify(cart));
}

function getCartTotalQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function updateCartCount() {
  if (!cartCount) return;
  cartCount.textContent = getCartTotalQuantity();
}

function updateCartInput() {
  if (!cartItemsInput) return;

  if (cart.length === 0) {
    cartItemsInput.value = "No items selected.";
    return;
  }

  cartItemsInput.value = cart
    .map((item) => `${item.quantity}x ${item.name} - ${item.price}`)
    .join("\n");
}

function renderCart() {
  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-cart-message";
    emptyMessage.textContent = "Your cart is empty. Add a design before sending a request.";

    cartItemsContainer.appendChild(emptyMessage);

    updateCartInput();
    updateCartCount();

    return;
  }

  cart.forEach((item, index) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    const itemInfo = document.createElement("div");
    itemInfo.className = "cart-item-info";

    const itemImage = document.createElement("img");
    itemImage.src = item.image;
    itemImage.alt = item.name;
    itemImage.className = "cart-item-image";

    const itemText = document.createElement("div");

    const itemName = document.createElement("h4");
    itemName.textContent = item.name;

    const itemPrice = document.createElement("p");
    itemPrice.textContent = item.price;

    itemText.appendChild(itemName);
    itemText.appendChild(itemPrice);

    itemInfo.appendChild(itemImage);
    itemInfo.appendChild(itemText);

    const controls = document.createElement("div");
    controls.className = "cart-controls";

    const decreaseButton = document.createElement("button");
    decreaseButton.type = "button";
    decreaseButton.textContent = "-";

    const quantityText = document.createElement("strong");
    quantityText.textContent = item.quantity;

    const increaseButton = document.createElement("button");
    increaseButton.type = "button";
    increaseButton.textContent = "+";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.className = "cart-remove";

    decreaseButton.addEventListener("click", () => {
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
      } else {
        cart.splice(index, 1);
      }

      saveCart();
      renderCart();
    });

    increaseButton.addEventListener("click", () => {
      cart[index].quantity += 1;

      saveCart();
      renderCart();
    });

    removeButton.addEventListener("click", () => {
      cart.splice(index, 1);

      saveCart();
      renderCart();
    });

    controls.appendChild(decreaseButton);
    controls.appendChild(quantityText);
    controls.appendChild(increaseButton);
    controls.appendChild(removeButton);

    cartItem.appendChild(itemInfo);
    cartItem.appendChild(controls);

    cartItemsContainer.appendChild(cartItem);
  });

  updateCartInput();
  updateCartCount();
}

if (addToCartButtons.length > 0) {
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.dataset.name;
      const price = button.dataset.price;
      const image = button.dataset.image;

      const existingItem = cart.find((item) => item.name === name);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          name,
          price,
          image,
          quantity: 1,
        });
      }

      saveCart();
      renderCart();

      button.textContent = "Added!";

      setTimeout(() => {
        button.textContent = "Add to Cart";
      }, 900);
    });
  });
}

if (cartOpenButton && cartModal) {
  cartOpenButton.addEventListener("click", () => {
    renderCart();
    cartModal.classList.add("is-open");
  });
}

if (closeCartModal && cartModal) {
  closeCartModal.addEventListener("click", () => {
    cartModal.classList.remove("is-open");
  });

  cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) {
      cartModal.classList.remove("is-open");
    }
  });
}

if (cartRequestForm && modal) {
  cartRequestForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Please add at least one design to your cart first.");
      return;
    }

    updateCartInput();

    const formData = new FormData(cartRequestForm);

    try {
      const response = await fetch(cartRequestForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        cart = [];

        saveCart();
        renderCart();

        cartRequestForm.reset();

        cartModal.classList.remove("is-open");
        modal.classList.add("is-open");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Error submitting form.");
    }
  });
}

renderCart();

// Custom arrangement modal
const customRequestTriggers = document.querySelectorAll(".custom-request-trigger");
const customModal = document.getElementById("customModal");
const closeCustomModal = document.getElementById("closeCustomModal");
const customRequestForm = document.querySelector(".custom-request-form");

if (
  customRequestTriggers.length > 0 &&
  customModal &&
  closeCustomModal &&
  customRequestForm &&
  modal
) {
  customRequestTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();

      customModal.classList.add("is-open");
    });
  });

  closeCustomModal.addEventListener("click", () => {
    customModal.classList.remove("is-open");
  });

  customModal.addEventListener("click", (e) => {
    if (e.target === customModal) {
      customModal.classList.remove("is-open");
    }
  });

  customRequestForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(customRequestForm);

    try {
      const response = await fetch(customRequestForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        customModal.classList.remove("is-open");
        modal.classList.add("is-open");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Error submitting form.");
    }
  });
}