
import { setReport, getReport, cleanupExpiredReports } from "./lib/store/reportStore";
import { randomUUID } from "crypto";

async function test() {
    console.log("Testing reportStore...");
    try {
        const id = randomUUID();
        const metrics: any = { totalMessages: 100, participants: ["A", "B"] };

        console.log("Setting report...");
        await setReport(id, metrics);
        console.log("Report set:", id);

        console.log("Getting report...");
        const fetched = await getReport(id);
        if (!fetched) throw new Error("Failed to fetch report");
        console.log("Report fetched:", fetched.id);

        console.log("Cleaning up...");
        await cleanupExpiredReports();
        console.log("Cleanup done.");

        console.log("SUCCESS");
    } catch (error) {
        console.error("FAILURE:", error);
        process.exit(1);
    }
}

test();
