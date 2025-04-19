import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import Notification from "@/components/test/Notification";

export default async function NotifyPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const payload = jwt.decode(accessToken);

  return (
    <div>
      <Notification userId={payload.id} />
    </div>
  );
}
