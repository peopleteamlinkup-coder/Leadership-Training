const APPS_SCRIPT_URL =
  "https://script.google.com/a/macros/linkupbpo.com/s/AKfycbwB9_zRq3XNwAlparwPH6kdKlhZyMXHAXoSXMx5Vg3geb0AAvijWDynyL06fQBbGWM/exec";

const PROGRAM = "Aspiring Leaders Link Up";
const SESSION = "Session 2";
const SCENARIO = "The Strong Performer";

const state = {
  participant: {
    name: "",
    address: "",
    location: ""
  },
  sessionId: "",
  firstPath: "",
  firstResponse: "",
  alexFirstReply: "",
  secondPath: "",
  secondResponse: "",
  alexSecondReply: "",
  finalReflection: ""
};

const firstReplies = {
  curious:
    "Honestly, things have been difficult at home lately. I am trying to manage it, but mornings have been unpredictable. I did not want it to look like I was making excuses.",
  direct:
    "I understand that there is a standard, but it is frustrating because my performance has not dropped. I feel like the results I deliver should count for something.",
  ignore:
    "Okay, thanks. I appreciate you being flexible about it. I will keep making sure my work gets done."
};

const secondReplies = {
  "support-accountability":
    "That feels fair. I appreciate you asking what might help instead of assuming the worst. I can work with a clear plan and check back in with you if things change.",
  "support-only":
    "I really appreciate the flexibility. I am relieved, although I am not completely sure what the expectation is from here or when we should revisit it.",
  "policy-only":
    "I understand the expectation. I will do my best, but I still feel like there is not much room to talk about what is happening or what might make the situation manageable."
};

const reflectionContent = {
  curious: {
    principle:
      "You made room to understand the situation before deciding what the lateness meant. Strong leadership still requires you to make the attendance expectation explicit.",
    people:
      "Your approach created space for Alex to share context. Curiosity can reduce defensiveness and help you respond to the real issue rather than your first assumption."
  },
  direct: {
    principle:
      "You made the attendance standard visible early. The opportunity is to pair clarity with curiosity so the standard does not become the entire conversation.",
    people:
      "Leading with the rule can create clarity, but it may also increase defensiveness if the employee does not feel heard. Notice whether you made space for context."
  },
  ignore: {
    principle:
      "Prioritizing performance over attendance may feel practical in the moment, but it can create unclear or inconsistent expectations for the wider team.",
    people:
      "Alex may feel trusted, but other team members may experience the situation differently if they are expected to meet the same standard without explanation."
  }
};

const processContent = {
  "support-accountability":
    "You balanced support with a clear expectation and a follow up point. This creates a path that is both humane and workable.",
  "support-only":
    "Support matters, but flexibility without a clear agreement can create ambiguity. Define what is changing, for how long, and when you will review it.",
  "policy-only":
    "The standard is clear, but the process may miss reasonable support options. Consider what flexibility is appropriate while still protecting team expectations."
};

const reflectionQuestions = {
  "support-accountability":
    "How can you make compassion and accountability visible at the same time?",
  "support-only":
    "When does flexibility become inconsistency, and how would you prevent that?",
  "policy-only":
    "How can you uphold a standard without closing the door on reasonable support?"
};

document.addEventListener("DOMContentLoaded", () => {
  state.sessionId = getOrCreateSessionId();

  wireSignup();
  wireChoices();
  wireTextareas();
  wireNavigation();
  wireCompletion();
});

function getOrCreateSessionId() {
  const storageKey = "linkupSessionId";
  let id = localStorage.getItem(storageKey);

  if (!id) {
    if (window.crypto && crypto.randomUUID) {
      id = crypto.randomUUID();
    } else {
      id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }

    localStorage.setItem(storageKey, id);
  }

  return id;
}

function wireSignup() {
  const form = document.getElementById("signupForm");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    state.participant = {
      name: document.getElementById("name").value.trim(),
      address: document.getElementById("address").value.trim(),
      location: document.getElementById("location").value.trim()
    };

    await saveSimulation({
      ...state.participant,
      status: "Started"
    });

    showView("simulationView");
    showStep(1);
  });
}

function wireChoices() {
  document.querySelectorAll("[data-first-path]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-first-path]").forEach((b) => {
        b.classList.remove("selected");
      });

      button.classList.add("selected");
      state.firstPath = button.dataset.firstPath;
      updateContinueState(1);
    });
  });

  document.querySelectorAll("[data-second-path]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-second-path]").forEach((b) => {
        b.classList.remove("selected");
      });

      button.classList.add("selected");
      state.secondPath = button.dataset.secondPath;
      updateContinueState(2);
    });
  });
}

function wireTextareas() {
  setupCounter("response1", "counter1", 1);
  setupCounter("response2", "counter2", 2);

  const finalReflection = document.getElementById("finalReflection");
  finalReflection.addEventListener("input", () => {
    state.finalReflection = finalReflection.value.trim();
  });
}

function setupCounter(textareaId, counterId, step) {
  const textarea = document.getElementById(textareaId);
  const counter = document.getElementById(counterId);

  textarea.addEventListener("input", () => {
    counter.textContent = textarea.value.length;

    if (step === 1) {
      state.firstResponse = textarea.value.trim();
    } else {
      state.secondResponse = textarea.value.trim();
    }

    updateContinueState(step);
  });
}

function updateContinueState(step) {
  if (step === 1) {
    document.getElementById("continue1").disabled =
      !(state.firstPath && state.firstResponse);
  }

  if (step === 2) {
    document.getElementById("continue2").disabled =
      !(state.secondPath && state.secondResponse);
  }
}

