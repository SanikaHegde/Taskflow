const API_URL = "http://localhost:3000/tasks";
const modal = document.getElementById("taskModal");

// 🩵 Show / Hide modal
function toggleModal(show) {
  modal.classList.toggle("active", show);
}

// 🩵 Add new task
async function addTask() {
  const title = document.getElementById("taskTitle").value;
  const description = document.getElementById("taskDesc").value;

  if (!title.trim()) {
    alert("Please enter a task title");
    return;
  }

  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    toggleModal(false);
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDesc").value = "";
    fetchTasks();
  } catch (err) {
    console.error("Error adding task:", err);
  }
}

// 🩵 Fetch tasks and update dashboard
async function fetchTasks() {
  try {
    const res = await fetch(API_URL);
    const tasks = await res.json();

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "completed").length;
    const pending = total - completed;
    const completionRate = total ? ((completed / total) * 100).toFixed(1) : 0;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;
    document.getElementById("completionRate").textContent = `${completionRate}%`;

    renderCharts(completed, pending);
  } catch (err) {
    console.error("Error loading tasks:", err);
  }
}

// 🩵 Render charts using Chart.js
function renderCharts(completed, pending) {
  const bar = document.getElementById("barChart");
  const pie = document.getElementById("pieChart");

  if (!bar || !pie) return;

  new Chart(bar, {
    type: "bar",
    data: {
      labels: ["Completed", "Pending"],
      datasets: [{
        label: "Tasks",
        data: [completed, pending],
        backgroundColor: ["#22c55e", "#facc15"],
        borderRadius: 8
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });

  new Chart(pie, {
    type: "doughnut",
    data: {
      labels: ["Completed", "Pending"],
      datasets: [{
        data: [completed, pending],
        backgroundColor: ["#22c55e", "#ef4444"]
      }]
    },
    options: { plugins: { legend: { position: "bottom" } } }
  });
}

// 🩵 Initialize dashboard
fetchTasks();
