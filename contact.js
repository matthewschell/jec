export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    // Parse the incoming multipart form data
    const formData = await request.formData();
    const token = formData.get('cf-turnstile-response');
    const ip = request.headers.get('CF-Connecting-IP');

    // 1. Validate the Turnstile Token with Cloudflare
    let turnstileFormData = new FormData();
    turnstileFormData.append('secret', env.TURNSTILE_SECRET_KEY);
    turnstileFormData.append('response', token);
    turnstileFormData.append('remoteip', ip);

    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      body: turnstileFormData,
      method: 'POST',
    });

    const outcome = await result.json();
    if (!outcome.success) {
      return new Response(JSON.stringify({ error: 'Security check failed. Please try again.' }), { status: 400 });
    }

    // 2. Extract Form Fields
    const name = formData.get('name') || 'Not provided';
    const email = formData.get('email') || 'Not provided';
    const phone = formData.get('phone') || 'Not provided';
    const location = formData.get('location') || 'Not provided';
    const service = formData.get('service') || 'Not provided';
    const message = formData.get('message') || 'No message provided';
    const attachment = formData.get('attachment');

    // 3. Process the Image Attachment (if provided)
    let attachments = [];
    if (attachment && attachment.size > 0) {
      const buffer = await attachment.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      
      attachments.push({
        filename: attachment.name,
        content: btoa(binary), 
      });
    }

    // 4. Send the Email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Website Lead <website@jecgroup.ca>', 
        to: 'matthew.schell@gmail.com', 
        bcc: 'jectestemail@gmail.com',
        reply_to: email, 
        
        // DYNAMIC SUBJECT LINE: Guarantees emails won't thread together
        subject: `New Lead: ${name} - ${service} in ${location}`,
        
        // PROFESSIONALLY STYLED HTML TEMPLATE
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
            
            <!-- Header -->
            <div style="background-color: #333333; padding: 25px 20px; text-align: center; border-bottom: 5px solid #FBC02D;">
              <h2 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">NEW WEBSITE LEAD</h2>
            </div>
            
            <!-- Body -->
            <div style="padding: 30px; background-color: #f9f9f9;">
              
              <h3 style="color: #333333; margin-top: 0; border-bottom: 2px solid #eeeeee; padding-bottom: 10px; font-size: 18px;">Contact Details</h3>
              
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; width: 130px; color: #555555;">Name:</td>
                  <td style="padding: 10px 0; color: #222222; font-size: 16px;">${name}</td>
                </tr>
                <tr style="border-top: 1px solid #eeeeee;">
                  <td style="padding: 10px 0; font-weight: bold; color: #555555;">Email:</td>
                  <td style="padding: 10px 0;">
                    <a href="mailto:${email}" style="color: #d49a1c; text-decoration: none; font-weight: bold; font-size: 16px;">${email}</a>
                  </td>
                </tr>
                <tr style="border-top: 1px solid #eeeeee;">
                  <td style="padding: 10px 0; font-weight: bold; color: #555555;">Phone:</td>
                  <td style="padding: 10px 0; color: #222222; font-size: 16px;">
                    <a href="tel:${phone}" style="color: #222222; text-decoration: none;">${phone}</a>
                  </td>
                </tr>
                <tr style="border-top: 1px solid #eeeeee;">
                  <td style="padding: 10px 0; font-weight: bold; color: #555555;">City:</td>
                  <td style="padding: 10px 0; color: #222222; font-size: 16px;">${location}</td>
                </tr>
                <tr style="border-top: 1px solid #eeeeee;">
                  <td style="padding: 10px 0; font-weight: bold; color: #555555;">Service:</td>
                  <td style="padding: 10px 0; color: #222222; font-size: 16px;">${service}</td>
                </tr>
              </table>
              
              <h3 style="color: #333333; margin-top: 30px; border-bottom: 2px solid #eeeeee; padding-bottom: 10px; font-size: 18px;">Message</h3>
              
              <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 6px; color: #444444; line-height: 1.6; font-size: 15px; white-space: pre-wrap;">${message}</div>
              
            </div>
            
            <!-- Footer -->
            <div style="background-color: #eeeeee; padding: 15px; text-align: center; font-size: 12px; color: #888888;">
              <p style="margin: 0;">This email was securely routed via your website's contact form.</p>
              ${attachments.length > 0 ? `<p style="margin: 5px 0 0 0; color: #28a745; font-weight: bold;">&#128206; A photo was attached to this lead.</p>` : ''}
            </div>
            
          </div>
        `,
        attachments: attachments
      }),
    });

    if (emailResponse.ok) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: 'Failed to route email to office.' }), { status: 500 });
    }

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}