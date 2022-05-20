import { Novu } from "@novu/node";
const novu = new Novu(process.env.NOVU_API_KEY);

export default function handler(req, res) {
  novu.trigger("safeanzeigen-signup", {
    to: {
      subscriberId: "TestUserId",
      email: "saschamaj@xyz.com",
      phone: "012345",
    },
    payload: {
      firstname: "Testfirstname",
      lastname: "Testlastname",
    },
  });
  res.status(200).json({ message: "Notification was sent!" });
}
