import { NextRequest, NextResponse } from 'next/server';
import { PortfolioCatalogService } from '@/services/portfolio-catalog.service';
import { generateCorrelationId } from '@/domain/events';

const portfolioService = new PortfolioCatalogService();

export async function POST(request: NextRequest) {
  const correlationId =
    request.headers.get('x-correlation-id') || generateCorrelationId();

  try {
    const body = await request.json();
    const inquiry = await portfolioService.submitCommissionInquiry(
      body,
      correlationId
    );

    return NextResponse.json(
      {
        success: true,
        inquiry,
        correlationId,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Invalid request payload';

    // If it's a validation error
    if (
      message.includes('mandatory') ||
      message.includes('required') ||
      message.includes('Phone number') ||
      message.includes('Item type') ||
      message.includes('Iconography') ||
      message.includes('Dimensions') ||
      message.includes('Finish preference') ||
      message.includes('Target date')
    ) {
      return NextResponse.json(
        {
          error: message,
          correlationId,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        correlationId,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { error: 'Commission code parameter (?code=COM-XXXX) is required' },
      { status: 400 }
    );
  }

  const inquiry = await portfolioService.getCommissionInquiryByCode(code);
  if (!inquiry) {
    return NextResponse.json(
      { error: `Commission inquiry with code ${code} not found` },
      { status: 404 }
    );
  }

  return NextResponse.json({ inquiry }, { status: 200 });
}
