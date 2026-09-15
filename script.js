/* =========================================================
   LUMINARY ARCHIVES
   Main Application Script
========================================================= */

(() => {
  "use strict";

  /* -------------------------------------------------------
     BOOK DATABASE
  ------------------------------------------------------- */

  const books = [
    {
      id: 1,
      title: "The Art of War",
      author: "Sun Tzu",
      category: "Strategy",
      price: 0,
      type: "free",
      image: "assets/art_of_war.jpg",
      pdf: "assets/pdf/art_of_war.pdf",
      description:
        "An enduring study of strategy, discipline, conflict, and intelligent decision-making."
    },
    {
      id: 2,
      title: "The Laws of Human Nature",
      author: "Robert Greene",
      category: "Psychology",
      price: 8,
      type: "premium",
      image: "assets/laws_of_human_nature.jpg",
      pdf: "assets/pdf/laws_of_human_nature.pdf",
      description:
        "An exploration of human behavior, hidden motives, emotional patterns, and social intelligence."
    },
    {
      id: 3,
      title: "The 33 Strategies of War",
      author: "Robert Greene",
      category: "Strategy",
      price: 8,
      type: "premium",
      image: "assets/33_stages_of_war.jpg",
      pdf: "assets/pdf/33_stages_of_war.pdf",
      description:
        "Strategic principles inspired by military history and the psychology of conflict."
    },
    {
      id: 4,
      title: "The Art of Thinking Clearly",
      author: "Rolf Dobelli",
      category: "Psychology",
      price: 5,
      type: "premium",
      image: "assets/art_of_thinking_clearly.jpg",
      pdf: "assets/pdf/art_of_thinking_clearly.pdf",
      description:
        "A practical examination of cognitive errors and the mental traps that distort judgment."
    },
    {
      id: 5,
      title: "The Definitive Book of Body Language",
      author: "Allan & Barbara Pease",
      category: "Psychology",
      price: 5,
      type: "premium",
      image: "assets/definitive_book_of_body_language.jpg",
      pdf: "assets/pdf/definitive_book_of_body_language.pdf",
      description:
        "A visual guide to gestures, expressions, posture, and non-verbal communication."
    },
    {
      id: 6,
      title: "Ego Is the Enemy",
      author: "Ryan Holiday",
      category: "Philosophy",
      price: 4,
      type: "premium",
      image: "assets/ego_is_the_enemy.jpg",
      pdf: "assets/pdf/ego_is_the_enemy.pdf",
      description:
        "A reflection on ambition, success, failure, humility, and the destructive nature of ego."
    },
    {
      id: 7,
      title: "Mastery",
      author: "Robert Greene",
      category: "Self Development",
      price: 8,
      type: "premium",
      image: "assets/mastery.jpg",
      pdf: "assets/pdf/mastery.pdf",
      description:
        "A guide to developing deep skill, patience, creativity, and long-term excellence."
    },
    {
      id: 8,
      title: "The Psychology of Money",
      author: "Morgan Housel",
      category: "Finance",
      price: 5,
      type: "premium",
      image: "assets/psychology_of_money.jpg",
      pdf: "assets/pdf/psychology_of_money.pdf",
      description:
        "Timeless lessons about wealth, behavior, risk, greed, patience, and financial decisions."
    },
    {
      id: 9,
      title: "The Laws of Seduction",
      author: "Robert Greene",
      category: "Psychology",
      price: 7,
      type: "premium",
      image: "assets/seduction.jpg",
      pdf: "assets/pdf/seduction.pdf",
      description:
        "A historical and psychological examination of attraction, influence, and interpersonal dynamics."
    },
    {
      id: 10,
      title: "Surrounded by Psychopaths",
      author: "Thomas Erikson",
      category: "Psychology",
      price: 5,
      type: "premium",
      image: "assets/surrounded_by_psychopaths.jpg",
      pdf: "assets/pdf/surrounded_by_psychopaths.pdf",
      description:
        "An accessible exploration of manipulative behavior and difficult personality patterns."
    },
    {
      id: 11,
      title: "The Daily Laws",
      author: "Robert Greene",
      category: "Self Development",
      price: 7,
      type: "premium",
      image: "assets/the_daily_laws.jpg",
      pdf: "assets/pdf/the_daily_laws.pdf",
      description:
        "A daily collection of observations and principles for personal development."
    },
    {
      id: 12,
      title: "The Prince",
      author: "Niccolò Machiavelli",
      category: "Politics",
      price: 0,
      type: "free",
      image: "assets/the_prince.jpg",
      pdf: "assets/pdf/the_prince.pdf",
      description:
        "A classic political treatise examining leadership, power, statecraft, and political strategy."
    },
    {
      id: 13,
      title: "White Nights",
      author: "Fyodor Dostoevsky",
      category: "Literature",
      price: 0,
      type: "free",
      image: "assets/white_nights.jpg",
      pdf: "assets/pdf/white_nights.pdf",
      description:
        "A dreamlike literary tale of loneliness, hope, love, and fleeting human connection."
    }
  ];

  /* -------------------------------------------------------
     STATE
  ------------------------------------------------------- */

  let cart = JSON.parse(localStorage.getItem("luminaryCart")) || [];
  let library = JSON.parse(localStorage.getItem("luminaryLibrary")) || [];
  let currentFilter = "all";
  let currentBook = null;

  /* -------------------------------------------------------
     DOM HELPERS
  ------------------------------------------------------- */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const saveCart = () => {
    localStorage.setItem("luminaryCart", JSON.stringify(cart));
  };

  const saveLibrary = () => {
    localStorage.setItem("luminaryLibrary", JSON.stringify(library));
  };

  /* -------------------------------------------------------
     INITIALIZATION
  ------------------------------------------------------- */

  document.addEventListener("DOMContentLoaded", () => {
    renderBooks();
    setupNavigation();
    setupSearch();
    setupFilters();
    setupModals();
    setupCart();
    setupWallet();
    setupPublishing();
    setupScrollEffects();
    updateCartCount();
  });

  /* -------------------------------------------------------
     BOOK RENDERING
  ------------------------------------------------------- */

  function renderBooks(searchTerm = "") {
    const grid = $(".book-grid");
    if (!grid) return;

    const normalizedSearch = searchTerm.toLowerCase().trim();

    const filteredBooks = books.filter((book) => {
      const matchesFilter =
        currentFilter === "all" ||
        (currentFilter === "free" && book.type === "free") ||
        (currentFilter === "premium" && book.type === "premium") ||
        book.category.toLowerCase() === currentFilter.toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        book.title.toLowerCase().includes(normalizedSearch) ||
        book.author.toLowerCase().includes(normalizedSearch) ||
        book.category.toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });

    grid.innerHTML = "";

    filteredBooks.forEach((book, index) => {
      const card = document.createElement("article");
      card.className = "book-card";
      card.style.animationDelay = `${index * 0.05}s`;

      card.innerHTML = `
        <div class="book-cover-wrap">
          <img src="${book.image}" alt="${book.title}" loading="lazy">

          <div class="book-topline">
            <span class="book-status ${book.type}">
              ${book.type === "free" ? "FREE ACCESS" : "PREMIUM"}
            </span>
            <span class="book-index">
              ${String(book.id).padStart(2, "0")}
            </span>
          </div>

          <div class="book-hover">
            <span>Open archive entry →</span>
          </div>
        </div>

        <h3>${book.title}</h3>
        <p class="book-author">${book.author}</p>

        <div class="book-bottom">
          <span class="book-category">${book.category}</span>
          <span class="book-price">
            ${book.type === "free" ? "FREE" : `${book.price} USDC`}
          </span>
        </div>
      `;

      card.addEventListener("click", () => openBookModal(book));
      grid.appendChild(card);
    });

    const emptyState = $(".empty-state");

    if (emptyState) {
      emptyState.classList.toggle("show", filteredBooks.length === 0);
    }
  }

  /* -------------------------------------------------------
     SEARCH
  ------------------------------------------------------- */

  function setupSearch() {
    const searchInput = $(".search-box input");
    if (!searchInput) return;

    searchInput.addEventListener("input", (event) => {
      renderBooks(event.target.value);
    });
  }

  /* -------------------------------------------------------
     FILTERS
  ------------------------------------------------------- */

  function setupFilters() {
    $$(".filter-button").forEach((button) => {
      button.addEventListener("click", () => {
        $$(".filter-button").forEach((item) =>
          item.classList.remove("active")
        );

        button.classList.add("active");
        currentFilter = button.dataset.filter || "all";

        const searchInput = $(".search-box input");
        renderBooks(searchInput ? searchInput.value : "");
      });
    });
  }

  /* -------------------------------------------------------
     NAVIGATION
  ------------------------------------------------------- */

  function setupNavigation() {
    const menuButton = $(".menu-button");
    const mobileMenu = $(".mobile-menu");

    if (menuButton && mobileMenu) {
      menuButton.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
      });

      $$(".mobile-menu a").forEach((link) => {
        link.addEventListener("click", () => {
          mobileMenu.classList.remove("active");
        });
      });
    }

    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");
        const target = $(targetId);

        if (target) {
          event.preventDefault();
          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      });
    });
  }

  /* -------------------------------------------------------
     MODAL SYSTEM
  ------------------------------------------------------- */

  function openModal(modalId) {
    const modal = $(`#${modalId}`);
    if (!modal) return;

    modal.classList.add("active");
    document.body.classList.add("modal-open");
  }

  function closeAllModals() {
    $$(".modal-backdrop").forEach((modal) => {
      modal.classList.remove("active");
    });

    document.body.classList.remove("modal-open");
  }

  function setupModals() {
    $$(".modal-close").forEach((button) => {
      button.addEventListener("click", closeAllModals);
    });

    $$(".modal-backdrop").forEach((backdrop) => {
      backdrop.addEventListener("click", (event) => {
        if (event.target === backdrop) {
          closeAllModals();
        }
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeAllModals();
      }
    });
  }

  /* -------------------------------------------------------
     BOOK DETAILS MODAL
  ------------------------------------------------------- */

  function openBookModal(book) {
    currentBook = book;

    const modal = $("#bookModal");
    if (!modal) return;

    const image = $(".modal-book-cover img", modal);
    const label = $(".modal-label", modal);
    const title = $(".modal-book-info h2", modal);
    const author = $(".modal-author", modal);
    const description = $(".modal-description", modal);
    const meta = $(".modal-meta", modal);
    const price = $(".modal-purchase-row strong", modal);
    const actionButton = $("[data-book-action]", modal);

    if (image) {
      image.src = book.image;
      image.alt = book.title;
    }

    if (label) {
      label.textContent =
        book.type === "free" ? "OPEN ARCHIVE / FREE" : "PREMIUM ARCHIVE";
    }

    if (title) title.textContent = book.title;
    if (author) author.textContent = `By ${book.author}`;
    if (description) description.textContent = book.description;

    if (meta) {
      meta.innerHTML = `
        <span>${book.category}</span>
        <span>Digital Edition</span>
        <span>${book.type === "free" ? "Open Access" : "Token Access"}</span>
      `;
    }

    if (price) {
      price.textContent =
        book.type === "free" ? "FREE ACCESS" : `${book.price} USDC`;
    }

    if (actionButton) {
      actionButton.textContent =
        book.type === "free" ? "Read Free Edition" : "Add to Archive Cart";

      actionButton.onclick = () => {
        if (book.type === "free") {
          openBook(book);
        } else {
          addToCart(book);
        }
      };
    }

    openModal("bookModal");
  }

  function openBook(book) {
    if (!book || !book.pdf) {
      showToast("This edition is not available yet.");
      return;
    }

    closeAllModals();

    const purchased = library.some((item) => item.id === book.id);

    if (book.type === "free" || purchased) {
      window.open(book.pdf, "_blank");
    } else {
      showToast("Complete checkout to unlock this edition.");
    }
  }

  /* -------------------------------------------------------
     CART
  ------------------------------------------------------- */

  function setupCart() {
    $$("[data-open-cart]").forEach((button) => {
      button.addEventListener("click", () => {
        renderCart();
        openModal("cartModal");
      });
    });

    const checkoutButton = $("[data-checkout]");
    if (checkoutButton) {
      checkoutButton.addEventListener("click", () => {
        if (cart.length === 0) {
          showToast("Your archive cart is empty.");
          return;
        }

        renderCheckout();
        openModal("checkoutModal");
      });
    }
  }

  function addToCart(book) {
    if (!book) return;

    if (cart.some((item) => item.id === book.id)) {
      showToast("This book is already in your cart.");
      return;
    }

    cart.push(book);
    saveCart();
    updateCartCount();
    closeAllModals();

    showToast(`${book.title} added to cart.`);
  }

  function removeFromCart(bookId) {
    cart = cart.filter((book) => book.id !== bookId);
    saveCart();
    updateCartCount();
    renderCart();
  }

  function renderCart() {
    const container = $(".cart-items");
    const totalElement = $("[data-cart-total]");

    if (!container) return;

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <span>◌</span>
          <p>Your archive cart is currently empty.</p>
        </div>
      `;

      if (totalElement) totalElement.textContent = "0 USDC";
      return;
    }

    container.innerHTML = "";

    cart.forEach((book) => {
      const item = document.createElement("div");
      item.className = "cart-item";

      item.innerHTML = `
        <img src="${book.image}" alt="${book.title}">
        <div class="cart-item-info">
          <h4>${book.title}</h4>
          <span>${book.author}</span>
        </div>
        <span class="cart-item-price">${book.price} USDC</span>
        <button class="remove-cart-item" aria-label="Remove book">×</button>
      `;

      $(".remove-cart-item", item).addEventListener("click", () => {
        removeFromCart(book.id);
      });

      container.appendChild(item);
    });

    const total = cart.reduce((sum, book) => sum + book.price, 0);

    if (totalElement) {
      totalElement.textContent = `${total} USDC`;
    }
  }

  function updateCartCount() {
    $$("[data-cart-count]").forEach((element) => {
      element.textContent = cart.length;
    });
  }

  /* -------------------------------------------------------
     CHECKOUT
  ------------------------------------------------------- */

  function renderCheckout() {
    const subtotalElement = $("[data-checkout-subtotal]");
    const totalElement = $("[data-checkout-total]");
    const itemsElement = $("[data-checkout-items]");

    const total = cart.reduce((sum, book) => sum + book.price, 0);

    if (subtotalElement) {
      subtotalElement.textContent = `${total} USDC`;
    }

    if (totalElement) {
      totalElement.textContent = `${total} USDC`;
    }

    if (itemsElement) {
      itemsElement.textContent = `${cart.length} digital edition${
        cart.length !== 1 ? "s" : ""
      }`;
    }
  }

  $$("[data-confirm-payment]").forEach((button) => {
    button.addEventListener("click", processPayment);
  });

  function processPayment() {
    if (cart.length === 0) {
      showToast("No books selected.");
      return;
    }

    const button = $("[data-confirm-payment]");
    if (button) {
      button.disabled = true;
      button.textContent = "Verifying transaction...";
    }

    setTimeout(() => {
      cart.forEach((book) => {
        if (!library.some((item) => item.id === book.id)) {
          library.push({
            ...book,
            purchasedAt: new Date().toISOString(),
            transaction: createTransactionHash()
          });
        }
      });

      saveLibrary();

      cart = [];
      saveCart();
      updateCartCount();

      closeAllModals();

      if (button) {
        button.disabled = false;
        button.textContent = "Confirm Payment";
      }

      showToast("Transaction confirmed. Editions unlocked.");
    }, 1800);
  }

  function createTransactionHash() {
    const chars = "abcdef0123456789";
    let hash = "0x";

    for (let i = 0; i < 24; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }

    return hash;
  }

  /* -------------------------------------------------------
     WALLET CONNECTION
  ------------------------------------------------------- */

  function setupWallet() {
    $$("[data-connect-wallet]").forEach((button) => {
      button.addEventListener("click", connectWallet);
    });
  }

  async function connectWallet() {
    const buttons = $$("[data-connect-wallet]");

    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts"
        });

        const address = accounts[0];

        buttons.forEach((button) => {
          button.classList.add("connected");
          button.innerHTML = `
            <span class="wallet-dot"></span>
            ${shortenAddress(address)}
          `;
        });

        localStorage.setItem("luminaryWallet", address);
        showToast("Wallet connected.");
      } catch {
        showToast("Wallet connection cancelled.");
      }

      return;
    }

    // Fallback for browsers without a crypto wallet extension
    const simulatedAddress = "0x" + Math.random().toString(16).slice(2, 12);

    buttons.forEach((button) => {
      button.classList.add("connected");
      button.innerHTML = `
        <span class="wallet-dot"></span>
        ${shortenAddress(simulatedAddress)}
      `;
    });

    localStorage.setItem("luminaryWallet", simulatedAddress);
    showToast("Preview wallet connected.");
  }

  function shortenAddress(address) {
    if (!address) return "Connect Wallet";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  /* /*------------------------------------------------------------------
  PUBLISH / AUTHOR FORM
------------------------------------------------------------------*/

function setupPublishing() {
  $$("[data-open-publish]").forEach((button) => {
    button.addEventListener("click", () => {
      openModal("publishModal");
    });
  });

  const form = $("#publishForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const title = formData.get("title");

    closeAllModals();
    form.reset();

    showToast(
      `"${title || "Your manuscript"}" submitted for archive review.`
    );
  });
}

/*------------------------------------------------------------------
  TOAST
------------------------------------------------------------------*/

function showToast(message) {
  const toast = $(".toast");
  const toastMessage = $("#toastMessage");

  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.luminaryToastTimer);

  window.luminaryToastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

/*------------------------------------------------------------------
  SCROLL EFFECTS
------------------------------------------------------------------*/

function setupScrollEffects() {
  const header = $(".site-header");

  window.addEventListener(
    "scroll",
    () => {
      if (!header) return;

      if (window.scrollY > 30) {
        header.style.background = "rgba(9, 10, 13, 0.72)";
        header.style.backdropFilter = "blur(18px)";
      } else {
        header.style.background = "transparent";
        header.style.backdropFilter = "none";
      }
    },
    { passive: true }
  );

  const revealElements = $$(
    ".section-padding, .collection-card, .protocol-card, .publish-card"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    revealElements.forEach((element) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(25px)";
      element.style.transition = "opacity .8s ease, transform .8s ease";
      observer.observe(element);
    });
  }
}

/*------------------------------------------------------------------
  RESTORE WALLET STATE
------------------------------------------------------------------*/

const savedWallet = localStorage.getItem("luminaryWallet");

if (savedWallet) {
  window.addEventListener("DOMContentLoaded", () => {
    $$("[data-connect-wallet]").forEach((button) => {
      button.classList.add("connected");
      button.innerHTML = `
        <span class="wallet-dot"></span>
        ${shortenAddress(savedWallet)}
      `;
    });
  });
}

/*------------------------------------------------------------------
  PUBLIC ACCESS
------------------------------------------------------------------*/

window.LuminaryArchives = {
  books,
  cart,
  library,
  openBook,
  addToCart,
  showToast
};
})();
