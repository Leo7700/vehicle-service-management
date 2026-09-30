// =====================================
// GLOBAL
// =====================================

let editingId = null;


// =====================================
// VEHICLE MODELS
// =====================================

const vehicleModels = {

    "Royal Enfield": [
        "Classic 350",
        "Classic 650",
        "Hunter 350",
        "Bullet 350",
        "Meteor 350",
        "Himalayan 450",
        "Interceptor 650",
        "Continental GT 650"
    ],

    "Honda": [
        "Activa 6G",
        "Shine",
        "SP 125",
        "Hornet 2.0",
        "CB350",
        "CB200X"
    ],

    "Yamaha": [
        "R15",
        "MT-15",
        "FZ",
        "FZS",
        "Aerox 155"
    ],

    "TVS": [
        "Apache RTR 160",
        "Apache RTR 200",
        "Raider 125",
        "Jupiter",
        "Ntorq 125"
    ],

    "Bajaj": [
        "Pulsar 125",
        "Pulsar 150",
        "Pulsar NS200",
        "Dominar 400",
        "Avenger 160"
    ],

    "Hero": [
        "Splendor Plus",
        "HF Deluxe",
        "Xtreme 125R",
        "Xtreme 160R",
        "Karizma XMR"
    ],

    "KTM": [
        "Duke 125",
        "Duke 200",
        "Duke 250",
        "Duke 390",
        "RC 200",
        "RC 390"
    ],

    "Suzuki": [
        "Access 125",
        "Burgman Street",
        "Gixxer",
        "Gixxer SF"
    ]

};


// =====================================
// UPDATE VEHICLE MODELS
// =====================================

function updateModels(selectedModel = "") {

    const brand =
        document.getElementById(
            "vehicle_brand"
        ).value;


    const modelSelect =
        document.getElementById(
            "vehicle_model"
        );


    modelSelect.innerHTML = `

        <option value="">
            Select Vehicle Model
        </option>

    `;


    if (!brand) {

        modelSelect.disabled = true;

        return;

    }


    modelSelect.disabled = false;


    vehicleModels[brand].forEach(model => {

        const option =
            document.createElement("option");


        option.value = model;

        option.textContent = model;


        if (model === selectedModel) {

            option.selected = true;

        }


        modelSelect.appendChild(option);

    });

}


// =====================================
// LOAD SERVICES
// =====================================

