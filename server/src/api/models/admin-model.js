import { db } from "../../config/db.js";

const pingDatabase = async () => {
  await db.raw("SELECT 1");
};

export default { pingDatabase };
