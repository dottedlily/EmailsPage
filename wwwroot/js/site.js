


if (window.location.pathname === '/Main') {
    loadUsers();
}
if (window.location.pathname === '/LogIn' || window.location.pathname === '/Register') {
    listenToInput();
}


function listenToInput(){
    const nameInput = document.getElementById("name");
    const passwordInput = document.getElementById("password");
    const emailInput = document.getElementById("email");
    const registerLoginButton = document.getElementById("registerLoginButton");

    function updateButton() {
        registerLoginButton.disabled = !(nameInput.value && passwordInput.value && emailInput.checkValidity());
    }

    nameInput.addEventListener("input", updateButton);
    emailInput.addEventListener("input", updateButton);
    passwordInput.addEventListener("input", updateButton);
}


async function LogIn(event){
    event.preventDefault();

    const user = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        };
    
    if(await authenticate(user)){
        console.log("Correct password for " + user.name);
        window.location.href = "/Main";
        return true;
    }

    console.log("Password or email are incorrect!");
    return true;
}

async function authenticate(user){
    const res = await fetch("/api/User/GetUsers");
    const users = await res.json();
    return users.some(u => u.email === user.email && u.password === user.password);
}


async function Register(event){

    event.preventDefault();

    const user = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value};

    if (user.name && user.password)  {

        const response = await fetch("/api/User/CreateUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });
        if (response.ok){
            console.log("User registered");
            
            window.location.href = "/Main";
        }else if (response.status === 409) {
            console.log("User already exists");
        }else if (response.status === 500) {
            console.log("Database Error.");
        }

        return true;
    }
    console.log("Enter email and password!");
}

function selectAllUsers(selectAllCheckbox){

    console.log("lalal");
    if(selectAllCheckbox.checked){
        console.log("All users are selected");
    }else{
        console.log("All users are unselected");
    }
}

async function loadUsers(){
  const res = await fetch("/api/User/GetUsers");
  const tableData = await res.json();

  let tableHead = document.getElementById("tableHead");
  let tableBody = document.getElementById("tableBody");
  tableHead.innerHTML = "";
  tableBody.innerHTML = "";
  let colNames = ["", "Email", "Name", "Verified", "Blocked", "Id"];
  let propertyNames = ["", "email", "name", "verified", "blocked", "id"];

  let nCol = 6;
  let nRow = tableData.length;

    let firstrow = tableHead.insertRow();
    firstrow.style.fontWeight = "bold";

    let checkBoxCell = firstrow.insertCell(0);
    checkBoxCell.innerHTML = '<input type="checkbox" name="allSelect" id="selectAllCheckbox">';
    const checkbox = document.getElementById("selectAllCheckbox");

    checkbox.addEventListener('change', function() {
        let checked = this.checked;
        let checkboxes = document.querySelectorAll('input[type="checkbox"][name="rowSelect"]');
        checkboxes.forEach( rowCheckbox => {rowCheckbox.checked = checked});

    });
    for (let index = 1; index < nCol; index++) {
        firstrow.insertCell(index).innerHTML = colNames[index];
        
    }
  
  for (let index_r = 0; index_r < nRow; index_r++) {

    let row = tableBody.insertRow();
    let checkBoxCell = row.insertCell(0);
    checkBoxCell.innerHTML = `<input type="checkbox" name="rowSelect" id="${String(index_r)}">`;

    let email = row.insertCell(1);
    email.innerHTML = tableData[index_r][propertyNames[1]];
    let name = row.insertCell(2);
    name.innerHTML = tableData[index_r][propertyNames[2]];
    let verified = row.insertCell(3);
    verified.innerHTML = tableData[index_r][propertyNames[3]];
    let blocked = row.insertCell(4);
    blocked.innerHTML = tableData[index_r][propertyNames[4]];
    let id = row.insertCell(5);
    id.innerHTML = tableData[index_r][propertyNames[5]];

  }
}

async function deleteUser(rowId){
    let userEmail = document.querySelector("#tableBody").rows[rowId].cells[1].textContent;
    const res = await fetch(`/api/User/DeleteUser?userEmail=${userEmail}`, {method: "DELETE"});
    loadUsers();
}

async function blockUnblockUser(rowId, block){

    const res = await fetch("/api/User/GetUsers");
    const users = await res.json();
    let id = Number(document.querySelector("#tableBody").rows[rowId].cells[5].textContent);
    let user = users.find(x => x.id === id);
    user.blocked = block;

    const response = await fetch("/api/User/EditUser", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

    loadUsers();
}

function deleteAction(){
    const checkedBoxes = document.querySelectorAll('input[type="checkbox"][name="rowSelect"]:checked');
    checkedBoxes.forEach(row => deleteUser(String(row.id)));
}

function blockAction(block){
    const checkedBoxes = document.querySelectorAll('input[type="checkbox"][name="rowSelect"]:checked');
    checkedBoxes.forEach(row => blockUnblockUser(String(row.id), block));
}