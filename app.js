document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();

  let id = e.target.querySelector("#id").value;
  let species = e.target.querySelector("#species").value;
  let date = e.target.querySelector("#date").value;
  let location = e.target.querySelector("#location").value;
  let cropSource = e.target.querySelector("#cropSource").value;
  let unit = e.target.querySelector("#unit").value;

  if (id && species && date && location && cropSource && unit) {
    let task = {
      id: id,
      species: species,
      date: date,
      location: location,
      cropSource: cropSource,
      unit: unit,
    };

    addTaskToSection(task);

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    e.target.reset();
  }
});

document.querySelector(".sort button").addEventListener("click", function () {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // 根據日期進行排序
  tasks.sort((a, b) => new Date(a.date) - new Date(b.date));

  // 清空section，以重新渲染排序後的任務
  document.querySelector("section").innerHTML = "";
  tasks.forEach(addTaskToSection);
});

function addTaskToSection(task) {
  let taskElement = document.createElement("div");
  taskElement.className = "task-item";
  taskElement.innerHTML = `
      <div class="task-detail">編號: ${task.id}</div>
      <div class="task-detail">種名: ${task.species}</div>
      <div class="task-detail">分離日期: ${task.date}</div>
      <div class="task-detail">分離地點: ${task.location}</div>
      <div class="task-detail">作物來源: ${task.cropSource}</div>
      <div class="task-detail">單位: ${task.unit}</div>
      <div class="task-actions">   
          <button onclick="removeTask(this, '${task.id}')">刪除</button>
      </div>`;
  document.querySelector("section").appendChild(taskElement);
}

function removeTask(button, id) {
  button.parentElement.parentElement.remove();

  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks = tasks.filter((task) => task.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

window.onload = function () {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(addTaskToSection);
};
function convertToCSV(objArray) {
  const array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
  let str = "";

  for (let i = 0; i < array.length; i++) {
    let line = "";
    for (let index in array[i]) {
      if (line !== "") line += ",";
      line += array[i][index];
    }
    str += line + "\r\n";
  }

  return str;
}
function downloadCSV() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let csv = "編號,種名,分離日期,分離地點,作物來源,單位\n";
  csv += convertToCSV(tasks);

  // Adding BOM
  const BOM = "\uFEFF";
  csv = BOM + csv;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = window.document.createElement("a");
  a.href = window.URL.createObjectURL(blob);
  a.download = "tasks.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
