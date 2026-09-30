const express = require("express");
const path = require("path");

const db = require("./db");

const app = express();

const PORT = 3000;


// =========================================
// MIDDLEWARE
// =========================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// =========================================
// GET ALL SERVICE RECORDS
// =========================================

app.get("/api/services", async (req, res) => {

    try {

        const [rows] = await db.query(`
            SELECT *
            FROM service_records
            ORDER BY id ASC
        `);

        res.json(rows);

    } catch (error) {

        console.error("GET ERROR:", error);

        res.status(500).json({

            error:
                "Failed to load service records"

        });

    }

});


// =========================================
// ADD SERVICE RECORD
// =========================================

app.post("/api/services", async (req, res) => {

    try {

        const {

            customer_name,

            phone_number,

            email_id,

            vehicle_number,

            vehicle_brand,

            vehicle_model,

            service_type,

            service_date,

            service_status

        } = req.body;


        // VALIDATION

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

            return res.status(400).json({

                error:
                    "Please fill all fields"

            });

        }


        // PHONE VALIDATION

        if (!/^[0-9]{10}$/.test(phone_number)) {

            return res.status(400).json({

                error:
                    "Phone number must contain 10 digits"

            });

        }


        // INSERT

        const [result] = await db.query(

            `
            INSERT INTO service_records
            (
                customer_name,
                phone_number,
                email_id,
                vehicle_number,
                vehicle_brand,
                vehicle_model,
                service_type,
                service_date,
                service_status
            )

            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,

            [

                customer_name,

                phone_number,

                email_id,

                vehicle_number,

                vehicle_brand,

                vehicle_model,

                service_type,

                service_date,

                service_status

            ]

        );


        res.status(201).json({

            message:
                "Service record added successfully",

            id:
                result.insertId

        });


    } catch (error) {

        console.error("POST ERROR:", error);

        res.status(500).json({

            error:
                "Failed to add service record"

        });

    }

});


// =========================================
// UPDATE SERVICE RECORD
// =========================================

app.put("/api/services/:id", async (req, res) => {

    try {

        const { id } = req.params;


        const {

            customer_name,

            phone_number,

            email_id,

            vehicle_number,

            vehicle_brand,

            vehicle_model,

            service_type,

            service_date,

            service_status

        } = req.body;


        // VALIDATION

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

            return res.status(400).json({

                error:
                    "Please fill all fields"

            });

        }


        if (!/^[0-9]{10}$/.test(phone_number)) {

            return res.status(400).json({

                error:
                    "Phone number must contain 10 digits"

            });

        }


        // UPDATE

        const [result] = await db.query(

            `
            UPDATE service_records

            SET

                customer_name = ?,

                phone_number = ?,

                email_id = ?,

                vehicle_number = ?,

                vehicle_brand = ?,

                vehicle_model = ?,

                service_type = ?,

                service_date = ?,

                service_status = ?

            WHERE id = ?
            `,

            [

                customer_name,

                phone_number,

                email_id,

                vehicle_number,

                vehicle_brand,

                vehicle_model,

                service_type,

                service_date,

                service_status,

                id

            ]

        );


        if (result.affectedRows === 0) {

            return res.status(404).json({

                error:
                    "Service record not found"

            });

        }


        res.json({

            message:
                "Service record updated successfully"

        });


    } catch (error) {

        console.error("PUT ERROR:", error);

        res.status(500).json({

            error:
                "Failed to update service record"

        });

    }

});


// =========================================
// DELETE SERVICE RECORD
// =========================================

app.delete("/api/services/:id", async (req, res) => {

    try {

        const { id } = req.params;


        const [result] = await db.query(

            `
            DELETE FROM service_records
            WHERE id = ?
            `,

            [id]

        );


        if (result.affectedRows === 0) {

            return res.status(404).json({

                error:
                    "Service record not found"

            });

        }


        res.json({

            message:
                "Service record deleted successfully"

        });


    } catch (error) {

        console.error("DELETE ERROR:", error);

        res.status(500).json({

            error:
                "Failed to delete service record"

        });

    }

});


// =========================================
// START SERVER
// =========================================

app.listen(PORT, () => {

    console.log(
        
        `ready to go
        Server running at http://localhost:${PORT}`
    );

});