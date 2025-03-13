"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "help_and_supports",
      [
        {
          category: `<h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">1. Content Access</h1>`,
          query: JSON.stringify([
            {
              question: `<p style="margin-bottom: 16px;"><strong style="font-weight: bold;">I am unable to view subscribed content. What steps should I take?</strong></p>`,
              answer: `<ul style="margin-bottom: 16px; padding-left: 20px;">
      <li style="margin-bottom: 8px;"><strong style="font-weight: bold;">Subscription Verification:</strong> Confirm your subscription status in the “My Account” section.</li>
      <li style="margin-bottom: 8px;"><strong style="font-weight: bold;">Technical Resolution:</strong> Refresh the page or clear your browser/application cache to address loading issues.</li>
      <li style="margin-bottom: 8px;"><strong style="font-weight: bold;">Device Requirements:</strong> Ensure compatibility with supported browsers (e.g., Chrome, Firefox, Safari) or the latest app version.</li>
    </ul>`,
              note: `<p style="margin-bottom: 16px;">If the issue persists, submit your username and a description of the problem via the support form.</p>`,
            },
          ]),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          category: `<h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">2. Payment Processing</h1>`,
          query: JSON.stringify([
            {
              question: `<p style="margin-bottom: 16px;"><strong style="font-weight: bold;">Why is my payment not completing?</strong></p>`,
              answer: `<ul style="margin-bottom: 16px; padding-left: 20px;">
      <li style="margin-bottom: 8px;"><strong style="font-weight: bold;">Payment Information:</strong> Verify that your card details are correct and the card remains valid.</li>
      <li style="margin-bottom: 8px;"><strong style="font-weight: bold;">Account Balance:</strong> Ensure sufficient funds are available for the transaction.</li>
      <li style="margin-bottom: 8px;"><strong style="font-weight: bold;">Accepted Methods:</strong> We process payments via [e.g., Visa, Mastercard, PayPal]. Attempt an alternative method if necessary.</li>
      <li style="margin-bottom: 8px;"><strong style="font-weight: bold;">Billing Accuracy:</strong> Confirm your billing address aligns with your payment provider’s records.</li>
    </ul>`,
              note: `<p style="margin-bottom: 16px;"><strong style="font-weight: bold;">Payment declined? </strong>Contact your financial institution, then inform us if the issue remains unresolved.</p>`,
            },
            {
              question: `Charged without access?`,
              answer: `<ul style="margin-bottom: 16px; padding-left: 20px;">
      <li style="margin-bottom: 8px;"><strong style="font-weight: bold;">Payment Information:</strong> Verify that your card details are correct and the card remains valid.</li></ul>`,
            },
          ]),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          category: `<h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">3. Chat Functionality</h1>`,
          query: JSON.stringify([
            {
              question: `<p style="margin-bottom: 16px;"><strong style="font-weight: bold;">How do I initiate a chat?</strong></p>`,
              answer: `<ul style="margin-bottom: 16px; padding-left: 20px;">
      <li style="margin-bottom: 8px;">If your subscription includes chats, Access the “Chat” section in your dashboard, enter your message, and submit. A response will be provided promptly.</li></ul>`,
            },
            {
              question: `<p style="margin-bottom: 16px;"><strong style="font-weight: bold;">Chat option unavailable?</strong></p>`,
              answer: `<ul style="margin-bottom: 16px; padding-left: 20px;">
      <li style="margin-bottom: 8px;">This feature may be restricted to specific subscription tiers. Verify your plan in “My Account.”</li>
      <li style="margin-bottom: 8px;">If access is expected, attempt logging out and back in. Contact support if the issue continues.</li>
      </ul>`,
            },
            {
              question: `<p style="margin-bottom: 16px;"><strong style="font-weight: bold;">Messages not transmitting?</strong></p>`,
              answer: `<ul style="margin-bottom: 16px; padding-left: 20px;">
      <li style="margin-bottom: 8px;">Adhere to text guidelines and limits. Persistent issues should be reported via the support form.</li>
      </ul>`,
            },
          ]),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          category: `<h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">4. Custom Proposals</h1>`,
          query: JSON.stringify([
            {
              question: `<p style="margin-bottom: 16px;"><strong style="font-weight: bold;">How do I submit a custom content request?</strong></p>`,
              answer: `<ul style="margin-bottom: 16px; padding-left: 20px;">
      <li style="margin-bottom: 8px;">Locate the “Custom Proposals” section, complete the required fields, and submit. You will receive a response with cost and timeline details.</li>
    </ul>`,
            },
            {
              question: `<p style="margin-bottom: 16px;"><strong style="font-weight: bold;">Proposal option not visible?</strong></p>`,
              answer: `<ul style="margin-bottom: 16px; padding-left: 20px;">
      <li style="margin-bottom: 8px;">This feature may be exclusive to certain subscription levels. Review your plan or consider an upgrade.</li>
      <li style="margin-bottom: 8px;">If an error is suspected, provide your username for investigation.</li>
    </ul>`,
            },
            {
              question: `<p style="margin-bottom: 16px;"><strong style="font-weight: bold;"What is the response timeframe?</strong></p>`,
              answer: `<ul style="margin-bottom: 16px; padding-left: 20px;">
      <li style="margin-bottom: 8px;">Responses are typically issued within 48 hours, subject to request volume. You will be notified upon review.</li>
    </ul>`,
            },
          ]),
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('help_and_supports', null, {});
  },
};
