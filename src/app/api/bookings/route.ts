import { google } from "googleapis";
import { NextResponse } from "next/server";

type BookingPayload = {
  name: string;
  phone: string;
  email: string;
  vehicleType: string;
  serviceGroup: string;
  serviceType: string;
  bookingMode: "solutions" | "onsite" | "pickup-drop";
  isPremiumVehicle: boolean;
  closedAreaAvailable: boolean;
  waterAvailable: boolean;
  electricAvailable: boolean;
  pickupAddress: string;
  preferredDate: string;
  designBrief: string;
  sourceUrl?: string;
};

const DEFAULT_SPREADSHEET_ID = "1acmcmRIhAUD21bX8hRnS6Nc0kkDsbg2xCkkdhL8wY0c";
const DEFAULT_WORKSHEET = "bookings";

function normalizePrivateKey(key: string) {
  return key.replace(/\\n/g, "\n");
}

function requireEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function isValidPayload(body: unknown): body is BookingPayload {
  if (!body || typeof body !== "object") return false;
  const booking = body as Partial<BookingPayload>;
  return Boolean(
    booking.name &&
      booking.phone &&
      booking.serviceGroup &&
      booking.serviceType &&
      booking.bookingMode &&
      booking.designBrief,
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!isValidPayload(body)) {
      return NextResponse.json({ error: "Invalid booking payload." }, { status: 400 });
    }

    const clientEmail = requireEnv(
      "GOOGLE_SHEETS_CLIENT_EMAIL",
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    );
    const privateKey = requireEnv(
      "GOOGLE_SHEETS_PRIVATE_KEY",
      process.env.GOOGLE_SHEETS_PRIVATE_KEY,
    );
    const spreadsheetId =
      process.env.GOOGLE_SHEETS_SPREADSHEET_ID ?? DEFAULT_SPREADSHEET_ID;
    const worksheetName = process.env.GOOGLE_SHEETS_WORKSHEET_NAME ?? DEFAULT_WORKSHEET;

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: normalizePrivateKey(privateKey),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const now = new Date().toISOString();
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");

    const row = [
      now,
      body.name,
      body.phone,
      body.email || "",
      body.vehicleType || "",
      body.serviceGroup,
      body.serviceType,
      body.bookingMode,
      body.isPremiumVehicle ? "yes" : "no",
      body.closedAreaAvailable ? "yes" : "no",
      body.waterAvailable ? "yes" : "no",
      body.electricAvailable ? "yes" : "no",
      body.pickupAddress || "",
      body.preferredDate || "",
      body.designBrief,
      body.sourceUrl || referer || origin || "",
    ];

    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${worksheetName}!A:P`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [row],
        },
      });
    } catch (firstError) {
      const message = firstError instanceof Error ? firstError.message : "";
      if (!message.toLowerCase().includes("unable to parse range")) {
        throw firstError;
      }
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "A:P",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [row],
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Booking sheet append failed:", message);
    return NextResponse.json(
      {
        error: "Unable to submit booking right now. Please use WhatsApp.",
      },
      { status: 500 },
    );
  }
}
