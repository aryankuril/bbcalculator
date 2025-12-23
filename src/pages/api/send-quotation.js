

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, quote, total, serviceCalculator } = req.body;

  console.log('📥 Request body:', req.body);
  console.log('🌟 Type Checks:', {
    emailType: typeof email,
    quoteIsArray: Array.isArray(quote),
    totalType: typeof total,
    serviceCalculatorType: typeof serviceCalculator,
  });

  // Validate inputs
  if (
    typeof email !== 'string' ||
    !Array.isArray(quote) ||
    quote.length === 0 ||
    typeof total !== 'number' ||
    isNaN(total) ||
    typeof serviceCalculator !== 'string'
  ) {
    return res.status(400).json({
      success: false,
      message: 'Missing or invalid email, quote, total, or serviceCalculator',
      received: { email, quote, total, serviceCalculator }
    });
  }

  try {
    const serviceNameTitle = serviceCalculator
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');


    const payload = {
      app_id: process.env.ONESIGNAL_APP_ID,
      include_email_tokens: [email],
      email_subject: `Your ${serviceNameTitle} Quotation From Bombay Blokes`,
      email_body: `
        <!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Bombay Blokes — Onboarding Started</title>
  </head>

  <body style="margin:0; padding:0; background-color:#ffffff; -webkit-font-smoothing:antialiased;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" style="background-color:#ffffff;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" border="0" align="center" style="
            width:600px;
            max-width:600px;
            font-family: 'Miso', 'Poppins', sans-serif;
            color:#222222;
            border: #fab31e 2px solid;
            border-top-left-radius:20px;
            border-top-right-radius:20px;
          ">

            <tr>
              <td background="https://blokesarea.com/wp-content/uploads/2025/12/Email-Background.png"
                style="background-position: top center; background-repeat: no-repeat; background-size: cover; padding:30px 16px 20px 16px;">

                <table width="100%" cellpadding="0" cellspacing="0" border="0">

                   <style type="text/css">
  @font-face {
    font-family: 'Miso';
    font-style: normal;
    font-weight: 400;
    src: url('https://fonts.cdnfonts.com/s/14095/Miso.woff') format('woff');
  }
  @font-face {
    font-family: 'Miso';
    font-style: normal;
    font-weight: 700;
    src: url('https://fonts.cdnfonts.com/s/14095/Miso-Bold.woff') format('woff');
  }

  @font-face {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 400;
    src: url('https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfedA.woff2') format('woff2');
  }
  @font-face {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    src: url('https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6.woff2') format('woff2');
  }
</style>


                  <!-- Heading -->
                   <tr>
  <td style="padding-bottom:10px;">
    <span style="display:block; font-size:34px; line-height:36px; color:#F7B21A; font-weight:700; font-family: 'Miso', Arial, sans-serif;">
      Hey!!
    </span>

    <span style="display:block; font-size:40px; line-height:44px; color:#000000; font-weight:700; letter-spacing:1px; font-family: 'Miso', 'Poppins', sans-serif;">
      Bombay Blokes Here...
    </span>
  </td>
</tr>

                   <!-- dotted separator -->
                  <tr>
                    <td style="padding:6px 0;">
                      <div style="border-top:2px dotted #F4C882; width:100%;"></div>
                    </td>
                  </tr>

                  <!-- Intro -->
                  <tr>
                    <td style="padding-top:14px; padding-bottom:14px;">
                      <p style="margin:0; font-size:14px; color:#333;">
                        <strong>We’re excited to officially get started on your project.</strong><br/>
                        Thanks for confirming. Your journey with us now begins for real.
                      </p>
                    </td>
                  </tr>

                  <!-- dotted separator -->
                  <tr>
                    <td style="padding:6px 0;">
                      <div style="border-top:2px dotted #F4C882; width:100%;"></div>
                    </td>
                  </tr>

                  <!-- Onboarding Summary -->
                  <tr>
                    <td style="padding:8px 0 6px 0;">
                      <h3 style="margin:0; font-size:18px; font-weight:700;">Onboarding Summary</h3>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-top:10px; padding-bottom:10px;">
                      <table width="100%" style="font-size:14px;">
  <tr>
    <td style="padding:6px 0;">
      <span style="display:inline-block; width:4px; height:4px; background:#000; border-radius:50%; margin-right:10px;"></span>
      <strong>Registered Company Name:</strong>
      <span style=" color:#555555 ; text-transform: capitalize;" >${companyName}</span>
    </td>
  </tr>

  <tr>
    <td style="padding:6px 0;">
      <span style="display:inline-block; width:4px; height:4px; background:#000; border-radius:50%; margin-right:10px;"></span>
      <strong>Brand Name:</strong>
      <span style=" color:#555555 ; text-transform: capitalize;" >${brandName || "N/A"}</span>
    </td>
  </tr>

  <tr>
    <td style="padding:6px 0;">
      <span style="display:inline-block; width:4px; height:4px; background:#000; border-radius:50%; margin-right:10px;"></span>
      <strong>Industry:</strong>
      <span style=" color:#555555 ; text-transform: capitalize;" >${industry}</span>
    </td>
  </tr>

  <tr>
    <td style="padding:6px 0;">
      <span style="display:inline-block; width:4px; height:4px; background:#000; border-radius:50%; margin-right:10px;"></span>
      <strong>GSTIN:</strong>
      <span style=" color:#555555 ; text-transform: capitalize;" >${gstin}</span>
    </td>
  </tr>

  <tr>
    <td style="padding:6px 0;">
      <span style="display:inline-block; width:4px; height:4px; background:#000; border-radius:50%; margin-right:10px;"></span>
      <strong>Service Chosen:</strong>
      <span style=" color:#555555 ; text-transform: capitalize;" >   ${formattedServices}</span>
    </td>
  </tr>

  <tr>
    <td style="padding:6px 0;">
      <span style="display:inline-block; width:4px; height:4px; background:#000; border-radius:50%; margin-right:10px;"></span>
      <strong>Contact Person:</strong>
      <span style=" color:#555555 ; text-transform: capitalize;" >${contactPerson || "N/A"}</span>
    </td>
  </tr>

<tr>
 <td style="padding:6px 0; vertical-align:top;">
  <span style="display:inline-block; width:4px; height:4px; background:#000; border-radius:50%; margin-right:10px;"></span>
  <strong>Email:</strong>
  <a style="color:#555555 !important; text-decoration:none !important; margin-left:6px;">
    ${email}
  </a>
</td>
</tr>



  <tr>
    <td style="padding:6px 0;">
      <span style="display:inline-block; width:4px; height:4px; background:#000; border-radius:50%; margin-right:10px;"></span>
      <strong>Phone:</strong>
      <span style=" color:#555555 ; text-transform: capitalize;" >${phone}</span>
    </td>
  </tr>

  <tr>
    <td style="padding:6px 0;">
      <span style="display:inline-block; width:4px; height:4px; background:#000; border-radius:50%; margin-right:10px;"></span>
      <strong>Registered Address:</strong>
      <span style=" color:#555555 ; text-transform: capitalize;" >${address || "N/A"}</span>
    </td>
  </tr>

<tr>
  <td style="padding:6px 0;">
    <span style="display:inline-block; width:4px; height:4px; background:#000; border-radius:50%; margin-right:10px;"></span>
    <strong>Website:</strong>

    <a 
      href="${website || '#'}"
      style="
        color:#555555 !important;
        text-decoration:underline !important;
        font-weight:normal;
      "
      target="_blank"
    >
      ${website || "N/A"}
    </a>
  </td>
</tr>

</table>

                    </td>
                  </tr>

                  <!-- dotted separator -->
                  <tr>
                    <td style="padding:6px 0;">
                      <div style="border-top:2px dotted #F4C882; width:100%;"></div>
                    </td>
                  </tr>


                  <!-- What Happens Next -->
                  <tr>
                     <td style="padding-top:14px; padding-bottom:10px;">
                      <h4 style="font-size:16px; margin:0 0 6px;">What Happens Next?</h4>
                      <table style="font-size:14px;">
                        <tr><td style="padding:6px 0;"> <span style="display:inline-block; width:4px; height:4px; background:#000; border-radius:50%; margin-right:10px;"></span> A dedicated project manager will be assigned</td></tr>
                        <tr><td style="padding:6px 0;"> <span style="display:inline-block; width:4px; height:4px; background:#000; border-radius:50%; margin-right:10px;"></span> You’ll receive a project timeline & milestones</td></tr>
                        <tr><td style="padding:6px 0;"> <span style="display:inline-block; width:4px; height:4px; background:#000; border-radius:50%; margin-right:10px;"></span> Our team will schedule a kickoff call</td></tr>
                      </table>
                    </td>
                  </tr>

                    <!-- dotted separator -->
                  <tr>
                    <td style="padding:6px 0;">
                      <div style="border-top:2px dotted #F4C882; width:100%;"></div>
                    </td>
                  </tr>

                  <!-- Work CTA -->
                  <tr>
                     <td style="padding-top:10px; padding-bottom:10px;">
                      <p style="font-size:14px;">Relevant Work In   ${formattedServices} <br/> Until our kickoff call, you can explore similar projects we’ve executed</p>
                      

                      <table cellpadding="0" cellspacing="0" style="margin-top:6px;">
                        <tr>
                          <td style="background:#F9B31B; padding:0 3px 3px 0; border-radius:5px;">
                            <a href="https://www.bombayblokes.com/work"
                              style="display:block; width:130px; padding:10px 0; text-align:center; background:#000; color:#fff; text-decoration:none; border-radius:5px;">
                              Explore Projects
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                    <!-- dotted separator -->
                  <tr>
                    <td style="padding:6px 0;">
                      <div style="border-top:2px dotted #F4C882; width:100%;"></div>
                    </td>
                  </tr>

                  

                 <!-- contact quick -->
                  <tr>
                    <td style="padding-top:10px; padding-bottom:14px;">
                      <p style="margin:12px 0 6px 0; font-size:14px; color:#222222;"><strong>Need Anything Before the Kickoff? <br/> Reach us anytime:</strong></p>

                      <table cellpadding="0" cellspacing="0" border="0" style="font-size:14px; color:#444444;">
                        <tr>
                          <td style="vertical-align:top; padding-bottom:6px;">
                            <span style="font-size:16px;">📞</span>
                          </td>
                          <td style="padding-left:8px; vertical-align:middle;">
                            <a href="tel:\${phone || '+919819167856'}" style="color:#222222; text-decoration:none;">+91 981-916-7856</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="vertical-align:top; padding-bottom:6px;">
                            <span style="font-size:16px;">✉️</span>
                          </td>
                          <td style="padding-left:8px; vertical-align:middle;">
                            <a href="mailto:\${email || 'hello@bombayblokes.com'}" style="color:#222222; text-decoration:none;">hello@bombayblokes.com</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                    <!-- dotted separator -->
                  <tr>
                    <td style="padding:6px 0;">
                      <div style="border-top:2px dotted #F4C882; width:100%;"></div>
                    </td>
                  </tr>

                  <!-- Footer Text -->
                 <tr>
                    <td style="padding-top:10px;">
                      <p style="font-size:14px;">
                        Welcome to the Bombay Blokes family. Let’s build something unforgettable.
                      </p>
                      <p style="font-size:14px;">
                        Cheers,<br/>Team Bombay Blokes<br/>
                        🌐 <a href="https://bombayblokes.com" style="color:#222222 !important; " >bombayblokes.com</a>
                      </p>
                       
                      <span style="font-size:12px;">
                        <a href="https://www.instagram.com/bombay_blokes/?hl=en" style=" color:#222222 !important;">Instagram</a> &nbsp; | &nbsp;
                        <a href="https://www.facebook.com/bombayblokes/" style=" color:#222222 !important; ">Facebook</a> &nbsp; | &nbsp;
                        <a href="https://www.linkedin.com/company/bombay-blokes-digital-solutions-llp/?originalSubdomain=in" style=" color:#222222 !important;">LinkedIn</a>
                      </span>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>

            <!-- Footer Banner -->
            <tr>
              <td>
                <img src="https://blokesarea.com/wp-content/uploads/2025/12/email-signature-2.png"
                     width="600" style="display:block; width:100%;">
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
      `,     
    };

    console.log('🌐 Sending OneSignal API request with payload:', payload);

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${process.env.ONESIGNAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('✅ OneSignal API Response:', data);

    if (response.ok) {
      return res.status(200).json({ success: true, data });
    } else {
      return res.status(response.status).json({ success: false, data });
    }
  } catch (error) {
    console.error('❌ API Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
