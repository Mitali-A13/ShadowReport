import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// ------------------ GET REPORT BY ID ------------------
export async function GET(
  request: Request,
  context: { params: Promise<{ reportId: string }> }
) {
  try {
    const { reportId } = await context.params;

    const report = await prisma.report.findUnique({
      where: { reportId },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json(
      { error: "Error fetching report" },
      { status: 500 }
    );
  }
}

// ------------------ UPDATE REPORT STATUS ------------------
export async function PATCH(
  request: Request,
  context: { params: Promise<{ reportId: string }> }
) {
  try {
    const { reportId } = await context.params;
    const { status } = await request.json();

    const report = await prisma.report.update({
      where: { reportId },
      data: { status },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error updating report:", error);
    return NextResponse.json(
      { error: "Error updating report" },
      { status: 500 }
    );
  }
}
