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
        to: ['matthew.schell@gmail.com'], // Remember to update this to the office email for production!
        reply_to: email, 
        
        // DYNAMIC SUBJECT LINE: Guarantees emails won't thread together
        subject: `New Lead: ${name} - ${service} in ${location}`,
        
        // PROFESSIONALLY STYLED HTML TEMPLATE (EMAIL SAFE)
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 20px; background-color: #f4f7f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
              
              <tr>
                <td style="background-color: #333333; padding: 25px 20px; text-align: center; border-bottom: 5px solid #FBC02D;">
                  <img src="https://johnstonelectricalcontracting.com/pai/logos/logo.webp" alt="Johnston Electrical Logo" width="60" style="display: block; margin: 0 auto 10px auto;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 1px; text-transform: uppercase;">New Quote Request</h1>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 30px;">
                  
                  <p style="margin: 0 0 20px 0; color: #555555; font-size: 16px;">A new lead has been submitted via the website. Here are the details:</p>
                  
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; border-left: 4px solid #FBC02D; border-radius: 0 4px 4px 0; margin-bottom: 25px;">
                    <tr>
                      <td style="padding: 12px 15px; font-weight: bold; color: #333333; width: 100px; border-bottom: 1px solid #eeeeee;">Name:</td>
                      <td style="padding: 12px 15px; color: #222222; border-bottom: 1px solid #eeeeee;">${name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 15px; font-weight: bold; color: #333333; border-bottom: 1px solid #eeeeee;">Phone:</td>
                      <td style="padding: 12px 15px; border-bottom: 1px solid #eeeeee;">
                        <a href="tel:${phone}" style="color: #222222; text-decoration: none;">${phone}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 15px; font-weight: bold; color: #333333; border-bottom: 1px solid #eeeeee;">Email:</td>
                      <td style="padding: 12px 15px; border-bottom: 1px solid #eeeeee;">
                        <a href="mailto:${email}" style="color: #FBC02D; text-decoration: none; font-weight: bold;">${email}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 15px; font-weight: bold; color: #333333; border-bottom: 1px solid #eeeeee;">City:</td>
                      <td style="padding: 12px 15px; color: #222222; border-bottom: 1px solid #eeeeee;">${location}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 15px; font-weight: bold; color: #333333;">Service:</td>
                      <td style="padding: 12px 15px; color: #222222; font-weight: bold;">${service}</td>
                    </tr>
                  </table>
                  
                  <h2 style="color: #333333; margin: 0 0 10px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Project Description</h2>
                  <div style="background-color: #ffffff; padding: 18px; border: 1px solid #e4e4e4; border-radius: 6px; color: #444444; line-height: 1.6; font-size: 15px; white-space: pre-wrap;">${message}</div>
                  
                </td>
              </tr>
              
              <tr>
                <td style="background-color: #eeeeee; padding: 20px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #dddddd;">
                  <p style="margin: 0;">Sent securely via JohnstonElectricalContracting.com</p>
                  ${attachments.length > 0 ? `<p style="margin: 8px 0 0 0; color: #28a745; font-weight: bold; font-size: 13px;">&#128206; A photo was attached to this lead.</p>` : ''}
                </td>
              </tr>
              
            </table>
            
          </body>
          </html>
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