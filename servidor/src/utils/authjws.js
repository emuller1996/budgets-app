import jsonwebtoken from "jsonwebtoken";

const validateToken = (req, res) => {
  const accessToken = req.headers["access-token"];
  if (!accessToken)
    return res
      .status(403)
      .json({ message: "ACCES DENIED: TOKEN NO SUMINISTRADO." });
  jsonwebtoken.verify(accessToken, "EVENTOMULL", (err, user) => {
    if (err) {
      return res
        .status(405)
        .json({ message: "ERROR-> TOKEN EXPIRED OR INCORRECT" });
    } else {
      return res
        .status(200)
        .json({ message: "ALL FINE" });
    }
  });
};

export { validateToken };
