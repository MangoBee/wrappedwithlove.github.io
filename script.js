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

// Subscription plan auto-select
const planButtons = document.querySelectorAll(".plan-button");
const planSelect = document.querySelector('select[name="plan"]');

if (planButtons.length > 0 && planSelect) {
  planButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedPlan = button.dataset.plan;
      planSelect.value = selectedPlan;
    });
  });
}

// Ready-to-order shop modal
const shopButtons = document.querySelectorAll(".shop-request-button");
const shopModal = document.getElementById("shopModal");
const closeShopModal = document.getElementById("closeShopModal");
const selectedDesignName = document.getElementById("selectedDesignName");
const selectedDesignInput = document.getElementById("selectedDesignInput");
const shopRequestForm = document.querySelector(".shop-request-form");

if (
  shopButtons.length > 0 &&
  shopModal &&
  closeShopModal &&
  selectedDesignName &&
  selectedDesignInput &&
  shopRequestForm &&
  modal
) {
  shopButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const designName = button.dataset.design;

      selectedDesignName.textContent = designName;
      selectedDesignInput.value = designName;
      shopModal.classList.add("is-open");
    });
  });

  closeShopModal.addEventListener("click", () => {
    shopModal.classList.remove("is-open");
  });

  shopModal.addEventListener("click", (e) => {
    if (e.target === shopModal) {
      shopModal.classList.remove("is-open");
    }
  });

  shopRequestForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(shopRequestForm);

    try {
      const response = await fetch(shopRequestForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        shopModal.classList.remove("is-open");
        modal.classList.add("is-open");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Error submitting form.");
    }
  });
}

// Custom arrangement modal
const customRequestTriggers = document.querySelectorAll(".custom-request-trigger");
const customModal = document.getElementById("customModal");
const closeCustomModal = document.getElementById("closeCustomModal");
const customRequestForm = document.querySelector(".custom-request-form");

if (customRequestTriggers.length > 0 && customModal && closeCustomModal && customRequestForm && modal) {
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