const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const { User } = require("../Model/userModel");

async function createEmployees() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected.");

        const employeesData = [
            {
                fullName: "Employee Alpha",
                email: "alpha@example.com",
                passwordHash: "dummyhash1",
                role: "employee",
            },
            {
                fullName: "Employee Beta",
                email: "beta@example.com",
                passwordHash: "dummyhash2",
                role: "employee",
            },
            {
                fullName: "Employee Gamma",
                email: "gamma@example.com",
                passwordHash: "dummyhash3",
                role: "employee",
            },
        ];

        const results = [];

        for (const data of employeesData) {
            let user = await User.findOne({ email: data.email });
            if (!user) {
                user = new User(data);
                await user.save();
                console.log(`Created employee: ${data.fullName}`);
            } else {
                console.log(`Employee already exists: ${data.fullName}`);
            }
            results.push({ name: user.fullName, id: user._id });
        }

        console.log("\n--- Employee IDs ---");
        results.forEach(emp => {
            console.log(`${emp.name}: ${emp.id}`);
        });
        console.log("--------------------\n");

    } catch (err) {
        console.error("Error creating employees:", err);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected.");
    }
}

createEmployees();
