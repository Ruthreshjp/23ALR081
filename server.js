const express = require("express");
const cors = require("cors");
const fs = require("fs");

const Log = require("./logger");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Notification System Running");
});

app.post("/notifications", (req, res) => {

    try {

        const {
            userId,
            title,
            message,
            type
        } = req.body;

        const newNotification = {
            id: Date.now(),
            userId,
            title,
            message,
            type,
            isRead: false,
            createdAt: new Date()
        };

        let data = [];

        if (fs.existsSync("notifications.json")) {
            const fileData = fs.readFileSync("notifications.json");
            data = JSON.parse(fileData);
        }

        data.push(newNotification);

        fs.writeFileSync(
            "notifications.json",
            JSON.stringify(data, null, 2)
        );

        Log(
            "backend",
            "info",
            "handler",
            "notification created"
        );

        res.status(201).json({
            message: "Notification Added",
            data: newNotification
        });

    } catch (error) {

        Log(
            "backend",
            "error",
            "handler",
            "failed to create notification"
        );

        res.status(500).json({
            message: "Server Error"
        });
    }
});

app.get("/notifications/:userId", (req, res) => {

    try {

        const fileData = fs.readFileSync("notifications.json");

        const data = JSON.parse(fileData);

        const result = data.filter(
            item => item.userId == req.params.userId
        );

        Log(
            "backend",
            "info",
            "route",
            "notifications fetched"
        );

        res.json(result);

    } catch (error) {

        Log(
            "backend",
            "error",
            "route",
            "fetch failed"
        );

        res.status(500).json({
            message: "Error fetching notifications"
        });
    }
});
app.patch("/notifications/:id", (req, res) => {

    try {

        const fileData = fs.readFileSync("notifications.json");

        const data = JSON.parse(fileData);

        const updatedData = data.map(item => {

            if (item.id == req.params.id) {
                item.isRead = true;
            }

            return item;
        });

        fs.writeFileSync(
            "notifications.json",
            JSON.stringify(updatedData, null, 2)
        );

        Log(
            "backend",
            "info",
            "db",
            "notification updated"
        );

        res.json({
            message: "Notification marked as read"
        });

    } catch (error) {

        Log(
            "backend",
            "error",
            "db",
            "update failed"
        );

        res.status(500).json({
            message: "Update failed"
        });
    }
});

app.listen(5000, () => {
    console.log("Server Running on Port 5000");
});
