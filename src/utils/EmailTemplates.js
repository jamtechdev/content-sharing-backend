// utils/emailTemplates.js
function forgotPasswordTemplate(user, resetToken) {
    return `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
              background-color: #f9f9f9;
            }
            h1 {
              color: #007bff;
            }
            button {
              background-color: #007bff;
              color: white;
              border: none;
              padding: 10px 15px;
              cursor: pointer;
              border-radius: 4px;
            }
            a {
              color: inherit;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Dear ${user.email},</h1>
            <p>Please reset your password using the link below:</p>
            <p>
              <button>
                <a href='${process.env.CLIENT_SIDE_URI}?token=${resetToken}#${process.env.ROUTE_UNIQUE_ID}'>
                  Reset Password
                </a>
              </button>
            </p>
            <p>If you did not request a password reset, please ignore this email.</p>
            <p>Regards,<br>Content Sharing</p>
          </div>
        </body>
      </html>
    `;
  }
  
  module.exports = {
    forgotPasswordTemplate,
  };
  