const nameInput = document.getElementById("name");
const passwordInput = document.getElementById("password");
const registerLoginButton = document.getElementById("registerLoginButton");

nameInput.addEventListener('input', (event) => {
    if(passwordInput.value){
        registerLoginButton.disabled = false;
    }
});
nameInput.addEventListener('input', (event) => {
    if(passwordInput.value){
        registerLoginButton.disabled = false;
    }
});






function LogIn(event){
    console.log("login");

    const user = {
        name: document.getElementById("name").value,
        password: document.getElementById("password").value};

    return true;
}

async function userExists(user){
    const res = await fetch("/api/User/GetUsers");
    const users = await res.json();
    return users.some(u => u.name === user.name);
}




async function Register(event){
    console.log("Trying to register a user")

    event.preventDefault();

    const user = {
        name: document.getElementById("name").value,
        password: document.getElementById("password").value};

    if (user.name && user.password)  {
        
        if (await userExists(user)){
            console.log("This gmail is already in the database");
            return true;
        }

        const response = await fetch("/api/User/CreateUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });
        if (response.ok){
            console.log("User registered");
        }

        return true;
    }
    console.log("Enter email and password!");
}