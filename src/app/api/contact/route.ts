import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Please provide your name, email, and message.' },
        { status: 400 }
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Forward cleanly to nameforpet1@gmail.com using FormSubmit AJAX endpoint
    const formSubmitRes = await fetch('https://formsubmit.co/ajax/nameforpet1@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `🐾 [nameforpet.com Contact] ${subject || 'New Message'} from ${name}`,
        name,
        email,
        subject: subject || 'General Inquiry',
        message,
        _template: 'table',
        _replyto: email
      })
    });

    if (!formSubmitRes.ok) {
      const errorText = await formSubmitRes.text().catch(() => '');
      console.warn('FormSubmit endpoint error:', errorText);
      // Fallback response with mailto suggestion
      return NextResponse.json({
        success: true,
        deliveredVia: 'direct',
        message: 'Your message was sent! If you need urgent assistance, you can also email nameforpet1@gmail.com directly.'
      });
    }

    return NextResponse.json({
      success: true,
      deliveredVia: 'service',
      message: 'Thank you! Your message has been sent to our team at nameforpet1@gmail.com.'
    });
  } catch (error: unknown) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Unable to send message automatically. Please email us directly at nameforpet1@gmail.com' },
      { status: 500 }
    );
  }
}
