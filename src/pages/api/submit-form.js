import quotationTableHTML from '../../../lib/quotationTableHTML';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, phone, email, quote, total, estimateId, serviceCalculator, finalPrice } = req.body;

  console.log('📥 Request body:', req.body);

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
    const client = await clientPromise;
    const db = client.db('test');

    // Case 1: Placeholder before final submit
    if (!estimateId) {
      const result = await db.collection('formSubmissions').insertOne({
        name: name || 'N/A',
        phone: phone || 'N/A',
        email: email || 'N/A',
        quote,
        total,
        serviceCalculator,
        finalPrice,
        createdAt: new Date(),
      });

      return res.status(200).json({
        message: 'Placeholder estimate stored',
        estimateId: result.insertedId,
      });
    }

    // Case 2: Final submit (update + send mail)
    if (estimateId) {
      await db.collection('formSubmissions').updateOne(
        { _id: new ObjectId(estimateId) },
        {
          $set: {
            name: name || 'N/A',
            phone: phone || 'N/A',
            email: email || 'N/A',
            quote,
            total,
            serviceCalculator,
            finalPrice,
            updatedAt: new Date(),
          },
        }
      );

      const serviceNameTitle = serviceCalculator
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // -------------------------
      // 1️⃣ ADMIN EMAIL
      // -------------------------
      const adminPayload = {
        app_id: process.env.ONESIGNAL_APP_ID,
        include_email_tokens: ["hello@bombayblokes.com", "bdm@bombayblokes.com"],
        email_subject: `New Inquiry - ${serviceNameTitle}`,
        email_body: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <p><strong>Name:</strong> ${name || 'N/A'} </p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Email:</strong> ${email || 'N/A'}</p>
            <p><strong>Service:</strong> ${serviceCalculator}</p>
            <p><strong>Final Price:</strong> ₹${Number(finalPrice).toLocaleString('en-IN')}</p>
            ${quotationTableHTML(quote, total)}
          </div>
        `,
        email_reply_to: email,
      };

      console.log('📤 Sending admin email...');
      const adminResponse = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${process.env.ONESIGNAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminPayload),
      });

      const adminData = await adminResponse.json();
      console.log('✅ Admin Email Response:', adminData);

      // -------------------------
      // 2️⃣ CLIENT EMAIL (simple thank you)
      // -------------------------
      const clientPayload = {
        app_id: process.env.ONESIGNAL_APP_ID,
        include_email_tokens: [email], // send to client
        email_subject: `Your ${serviceNameTitle} Quotation From Bombay Blokes`,
        email_body: `
          <!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
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
                      <p style="margin:0; font-size:14px; color:#333; text-transform: capitalize; ">
                        Thanks for checking out  our Website Cost Calculator!Based on the choices you made, here’s your customized project quotation, 
                         <span style="color:#F7B21A;" > clear, simple, </span>
                        
                        and 
                        <span style="color:#F7B21A;" >  transparent. </span>
                      </p>
                    </td>
                  </tr>

                  <!-- dotted separator -->
                  <tr>
                    <td style="padding:6px 0;">
                      <div style="border-top:2px dotted #F4C882; width:100%;"></div>
                    </td>
                  </tr>

                  <!-- Details-->
                  <tr>
                    <td style="padding:8px 0 6px 0;">
                      <h3 style="margin:0; font-size:18px; font-weight:700;">Here’s what details you submitted:</h3>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-top:5px; padding-bottom:10px;">
                      <table width="100%" style="font-size:14px;">
  <tr>
    <td style="padding:6px 0;">
      <span style="display:inline-block; width:4px; height:4px; background:#000; border-radius:50%; margin-right:10px;"></span>
      <strong>Name:</strong>
      <span style=" color:#555555 ; text-transform: capitalize;" >${name || 'N/A'} </span>
    </td>
  </tr>

  <tr>
    <td style="padding:6px 0;">
      <span style="display:inline-block; width:4px; height:4px; background:#000; border-radius:50%; margin-right:10px;"></span>
      <strong>Phone:</strong>
      <span style=" color:#555555 ; text-transform: capitalize;" >${phone || 'N/A'} </span>
    </td>
  </tr>



  <tr>
 <td style="padding:6px 0; vertical-align:top;">
  <span style="display:inline-block; width:4px; height:4px; background:#000; border-radius:50%; margin-right:10px;"></span>
  <strong>Email:</strong>
  <a style="color:#555555 !important; text-decoration:none !important; margin-left:6px;">
    ${email || 'N/A'}
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



                  <!-- Quatation-->
                  <tr>
                    <td style="padding:8px 0 6px 0;">
                      <h3 style="margin:0; font-size:18px; font-weight:700;">Here’s what details you submitted:</h3>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-top:5px; padding-bottom:10px;">
                      <table width="100%" style="font-size:14px;">
  <tbody>
    ${quote
      .map((item, index) => {
        const isLast = index === quote.length - 1;

        return `
          <tr>
            <td style="padding:8px; ${!isLast ? "border-bottom:1px solid #eee;" : ""}">
              ${item.type} - ${item.value}
            </td>

            <td style="padding:8px; text-align:right; ${!isLast ? "border-bottom:1px solid #eee;" : ""}">
              ₹${Number(item.price).toLocaleString("en-IN")}
            </td>
          </tr>
        `;
      })
      .join("")}
  </tbody>
</table>


                    </td>
                  </tr>


                   <!-- dotted separator -->
                  <tr>
                    <td style="padding:6px 0;">
                      <div style="border-top:2px dotted #F4C882; width:100%;"></div>
                    </td>
                  </tr>



                  <tr>
                    <td style="padding:8px 0 6px 0;">
                      <h3 style="margin:0; font-size:18px; font-weight:700;">Estimated Project Cost</h3>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-top:5px; padding-bottom:10px;">
                      <table width="100%" style="font-size:14px;">
  <tr>
    <td style="padding:6px 0;">
      <td style="padding:8px; text-align:left; font-weight:bold; font-size:20px;">₹${Number(total).toLocaleString(
              "en-IN"
            )}</td>
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


                  <!-- Work CTA -->
                  <tr>
                     <td style="padding-top:10px; padding-bottom:10px;">
                      <p style="margin:0; font-size:18px; font-weight:700;">Since you’re interested in Website, here is our Portfolio:</p>
                      

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


                  <!-- What Happens Next -->
                  <tr>
                     <td style="padding-top:14px; padding-bottom:10px;">
                      <h4 style="font-size:16px; margin:0 0 6px;">What Happens Next?</h4>

                      <p style="margin:0; font-size:14px; color:#333333; line-height:20px;">
                        A member of our team will get in touch with you within 24 hours to:
                      </p>
                      <table style="font-size:14px;">
                        <tr><td style="padding:6px 0;"> <span style="display:inline-block; width:4px; height:4px; background:#000; border-radius:50%; margin-right:10px;"></span> Discuss your project requirements</td></tr>
                        <tr><td style="padding:6px 0;"> <span style="display:inline-block; width:4px; height:4px; background:#000; border-radius:50%; margin-right:10px;"></span> Share timelines and strategy</td></tr>
                        <tr><td style="padding:6px 0;"> <span style="display:inline-block; width:4px; height:4px; background:#000; border-radius:50%; margin-right:10px;"></span> Answer any questions</td></tr>
                        <tr><td style="padding:6px 0;"> <span style="display:inline-block; width:4px; height:4px; background:#000; border-radius:50%; margin-right:10px;"></span> Finalise the proposal</td></tr>
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
                      <p style="margin:12px 0 6px 0; font-size:14px; color:#222222;"><strong>If you’d like to move faster, feel free to contact us anytime:: <br/> Reach us anytime:</strong></p>

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
                        Let’s build something that performs, not just looks good.
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
                <img src="https://blokesarea.com/wp-content/uploads/2025/12/Email-Signature.png"
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
        email_reply_to: 'hello@bombayblokes.com',
      };

      console.log('📤 Sending client email...');
      const clientResponse = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${process.env.ONESIGNAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientPayload),
      });

      const clientData = await clientResponse.json();
      console.log('✅ Client Email Response:', clientData);

      return res.status(200).json({
        success: true,
        message: 'Form updated and both emails sent',
        adminData,
        clientData,
      });
    }

    return res.status(400).json({ message: 'Invalid submission' });

  } catch (error) {
    console.error('❌ API Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
