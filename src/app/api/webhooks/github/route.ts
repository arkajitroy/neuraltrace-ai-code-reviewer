import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const event = req.headers.get("x-github-event");

    if (event === "ping") {
      return NextResponse.json({ message: "Webhooks Ping", status: 200 });
    }

    //* HANDLE LATER

    return NextResponse.json({ message: "Event processes" }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
