// ZOMBIE: "Email me this list" is not built. It needs an email service (Resend, Postmark...),
// and any email you send must follow the CAN-SPAM Act (see ZOMBIE.md).
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Not built yet: emailing the grocery list." }, { status: 501 });
}
