
/* =========================================================
   DEVOPS SERVICE URLS
========================================================= */

const SERVICE_URLS = {

    springboot: "http://localhost:8080",
    promethus: "http://localhost:9090",

    kafka: "http://localhost:8081",

    minio: "http://localhost:9001",

    grafana: "http://localhost:3000",

    kibana: "http://localhost:5601",

    elasticsearch: "http://localhost:9200"

};


/* =========================================================
   OPEN DEVOPS SERVICE
========================================================= */

function openService(service) {

    const url = SERVICE_URLS[service];

    if (!url) {

        showToast(
            "Service URL is not configured"
        );

        return;
    }

    window.open(
        url,
        "_blank"
    );

}

const API_URL = "/api/students";

let students = [];


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function showPage(pageId, button = null) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
    }


    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
    });


    if (button) {
        button.classList.add("active");
    } else {

        document.querySelectorAll(".nav-item").forEach(item => {

            if (item.getAttribute("onclick")?.includes(pageId)) {
                item.classList.add("active");
            }

        });

    }


    const titles = {

        dashboard: [
            "Dashboard",
            "Student management overview"
        ],

        students: [
            "Students",
            "Manage all students"
        ],

        addStudent: [
            "Add Student",
            "Create a new student record"
        ],

        system: [
            "System",
            "Application and infrastructure status"
        ]

    };


    if (titles[pageId]) {

        document.getElementById("pageTitle").textContent =
            titles[pageId][0];

        document.getElementById("pageDescription").textContent =
            titles[pageId][1];

    }


    if (pageId === "students") {
        renderStudents(students);
    }


    if (pageId === "dashboard") {
        renderDashboard();
    }

}


/* =========================================================
   LOAD STUDENTS
========================================================= */

async function loadStudents() {

    try {

        const response = await fetch(API_URL);


        if (!response.ok) {
            throw new Error(
                `API returned ${response.status}`
            );
        }


        students = await response.json();


        renderDashboard();

        renderStudents(students);


        setConnectionStatus(true);


        showToast(
            "Students loaded successfully"
        );


    } catch (error) {

        console.error(error);

        setConnectionStatus(false);

        showToast(
            "Unable to connect to Student API"
        );

    }

}


/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {

    const totalStudents =
        document.getElementById("totalStudents");

    if (totalStudents) {
        totalStudents.textContent =
            students.length;
    }


    const courses =
        new Set(
            students
                .map(student => student.course)
                .filter(course => course)
        );


    const totalCourses =
        document.getElementById("totalCourses");

    if (totalCourses) {
        totalCourses.textContent =
            courses.size;
    }


    const dashboardTable =
        document.getElementById(
            "dashboardStudentTable"
        );


    if (!dashboardTable) {
        return;
    }


    dashboardTable.innerHTML = "";


    const recentStudents =
        students.slice(-5).reverse();


    if (recentStudents.length === 0) {

        dashboardTable.innerHTML = `
            <tr>
                <td colspan="5">
                    No students found
                </td>
            </tr>
        `;

        return;
    }


    recentStudents.forEach(student => {

        dashboardTable.appendChild(
            createStudentRow(student)
        );

    });

}


/* =========================================================
   STUDENT TABLE
========================================================= */

