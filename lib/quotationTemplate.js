function generateQuoteHTML({ costItems, total }) {
  return `
    <html>
    <head>
      <style>
        body {
          font-family: 'Poppins', sans-serif;
          padding: 20px;
          color: #1E1E1E;
        }
        .card {
          max-width: 600px;
          margin: auto;
          border: 1px solid #1E1E1E;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 6px 5px 0px 0px #262626;
        }
        h2 {
          text-align: center;
          font-size: 24px;
          font-weight: 700;
        }
        .row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .label {
          font-weight: 600;
        }
        .value {
          font-weight: 400;
        }
        .total {
          font-weight: 700;
          font-size: 18px;
          margin-top: 20px;
          border-top: 1px solid #000;
          padding-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Cost Summary</h2>
        ${costItems
          .map(
            (item) => `
          <div class="row">
            <div class="label">${item.label}: ${item.value}</div>
            <div class="value">₹${item.price.toLocaleString()}</div>
          </div>
        `
          )
          .join('')}
        <div class="row total">
          <div class="label">Estimated Cost:</div>
          <div class="value">₹${total.toLocaleString()}</div>
        </div>
      </div>
    </body>
    </html>
  `;
}
module.exports = generateQuoteHTML;
