import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tenantAvailability } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createAvailabilitySlotSchema, deleteAvailabilitySlotSchema } from './types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = createAvailabilitySlotSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { tenantId, workOrderId, startTime, endTime } = validationResult.data;

    if (startTime >= endTime) {
      return NextResponse.json(
        {
          error: 'Invalid time range',
          details: 'Start time must be before end time',
        },
        { status: 400 }
      );
    }

    const result = await db
      .insert(tenantAvailability)
      .values({
        tenantId,
        workOrderId,
        startTime,
        endTime,
      })
      .returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    console.error('Error creating availability slot:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = deleteAvailabilitySlotSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { id } = validationResult.data;

    const result = await db
      .delete(tenantAvailability)
      .where(eq(tenantAvailability.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Availability slot not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    console.error('Error deleting availability slot:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
