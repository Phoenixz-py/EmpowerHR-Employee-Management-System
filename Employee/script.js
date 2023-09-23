function getEmployeesFromLocalStorage() {
  const employeesJson = localStorage.getItem("employees");
  return employeesJson ? JSON.parse(employeesJson) : [];
}

function saveEmployeesToLocalStorage(employees) {
  localStorage.setItem("employees", JSON.stringify(employees));
}

let employees = getEmployeesFromLocalStorage();

function displayEmployees(employees) {
  const employeeList = document.getElementById("employeeList");
  employeeList.innerHTML = "";

  employees.forEach((employee) => {
    const card = createEmployeeCard(employee);
    employeeList.appendChild(card);
  });
}

function createEmployeeCard(employee) {
  const card = document.createElement("div");
  card.classList.add("employee-card");
  card.setAttribute("data-employee-id", employee.employeeId);

  card.innerHTML = `
      <h3>${employee.firstName} ${employee.lastName}</h3>
      <p>Salary: $${employee.salary}</p>
      <p>Address: ${employee.address}</p>
      <p>Employee ID: ${employee.employeeId}</p>
      <p>Email: ${employee.email}</p>
      <div class="card-buttons">
          <button class="edit-button" data-employee-id="${employee.employeeId}">Edit</button>
          <button class="delete-button" data-employee-id="${employee.employeeId}">Delete</button>
      </div>
    `;

  return card;
}

function searchEmployees() {
  const searchInput = document.getElementById("searchInput");
  const searchText = searchInput.value.trim().toLowerCase();

  const filteredEmployees = employees.filter((employee) => {
    const employeeName =
      `${employee.firstName} ${employee.lastName}`.toLowerCase();
    const employeeEmail = employee.email.toLowerCase();
    return (
      employeeName.includes(searchText) || employeeEmail.includes(searchText)
    );
  });

  displayEmployees(filteredEmployees);
}

function highlightSearchText(card, searchText) {
  const textElements = card.querySelectorAll("h3, p");
  textElements.forEach((element) => {
    const text = element.textContent;
    const regex = new RegExp(searchText, "gi");
    const highlightedText = text.replace(
      regex,
      (match) => `<span class="highlight">${match}</span>`
    );
    element.innerHTML = highlightedText;
  });
}

function addEmployee() {
  const form = document.getElementById("employeeForm");
  const firstName = form.firstName.value.trim();
  const lastName = form.lastName.value.trim();
  const salary = parseFloat(form.salary.value);
  const address = form.address.value.trim();
  const employeeId = form.employeeId.value.trim();
  const email = form.email.value.trim();

  if (
    !firstName ||
    !lastName ||
    isNaN(salary) ||
    !address ||
    !employeeId ||
    !email
  ) {
    alert("Please fill in all fields with valid data.");
    return;
  }

  const newEmployee = {
    firstName,
    lastName,
    salary,
    address,
    employeeId,
    email,
  };

  employees.push(newEmployee);
  saveEmployeesToLocalStorage(employees);
  displayEmployees(employees);

  form.reset();
  closePopupForm();
}

function showPopupForm(mode, employee) {
  const popupForm = document.getElementById("popupForm");
  const form = document.getElementById("employeeForm");

  if (mode === "add") {
    form.reset();
    form.setAttribute("data-mode", "add");
    form.removeAttribute("data-employee-id");
    popupForm.style.display = "block";
  } else if (mode === "edit" && employee) {
    form.firstName.value = employee.firstName;
    form.lastName.value = employee.lastName;
    form.salary.value = employee.salary;
    form.address.value = employee.address;
    form.employeeId.value = employee.employeeId;
    form.email.value = employee.email;
    form.setAttribute("data-mode", "edit");
    form.setAttribute("data-employee-id", employee.employeeId);
    popupForm.style.display = "block";
  }
}

function closePopupForm() {
  const popupForm = document.getElementById("popupForm");
  popupForm.style.display = "none";
}

function editEmployee(employeeId) {
  const employee = employees.find((emp) => emp.employeeId === employeeId);
  if (!employee) {
    alert("Employee not found.");
    return;
  }

  showPopupForm("edit", employee);
}

function saveEditedEmployee(employeeId) {
  const form = document.getElementById("employeeForm");
  const firstName = form.firstName.value.trim();
  const lastName = form.lastName.value.trim();
  const salary = parseFloat(form.salary.value);
  const address = form.address.value.trim();
  const email = form.email.value.trim();

  if (!firstName || !lastName || isNaN(salary) || !address || !email) {
    alert("Please fill in all fields with valid data.");
    return;
  }

  const employeeIndex = employees.findIndex(
    (emp) => emp.employeeId === employeeId
  );
  if (employeeIndex === -1) {
    alert("Employee not found.");
    return;
  }

  employees[employeeIndex] = {
    firstName,
    lastName,
    salary,
    address,
    employeeId,
    email,
  };

  saveEmployeesToLocalStorage(employees);

  displayEmployees(employees);

  closePopupForm();
}

function deleteEmployee(employeeId) {
  const index = employees.findIndex((emp) => emp.employeeId === employeeId);
  if (index === -1) {
    alert("Employee not found.");
    return;
  }

  employees.splice(index, 1);
  saveEmployeesToLocalStorage(employees);
  displayEmployees(employees);
}

// Event listeners
document
  .getElementById("addEmployeeButton")
  .addEventListener("click", function () {
    showPopupForm("add");
  });

document
  .getElementById("employeeForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const mode = this.getAttribute("data-mode");

    if (mode === "add") {
      addEmployee();
    } else if (mode === "edit") {
      const employeeId = this.getAttribute("data-employee-id");
      saveEditedEmployee(employeeId);
    }
  });

document.getElementById("closeForm").addEventListener("click", closePopupForm);
document
  .getElementById("searchInput")
  .addEventListener("input", searchEmployees);

document.getElementById("employeeList").addEventListener("click", function (e) {
  const target = e.target;

  if (target.classList.contains("edit-button")) {
    const employeeId = target.getAttribute("data-employee-id");
    editEmployee(employeeId);
  } else if (target.classList.contains("delete-button")) {
    const employeeId = target.getAttribute("data-employee-id");
    deleteEmployee(employeeId);
  }
});

displayEmployees(employees);

function filterByName() {
  const searchInput = document.getElementById("searchInput");
  const searchText = searchInput.value.trim().toLowerCase();

  const filteredEmployees = employees.filter((employee) => {
    const employeeName =
      `${employee.firstName} ${employee.lastName}`.toLowerCase();
    return employeeName.includes(searchText);
  });

  const sortedEmployees = filteredEmployees.slice().sort((a, b) => {
    const nameA = `${a.firstName} ${a.lastName}`.toUpperCase();
    const nameB = `${b.firstName} ${b.lastName}`.toUpperCase();
    return nameA.localeCompare(nameB);
  });

  displayEmployees(sortedEmployees);
}

function filterBySalary() {
  const filteredEmployees = employees
    .slice()
    .sort((a, b) => a.salary - b.salary);
  displayEmployees(filteredEmployees);
}

function handleFilter() {
  const filterDropdown = document.getElementById("filterDropdown");
  const selectedValue = filterDropdown.value;

  if (selectedValue === "name") {
    filterByName();
  } else if (selectedValue === "salary") {
    filterBySalary();
  }
}

document
  .getElementById("filterDropdown")
  .addEventListener("change", handleFilter);

displayEmployees(employees);
