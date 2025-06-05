const urlBase = 'http://cop4331project.online/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

// --- LOGIN FUNCTION ---
function doLogin() {
    console.log("doLogin from external file");

    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;

    document.getElementById("loginResult").innerHTML = "";

    let tmp = { login: login, password: password };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                console.log("Status:", this.status);
                console.log("Response:", this.responseText);
                if (this.status == 200) {
                    let jsonObject = JSON.parse(xhr.responseText);
                    console.log("Parsed JSON:", jsonObject);
                    userId = jsonObject.id;

                    if (userId < 1) {
                        document.getElementById("loginResult").innerHTML =
                            "User/Password combination incorrect";
                        return;
                    }

                    firstName = jsonObject.firstName;
                    lastName = jsonObject.lastName;

                    saveCookie();

                    window.location.href = "dashboard.html";
                } else {
                    document.getElementById("loginResult").innerHTML =
                        "Server error: " + this.status;
                }
            }
        };
        xhr.send(jsonPayload);
        
    } catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}


// --- COOKIE FUNCTIONS ---
function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = "firstName=" + encodeURIComponent(firstName) + ";expires=" + date.toGMTString() + ";path=/";
    document.cookie = "lastName=" + encodeURIComponent(lastName) + ";expires=" + date.toGMTString() + ";path=/";
    document.cookie = "userId=" + userId + ";expires=" + date.toGMTString() + ";path=/";
}

function readCookie() {
    userId = -1;
    firstName = "";
    lastName = "";

    let cookies = document.cookie.split(';');
    for (let c of cookies) {
        let [key, val] = c.trim().split('=');
        if (key === "firstName") {
            firstName = decodeURIComponent(val);
        } else if (key === "lastName") {
            lastName = decodeURIComponent(val);
        } else if (key === "userId") {
            userId = parseInt(val);
        }
    }

    if (userId < 0) {
        window.location.href = "index.html";
    } else {
        let userNameElem = document.getElementById("userName");
        if (userNameElem) {
            userNameElem.innerHTML = "Logged in as " + firstName + " " + lastName;
        }
    }
}

function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";

    document.cookie = "firstName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "lastName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

    window.location.href = "index.html";
}
/*
// --- VALIDATION FUNCTION FOR ADD CONTACT ---
function validAddContact(fn, ln, phone, email) {
    if (fn.length === 0 || ln.length === 0 || phone.length === 0 || email.length === 0) {
        alert("All fields are required.");
        return false;
    }
    // Basic email format check (simple regex)
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }
    return true;
}
*/

// --- ADD CONTACT FUNCTION ---
function addContact() {
    let firstname = document.getElementById("contactFirstName").value;
    let lastname = document.getElementById("contactLastName").value;
    let phone = document.getElementById("contactPhone").value;
    let email = document.getElementById("contactEmail").value;

    if (userId === 0) {
        alert("User not logged in. Please login again.");
        return;
    }

    let tmp = {
        firstName: firstname,
        lastName: lastname,
        phone: phone,
        email: email,
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);
    console.log("Payload:", jsonPayload);

    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                alert("Contact added successfully");
                let form = document.getElementById("addMe");
                if (form) form.reset();
                loadContacts();
                showTable();
            } else {
                try {
                    let res = JSON.parse(this.responseText);
                    alert("Failed to add contact: " + (res.error || this.responseText));
                } catch {
                    alert("Failed to add contact. Status: " + this.status + ". Response: " + this.responseText);
                }
            }
        }
    };

    try {
        xhr.send(jsonPayload);
    } catch (err) {
        alert(err.message);
    }
}

// --- LOAD CONTACTS FUNCTION ---
function loadContacts() {
    let tmp = {
        search: "",
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/SearchContact.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }
                let text = "<table border='1'><tbody>";
                for (let i = 0; i < jsonObject.results.length; i++) {
                    text += "<tr id='row" + i + "'>";
                    text += "<td id='first_Name" + i + "'><span>" + jsonObject.results[i].FirstName + "</span></td>";
                    text += "<td id='last_Name" + i + "'><span>" + jsonObject.results[i].LastName + "</span></td>";
                    text += "<td id='email" + i + "'><span>" + jsonObject.results[i].Email + "</span></td>";
                    text += "<td id='phone" + i + "'><span>" + jsonObject.results[i].Phone + "</span></td>";
                    text += "<td>" +
                        "<button type='button' id='edit_button" + i + "' class='edit-btn' onclick='edit_row(" + i + ")'>Edit</button>" +
                        "<button type='button' id='save_button" + i + "' class='edit-btn' onclick='save_row(" + i + ")' style='display:none'>Save</button>" +
                        "<button type='button' onclick='delete_row(" + i + ")' class='delete-btn'>Delete</button>" +
                        "</td>";
                    text += "</tr>";
                }
                text += "</tbody></table>";
                document.getElementById("tbody").innerHTML = text;
            } else {
                console.log("Failed to load contacts. Status: " + this.status);
            }
        }
    };

    try {
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

// --- EDIT ROW FUNCTION ---
function edit_row(id) {
    document.getElementById("edit_button" + id).style.display = "none";
    document.getElementById("save_button" + id).style.display = "inline-block";

    let firstNameElem = document.getElementById("first_Name" + id);
    let lastNameElem = document.getElementById("last_Name" + id);
    let emailElem = document.getElementById("email" + id);
    let phoneElem = document.getElementById("phone" + id);

    let firstName = firstNameElem.innerText;
    let lastName = lastNameElem.innerText;
    let email = emailElem.innerText;
    let phone = phoneElem.innerText;

    firstNameElem.innerHTML = `<input type='text' id='namef_text${id}' value='${firstName}'>`;
    lastNameElem.innerHTML = `<input type='text' id='namel_text${id}' value='${lastName}'>`;
    emailElem.innerHTML = `<input type='text' id='email_text${id}' value='${email}'>`;
    phoneElem.innerHTML = `<input type='text' id='phone_text${id}' value='${phone}'>`;
}

// --- SAVE ROW FUNCTION ---
function save_row(id) {
    let firstName = document.getElementById("namef_text" + id).value;
    let lastName = document.getElementById("namel_text" + id).value;
    let email = document.getElementById("email_text" + id).value;
    let phone = document.getElementById("phone_text" + id).value;

    let tmp = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/UpdateContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                loadContacts();
            } else {
                alert("Failed to update contact. Status: " + this.status);
            }
        }
    };

    try {
        xhr.send(jsonPayload);
    } catch (err) {
        alert(err.message);
    }
}