function wireNavigation() {
  document.getElementById("continue1").addEventListener("click", async () => {
    state.firstResponse = document.getElementById("response1").value.trim();
    state.alexFirstReply = firstReplies[state.firstPath];

    document.getElementById("alexReply1").textContent = state.alexFirstReply;

    await saveSimulation({
      ...state.participant,
      firstResponse: state.firstResponse,
      firstPath: prettyPath(state.firstPath),
      alexFirstReply: state.alexFirstReply,
      status: "In Progress"
    });

    showStep(2);
  });

  document.getElementById("continue2").addEventListener("click", async () => {
    state.secondResponse = document.getElementById("response2").value.trim();
    state.alexSecondReply = secondReplies[state.secondPath];

    document.getElementById("alexReply2").textContent = state.alexSecondReply;

    await saveSimulation({
      ...state.participant,
      firstResponse: state.firstResponse,
      firstPath: prettyPath(state.firstPath),
      alexFirstReply: state.alexFirstReply,
      secondResponse: state.secondResponse,
      secondPath: prettyPath(state.secondPath),
      status: "In Progress"
    });

    showStep(3);
  });

  document.getElementById("showReflection").addEventListener("click", () => {
    buildReflection();
    showStep(4);
  });

  document.getElementById("restartBtn").addEventListener("click", () => {
    const confirmed = window.confirm(
      "Restart this simulation? Your current on-screen progress will be cleared."
    );

    if (confirmed) {
      resetSimulation(true);
    }
  });
}

function buildReflection() {
  const first = reflectionContent[state.firstPath];
  const process = processContent[state.secondPath];
  const question = reflectionQuestions[state.secondPath];

  document.getElementById("principleFeedback").textContent = first.principle;
  document.getElementById("peopleFeedback").textContent = first.people;
  document.getElementById("processFeedback").textContent = process;
  document.getElementById("reflectionQuestion").textContent = question;
}

function wireCompletion() {
  document.getElementById("saveReflectionBtn").addEventListener("click", async () => {
    state.finalReflection =
      document.getElementById("finalReflection").value.trim();

    const status = document.getElementById("saveStatus");
    status.textContent = "Saving...";

    await saveSimulation({
      ...state.participant,
      firstResponse: state.firstResponse,
      firstPath: prettyPath(state.firstPath),
      alexFirstReply: state.alexFirstReply,
      secondResponse: state.secondResponse,
      secondPath: prettyPath(state.secondPath),
      finalReflection: state.finalReflection,
      status: "Completed"
    });

    status.textContent = "Reflection sent to the facilitator response sheet.";
  });

  document.getElementById("finishBtn").addEventListener("click", async () => {
    state.finalReflection =
      document.getElementById("finalReflection").value.trim();

    await saveSimulation({
      ...state.participant,
      firstResponse: state.firstResponse,
      firstPath: prettyPath(state.firstPath),
      alexFirstReply: state.alexFirstReply,
      secondResponse: state.secondResponse,
      secondPath: prettyPath(state.secondPath),
      finalReflection: state.finalReflection,
      status: "Completed"
    });

    showView("completeView");
  });

  document.getElementById("startAgainBtn").addEventListener("click", () => {
    resetSimulation(false);
  });
}

function prettyPath(path) {
  const labels = {
    curious: "Explore first",
    direct: "Lead with the standard",
    ignore: "Let it go for now",
    "support-accountability": "Support + accountability",
    "support-only": "Focus only on support",
    "policy-only": "Focus only on policy"
  };

  return labels[path] || path || "";
}

function showStep(stepNumber) {
  document.querySelectorAll(".sim-step").forEach((step) => {
    step.classList.remove("sim-step-active");
  });

  document
    .getElementById(`step${stepNumber}`)
    .classList.add("sim-step-active");

  document.getElementById("progressText").textContent =
    `Step ${stepNumber} of 4`;

  document.getElementById("progressBar").style.width =
    `${stepNumber * 25}%`;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showView(viewId) {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.remove("view-active");
  });

  document.getElementById(viewId).classList.add("view-active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetSimulation(returnToSignup) {
  state.firstPath = "";
  state.firstResponse = "";
  state.alexFirstReply = "";
  state.secondPath = "";
  state.secondResponse = "";
  state.alexSecondReply = "";
  state.finalReflection = "";

  localStorage.removeItem("linkupSessionId");
  state.sessionId = getOrCreateSessionId();

  document.getElementById("response1").value = "";
  document.getElementById("response2").value = "";
  document.getElementById("finalReflection").value = "";

  document.getElementById("counter1").textContent = "0";
  document.getElementById("counter2").textContent = "0";

  document.querySelectorAll(".choice-card").forEach((button) => {
    button.classList.remove("selected");
  });

  updateContinueState(1);
  updateContinueState(2);

  if (returnToSignup) {
    showView("signupView");
  } else {
    document.getElementById("signupForm").reset();
    showView("signupView");
  }
}

async function saveSimulation(data) {
  const submission = {
    sessionId: state.sessionId,
    program: PROGRAM,
    session: SESSION,
    scenario: SCENARIO,
    ...data
  };

  try {
    /*
      Apps Script web apps commonly require a no-cors browser POST
      when called directly from a static GitHub Pages site.
      The response itself cannot be inspected in this mode, but the
      submission is still sent to Apps Script.
    */
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(submission)
    });

    return true;
  } catch (error) {
    console.error("Unable to save Link Up submission:", error);
    return false;
  }
}
