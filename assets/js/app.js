const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyP-Lt9viddpY7YQLwKE84Dm1v7OgnV7apQLryLB4dDUXPEdUhvmSt4esMHsIyZFa148Q/exec";

const switchButtons = document.querySelectorAll(".switch-btn");
const formSections = document.querySelectorAll(".form-card");
const heroEntrepriseBtn = document.getElementById("heroEntrepriseBtn");

function setForm(formName) {
  const targetId = formName === "entreprise" ? "entrepriseForm" : "jeuneForm";

  switchButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.target === targetId);
  });

  formSections.forEach((section) => {
    section.classList.toggle("hidden", section.id !== targetId);
  });
}

switchButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    setForm(btn.dataset.target === "entrepriseForm" ? "entreprise" : "jeune");
  });
});

if (heroEntrepriseBtn) {
  heroEntrepriseBtn.addEventListener("click", () => {
    setForm("entreprise");
  });
}

function getUserKey(payload) {
  return `edustudyskill_${payload.formType}_${(payload.email || "").trim().toLowerCase()}_${(payload.telephone || "").trim()}`;
}

document.querySelectorAll(".js-submit-form").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const messageBox = form.querySelector(".message");
    const submitButton = form.querySelector(".submit-btn");

    messageBox.className = "message";
    messageBox.textContent = "";

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    if (payload.website) {
      messageBox.className = "message error";
      messageBox.textContent = "Soumission rejetée.";
      return;
    }

    payload.formType = form.dataset.formType;
    payload.submittedAt = new Date().toISOString();

    const userKey = getUserKey(payload);

    if (localStorage.getItem(userKey)) {
      messageBox.className = "message error";
      messageBox.textContent = "Vous avez déjà soumis une demande avec cet email et ce numéro.";
      return;
    }

    submitButton.disabled = true;

    const defaultButtonText =
      form.dataset.formType === "jeune"
        ? "Envoyer ma candidature"
        : "Devenir partenaire";

    submitButton.textContent = "Envoi en cours...";

    try {
      const body = new URLSearchParams(payload);

      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body,
        mode: "no-cors",
      });

      localStorage.setItem(userKey, "submitted");

      messageBox.className = "message success";
      messageBox.textContent = "Merci, votre demande a bien été envoyée.";
      form.reset();
    } catch (error) {
      console.error(error);
      messageBox.className = "message error";
      messageBox.textContent = "Échec de l'envoi. Veuillez réessayer.";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = defaultButtonText;
    }
  });
});

document.querySelectorAll(".js-contact-form").forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const messageBox = form.querySelector(".message");
    const btn = form.querySelector(".submit-btn");

    messageBox.className = "message";
    messageBox.textContent = "";

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    payload.formType = "contact";
    payload.submittedAt = new Date().toISOString();

    btn.disabled = true;
    btn.textContent = "Envoi...";

    try {
      const body = new URLSearchParams(payload);
      console.log(payload);

      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body,
        mode: "no-cors"
      });

      messageBox.className = "message success";
      messageBox.textContent = "Message envoyé avec succès.";
      form.reset();

    } catch (err) {
      console.error(err);
      messageBox.className = "message error";
      messageBox.textContent = "Erreur, veuillez réessayer.";
    } finally {
      btn.disabled = false;
      btn.textContent = "Envoyer le message";
    }
  });
});