// --- DELETE ROW FUNCTION ---
function delete_row(id) {
    let firstName = document.getElementById("first_Name" + id).innerText;
    let lastName = document.getElementById("last_Name" + id).innerText;

    if (confirm(`Confirm deletion of contact: ${firstName} ${lastName}`)) {
        let tmp = {
            firstName: firstName,
            lastName: lastName,
            userId: userId
        };

        let jsonPayload = JSON.stringify(tmp);
        let url = urlBase + '/DeleteContact.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    loadContacts();
                } else {
                    alert("Failed to delete contact. Status: " + this.status);
                }
            }
        };

        try {
            xhr.send(jsonPayload);
        } catch (err) {
            alert(err.message);
        }
    }
}

// --- SEARCH CONTACTS IN TABLE FUNCTION ---
function searchContacts() {
    const input = document.getElementById("searchText");
    const filterWords = input.value.toUpperCase().split(' ').filter(w => w.trim() !== "");
    const table = document.getElementById("contacts");
    if (!table) return;
    const tr = table.getElementsByTagName("tr");

    for (let i = 0; i < tr.length; i++) {
        const td_fn = tr[i].getElementsByTagName("td")[0];
        const td_ln = tr[i].getElementsByTagName("td")[1];
        if (td_fn && td_ln) {
            const txtValue_fn = td_fn.textContent || td_fn.innerText;
            const txtValue_ln = td_ln.textContent || td_ln.innerText;

            let showRow = false;
            for (const word of filterWords) {
                if (txtValue_fn.toUpperCase().indexOf(word) > -1 || txtValue_ln.toUpperCase().indexOf(word) > -1) {
                    showRow = true;
                    break;
                }
            }
            tr[i].style.display = showRow ? "" : "none";
        }
    }
}

// --- TOGGLE ADD CONTACT FORM & CONTACTS TABLE ---
function showTable() {
    const formElem = document.getElementById("addMe");
    const contactsElem = document.getElementById("contactsTable");
    if (!formElem || !contactsElem) return;

    if (formElem.style.display === "none" || formElem.style.display === "") {
        formElem.style.display = "block";
        contactsElem.style.display = "none";
    } else {
        formElem.style.display = "none";
        contactsElem.style.display = "block";
    }
}

// --- LOGIN/REGISTER TAB SWITCHING FUNCTIONS ---
function loginTab() {
    setTimeout(() => {
        document.getElementById("signupResult").innerHTML = "";
    }, 500);

    const loginBtn = document.getElementById("loginbtn");
    const registerBtn = document.getElementById("registerbtn");
    const loginForm = document.getElementById("login");
    const registerForm = document.getElementById("register");

    loginForm.classList.remove("form-hide-left");
    loginForm.classList.add("form-show-left");
    registerForm.classList.remove("form-show-right");
    registerForm.classList.add("form-hide-right");

    loginBtn.classList.add("btn-active");
    loginBtn.classList.remove("btn-inactive");
    registerBtn.classList.add("btn-inactive");
    registerBtn.classList.remove("btn-active");
}

function registerTab() {
    setTimeout(() => {
        document.getElementById("loginResult").innerHTML = "";
    }, 500);

    const loginBtn = document.getElementById("loginbtn");
    const registerBtn = document.getElementById("registerbtn");
    const loginForm = document.getElementById("login");
    const registerForm = document.getElementById("register");

    loginForm.classList.remove("form-show-left");
    loginForm.classList.add("form-hide-left");
    registerForm.classList.remove("form-hide-right");
    registerForm.classList.add("form-show-right");

    registerBtn.classList.add("btn-active");
    registerBtn.classList.remove("btn-inactive");
    loginBtn.classList.add("btn-inactive");
    loginBtn.classList.remove("btn-active");
}

// --- SHOW/HIDE SECTIONS FOR ADD/SEARCH/ABOUT ---
function hideAllSections() {
    document.getElementById("add-contact").classList.add("hidden");
    document.getElementById("search-contact").classList.add("hidden");
    document.getElementById("about").classList.add("hidden");
}

function showAddContact() {
    hideAllSections();
    document.getElementById("add-contact").classList.remove("hidden");
    document.getElementById("add-contact").scrollIntoView({ behavior: "smooth" });
}

function showSearchContact() {
    hideAllSections();
    document.getElementById("search-contact").classList.remove("hidden");
    document.getElementById("search-contact").scrollIntoView({ behavior: "smooth" });
    clearSearchResults();
}

function showAbout() {
    hideAllSections();
    document.getElementById("about").classList.remove("hidden");
    document.getElementById("about").scrollIntoView({ behavior: "smooth" });
}

function clearSearchResults() {
    document.getElementById("searchResults").innerHTML = "";
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = "";
}

function initializeTabSwitching() {
  
  document.getElementById("login").classList.remove("form-hide-left");
  document.getElementById("register").classList.add("form-hide-right");
  
}