function renderStudents(list) {

    const table =
        document.getElementById("studentTable");


    if (!table) {
        return;
    }


    table.innerHTML = "";


    if (list.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    No students found
                </td>
            </tr>
        `;

        return;
    }


    list.forEach(student => {

        table.appendChild(
            createStudentRow(student)
        );

    });

}


/* =========================================================
   CREATE TABLE ROW
========================================================= */

function createStudentRow(student) {

    const row =
        document.createElement("tr");


    row.innerHTML = `

        <td>${escapeHtml(student.id)}</td>

        <td>${escapeHtml(student.name)}</td>

        <td>${escapeHtml(student.email)}</td>

        <td>${escapeHtml(student.course)}</td>

        <td>

            <button
                class="action-btn edit-btn"
                onclick="openEditModal(${student.id})">

                Edit

            </button>


            <button
                class="action-btn delete-btn"
                onclick="deleteStudent(${student.id})">

                Delete

            </button>


            <button
                class="action-btn document-btn"
                onclick="uploadDocument(${student.id})">

                Document

            </button>

        </td>

    `;


    return row;

}


/* =========================================================
   ADD STUDENT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadStudents();


        const form =
            document.getElementById(
                "studentForm"
            );


        if (form) {

            form.addEventListener(
                "submit",
                createStudent
            );

        }


        const editForm =
            document.getElementById(
                "editForm"
            );


        if (editForm) {

            editForm.addEventListener(
                "submit",
                updateStudent
            );

        }


        checkApiStatus();

    }
);


async function createStudent(event) {

    event.preventDefault();


    const student = {

        name:
            document.getElementById(
                "name"
            ).value.trim(),

        email:
            document.getElementById(
                "email"
            ).value.trim(),

        course:
            document.getElementById(
                "course"
            ).value.trim()

    };


    try {

        const response =
            await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(student)

            });


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(errorText);

        }


        const created =
            await response.json();


        students.push(created);


        document
            .getElementById("studentForm")
            .reset();


        showToast(
            "Student created successfully"
        );


        renderDashboard();


        showPage("students");


        renderStudents(students);


    } catch (error) {

        console.error(error);

        showToast(
            "Failed to create student"
        );

    }

}


/* =========================================================
   EDIT STUDENT
========================================================= */

function openEditModal(id) {

    const student =
        students.find(
            item => Number(item.id) === Number(id)
        );


    if (!student) {

        showToast(
            "Student not found"
        );

        return;
    }


    document.getElementById(
        "editId"
    ).value = student.id;


    document.getElementById(
        "editName"
    ).value = student.name || "";


    document.getElementById(
        "editEmail"
    ).value = student.email || "";


    document.getElementById(
        "editCourse"
    ).value = student.course || "";


    document
        .getElementById("editModal")
        .classList.add("show");

}


function closeModal() {

    document
        .getElementById("editModal")
        .classList.remove("show");

}


async function updateStudent(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "editId"
        ).value;


    const student = {

        name:
            document.getElementById(
                "editName"
            ).value.trim(),

        email:
            document.getElementById(
                "editEmail"
            ).value.trim(),

        course:
            document.getElementById(
                "editCourse"
            ).value.trim()

    };


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(student)

                }
            );


        if (!response.ok) {
            throw new Error(
                `Update failed: ${response.status}`
            );
        }


        const updated =
            await response.json();


        const index =
            students.findIndex(
                item =>
                    Number(item.id) === Number(id)
            );


        if (index !== -1) {
            students[index] = updated;
        }


        closeModal();


        renderStudents(students);

        renderDashboard();


        showToast(
            "Student updated successfully"
        );


    } catch (error) {

        console.error(error);

        showToast(
            "Failed to update student"
        );

    }

}


/* =========================================================
   DELETE STUDENT
========================================================= */

async function deleteStudent(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this student?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {
            throw new Error(
                `Delete failed: ${response.status}`
            );
        }


        students =
            students.filter(
                student =>
                    Number(student.id) !== Number(id)
            );


        renderStudents(students);

        renderDashboard();


        showToast(
            "Student deleted successfully"
        );


    } catch (error) {

        console.error(error);

        showToast(
            "Failed to delete student"
        );

    }

}


/* =========================================================
   SEARCH
========================================================= */

function searchStudents() {

    const input =
        document.getElementById(
            "searchInput"
        );


    const search =
        input.value
            .toLowerCase()
            .trim();


    const filtered =
        students.filter(student => {

            const name =
                String(student.name || "")
                    .toLowerCase();

            const email =
                String(student.email || "")
                    .toLowerCase();

            const course =
                String(student.course || "")
                    .toLowerCase();


            return (
                name.includes(search) ||
                email.includes(search) ||
                course.includes(search)
            );

        });


    renderStudents(filtered);

}


/* =========================================================
   MINIO DOCUMENT UPLOAD
========================================================= */

async function uploadDocument(id) {

    const input =
        document.createElement("input");


    input.type = "file";


    input.accept = "*/*";


    input.onchange =
        async function () {

            if (!input.files.length) {
                return;
            }


            const file =
                input.files[0];


            const formData =
                new FormData();


            formData.append(
                "file",
                file
            );


            try {

                const response =
                    await fetch(
                        `${API_URL}/${id}/document`,
                        {

                            method: "POST",

                            body: formData

                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        `Upload failed: ${response.status}`
                    );

                }


                const result =
                    await response.json();


                console.log(result);


                showToast(
                    "Document uploaded to MinIO"
                );


            } catch (error) {

                console.error(error);

                showToast(
                    "Document upload failed"
                );

            }

        };


    input.click();

}


/* =========================================================
   API STATUS
========================================================= */

async function checkApiStatus() {

    const status =
        document.getElementById(
            "apiStatus"
        );


    if (!status) {
        return;
    }


    try {

        const response =
            await fetch(
                "/actuator/health"
            );


        if (response.ok) {

            status.textContent =
                "Spring Boot API is running";

        } else {

            status.textContent =
                "API returned an error";

        }


    } catch (error) {

        status.textContent =
            "API unavailable";

    }

}


/* =========================================================
   CONNECTION STATUS
========================================================= */

function setConnectionStatus(connected) {

    const connection =
        document.querySelector(
            ".connection"
        );


    if (!connection) {
        return;
    }


    if (connected) {

        connection.innerHTML = `
            <span class="status-dot"></span>
            API Connected
        `;

    } else {

        connection.innerHTML = `
            <span
                class="status-dot"
                style="background:#ef4444">
            </span>
            API Disconnected
        `;

    }

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) {
        return;
    }


    toast.textContent = message;


    toast.classList.add("show");


    setTimeout(
        function () {

            toast.classList.remove(
                "show"
            );

        },
        3000
    );

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHtml(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
