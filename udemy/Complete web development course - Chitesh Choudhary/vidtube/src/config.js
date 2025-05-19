import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filepath = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filepath);
dotenv.config({ path: path.join(__dirname, "./.env") });