async function loadServices() {

    try {

        const response =
            await fetch(
                "/api/services"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load records"
            );

        }


        const services =
            await response.json();


        // =================================
        // DASHBOARD
        // =================================

        document
            .getElementById(
                "totalCount"
            )
            .textContent =
            services.length;


        document
            .getElementById(
                "pendingCount"
            )
            .textContent =
            services.filter(
                service =>
                    service.service_status ===
                    "Pending"
            ).length;


        document
            .getElementById(
                "progressCount"
            )
            .textContent =
            services.filter(
                service =>
                    service.service_status ===
                    "In Progress"
            ).length;


        document
            .getElementById(
                "completedCount"
            )
            .textContent =
            services.filter(
                service =>
                    service.service_status ===
                    "Completed"
            ).length;


        // =================================
        // TABLE
        // =================================

        const table =
            document.getElementById(
                "serviceTable"
            );


        table.innerHTML = "";


        services.forEach(
            (service, index) => {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${escapeHtml(
                            service.customer_name
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            service.phone_number
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            service.email_id
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            service.vehicle_number
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            service.vehicle_brand
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            service.vehicle_model
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            service.service_type
                        )}
                    </td>

                    <td>
                        ${formatDate(
                            service.service_date
                        )}
                    </td>

                    <td class="status">
                        ${escapeHtml(
                            service.service_status
                        )}
                    </td>

                    <td>

                        <button
                            class="edit-btn"
                            onclick="editService(
                                ${service.id},
                                '${escapeQuotes(
                                    service.customer_name
                                )}',
                                '${escapeQuotes(
                                    service.phone_number
                                )}',
                                '${escapeQuotes(
                                    service.email_id
                                )}',
                                '${escapeQuotes(
                                    service.vehicle_number
                                )}',
                                '${escapeQuotes(
                                    service.vehicle_brand
                                )}',
                                '${escapeQuotes(
                                    service.vehicle_model
                                )}',
                                '${escapeQuotes(
                                    service.service_type
                                )}',
                                '${formatDateForInput(
                                    service.service_date
                                )}',
                                '${escapeQuotes(
                                    service.service_status
                                )}'
                            )"
                        >
                            Edit
                        </button>


                        <button
                            class="delete-btn"
                            onclick="deleteService(
                                ${service.id}
                            )"
                        >
                            Delete
                        </button>

                    </td>

                `;


                table.appendChild(row);

            }
        );


    } catch (error) {

        console.error(
            "LOAD ERROR:",
            error
        );


        showMessage(
            error.message,
            "red"
        );

    }

}


// =====================================
// FORM SUBMIT
// =====================================

document
    .getElementById(
        "serviceForm"
    )
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            // =================================
            // GET VALUES
            // =================================

            const customer_name =
                document
                    .getElementById(
                        "customer_name"
                    )
                    .value
                    .trim();


            const phone_number =
                document
                    .getElementById(
                        "phone_number"
                    )
                    .value
                    .trim();


            const email_id =
                document
                    .getElementById(
                        "email_id"
                    )
                    .value
                    .trim();


            const vehicle_number =
                document
                    .getElementById(
                        "vehicle_number"
                    )
                    .value
                    .trim()
                    .toUpperCase();


            const vehicle_brand =
                document
                    .getElementById(
                        "vehicle_brand"
                    )
                    .value;


            const vehicle_model =
                document
                    .getElementById(
                        "vehicle_model"
                    )
                    .value;


            const service_type =
                document
                    .getElementById(
                        "service_type"
                    )
                    .value;


            const service_date =
                document
                    .getElementById(
                        "service_date"
                    )
                    .value;


            const service_status =
                document
                    .getElementById(
                        "service_status"
                    )
                    .value;


            // =================================
            // VALIDATION
            // =================================

            if (

                !customer_name ||

                !phone_number ||

                !email_id ||

                !vehicle_number ||

                !vehicle_brand ||

                !vehicle_model ||

                !service_type ||

                !service_date ||

                !service_status

            ) {

                showMessage(
                    "Please fill all fields",
                    "red"
                );

                return;

            }


            // PHONE VALIDATION

            if (
                !/^[0-9]{10}$/.test(
                    phone_number
                )
            ) {

                showMessage(
                    "Phone number must contain 10 digits",
                    "red"
                );

                return;

            }


            // =================================
            // DATA OBJECT
            // =================================

            const data = {

                customer_name,

                phone_number,

                email_id,

                vehicle_number,

                vehicle_brand,

                vehicle_model,

                service_type,

                service_date,

                service_status

            };


            try {


                // =================================
                // UPDATE
                // =================================

                if (
                    editingId !== null
                ) {

                    const response =
                        await fetch(
                            `/api/services/${editingId}`,
                            {

                                method: "PUT",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify(
                                        data
                                    )

                            }
                        );


                    const result =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            result.error
                        );

                    }


                    showMessage(
                        result.message,
                        "green"
                    );


                    cancelEdit();


                    await loadServices();

                }


                // =================================
                // ADD
                // =================================

                else {

                    const response =
                        await fetch(
                            "/api/services",
                            {

                                method: "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify(
                                        data
                                    )

                            }
                        );


                    const result =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            result.error
                        );

                    }


                    showMessage(
                        result.message,
                        "green"
                    );


                    document
                        .getElementById(
                            "serviceForm"
                        )
                        .reset();


                    resetModelDropdown();


                    await loadServices();

                }


            } catch (error) {

                console.error(
                    "SUBMIT ERROR:",
                    error
                );


                showMessage(

                    error.message ||
                    "Something went wrong",

                    "red"

                );

            }

        }
    );


// =====================================
// EDIT SERVICE
// =====================================

function editService(

    id,

    customer_name,

    phone_number,

    email_id,

    vehicle_number,

    vehicle_brand,

    vehicle_model,

    service_type,

    service_date,

    service_status

) {

    editingId = id;


    document
        .getElementById(
            "customer_name"
        )
        .value =
        customer_name;


    document
        .getElementById(
            "phone_number"
        )
        .value =
        phone_number;


    document
        .getElementById(
            "email_id"
        )
        .value =
        email_id;


    document
        .getElementById(
            "vehicle_number"
        )
        .value =
        vehicle_number;


    document
        .getElementById(
            "vehicle_brand"
        )
        .value =
        vehicle_brand;


    updateModels(
        vehicle_model
    );


    document
        .getElementById(
            "service_type"
        )
        .value =
        service_type;


    document
        .getElementById(
            "service_date"
        )
        .value =
        service_date;


    document
        .getElementById(
            "service_status"
        )
        .value =
        service_status;


    document
        .getElementById(
            "formTitle"
        )
        .textContent =
        "Update Service Record";


    const button =
        document.getElementById(
            "submitButton"
        );


    button.textContent =
        "Update Service";


    button.className =
        "update-btn";


    document
        .getElementById(
            "cancelButton"
        )
        .style.display =
        "inline-block";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// =====================================
// CANCEL EDIT
// =====================================

function cancelEdit() {

    editingId = null;


    document
        .getElementById(
            "serviceForm"
        )
        .reset();


    document
        .getElementById(
            "formTitle"
        )
        .textContent =
        "Add Service Record";


    document
        .getElementById(
            "submitButton"
        )
        .textContent =
        "+ Add Service";


    document
        .getElementById(
            "submitButton"
        )
        .className =
        "add-btn";


    document
        .getElementById(
            "cancelButton"
        )
        .style.display =
        "none";


    resetModelDropdown();

}


// =====================================
// RESET MODEL DROPDOWN
// =====================================

function resetModelDropdown() {

    const modelSelect =
        document.getElementById(
            "vehicle_model"
        );


    modelSelect.innerHTML = `

        <option value="">
            Select Vehicle Model
        </option>

    `;


    modelSelect.disabled = true;

}


// =====================================
// DELETE SERVICE
// =====================================

async function deleteService(id) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this service record?"
        );


    if (!confirmation) {

        return;

    }


    try {

        const response =
            await fetch(
                `/api/services/${id}`,
                {

                    method: "DELETE"

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error
            );

        }


        showMessage(
            result.message,
            "green"
        );


        await loadServices();


    } catch (error) {

        console.error(
            "DELETE ERROR:",
            error
        );


        showMessage(

            error.message ||
            "Failed to delete record",

            "red"

        );

    }

}


// =====================================
// SHOW MESSAGE
// =====================================

function showMessage(
    message,
    color
) {

    const messageBox =
        document.getElementById(
            "message"
        );


    messageBox.textContent =
        message;


    messageBox.style.color =
        color;


    setTimeout(() => {

        messageBox.textContent = "";

    }, 3000);

}


// =====================================
// ESCAPE HTML
// =====================================

function escapeHtml(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


// =====================================
// ESCAPE QUOTES
// =====================================

function escapeQuotes(value) {

    return String(value)

        .replace(
            /\\/g,
            "\\\\"
        )

        .replace(
            /'/g,
            "\\'"
        )

        .replace(
            /\r?\n/g,
            "\\n"
        );

}


// =====================================
// DATE FORMAT
// =====================================

function formatDate(date) {

    if (!date) {

        return "";

    }


    if (

        typeof date === "string" &&

        date.length >= 10

    ) {

        return date.substring(
            0,
            10
        );

    }


    const d =
        new Date(date);


    if (isNaN(d)) {

        return String(date);

    }


    return d
        .toISOString()
        .split("T")[0];

}


// =====================================
// DATE FOR INPUT
// =====================================

function formatDateForInput(date) {

    return formatDate(date);

}


// =====================================
// INITIAL LOAD
// =====================================

loadServices();