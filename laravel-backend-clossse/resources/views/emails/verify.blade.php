<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Email Verification</title>
        <style>
            body {
                background-color: #111827;
                color: #ffffff;
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
            }

            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }

            .card {
                background-color: #1f2937;
                padding: 32px;
                text-align: center;
            }

            h1 {
                font-size: 24px;
                font-weight: bold;
                background: linear-gradient(to right, #3b82f6, #2563eb);
                -webkit-background-clip: text;
                color: transparent;
                margin-bottom: 16px;
            }

            p {
                font-size: 16px;
                color: #9ca3af;
                margin-bottom: 24px;
            }

            a.verify-button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #3b82f6;
                color: #ffffff;
                font-size: 16px;
                font-weight: bold;
                text-decoration: none;
                border-radius: 8px;
                transition: background-color 0.3s ease;
            }

            a.verify-button:hover {
                background-color: #2563eb;
            }

            .footer-text {
                font-size: 14px;
                color: #6b7280;
                margin-top: 24px;
            }
        </style>
    </head>

    <body>
        <div class="container">
            <div class="card">
                <h1>Email Verification</h1>
                <p style="color: white;">Please click the link below to verify your email address:</p>
                <a href="{{ $verificationUrl }}" class="verify-button">Verify Email</a>
                <p class="footer-text">If you did not request this email, you can safely ignore it.</p>
            </div>
        </div>
    </body>
</html>