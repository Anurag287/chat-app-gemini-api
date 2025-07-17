const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { WebSocketServer } = require("ws");
const app = express();
app.use(express.json());
app.use(cors());

// app.post("/chat", async (req, res) => {
//   const text = req.body.question;
//   const model = req.body.model;
//   const response = await axios.post(
//     https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent,
//     {
//       contents: [
//         {
//           parts: [
//             {
//               text: text,
//             },
//           ],
//         },
//       ],
//     },
//     {
//       headers: {
//         "X-goog-api-key": "AIzaSyAbNiRlV5C8Mp9ThBH5bUGrdd9cqjf02WI",
//       },
//     }
//   );
//   if (response) {
//     res.json({ response: response.data.candidates[0].content.parts[0].text });
//   } else {
//     res.status(400).json({ message: "Could not connect" });
//   }
// });

const server = app.listen(2000)

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  ws.on("message", async (message) => {
    const { text, model } = JSON.parse(message);
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        contents: [
          {
            parts: [
              {
                text: text,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "X-goog-api-key": "AIzaSyAbNiRlV5C8Mp9ThBH5bUGrdd9cqjf02WI",
        },
      }
    );
    if (response) {
        ws.send(JSON.stringify({response: response.data.candidates[0].content.parts[0].text}))
    } else {
      ws.send(JSON.stringify({message: "Could not connect"}))
    }
  });
});