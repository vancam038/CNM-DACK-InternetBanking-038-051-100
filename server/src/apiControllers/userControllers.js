var express = require("express");
var router = express.Router();

router.post("/me", (req, res) => {
  let payload = req.token_payload;
  console.log(req.token_payload);
  res.json({
    info: {
      name: payload.user.f_name,
      phone: payload.user.f_phone,
      type: payload.user.f_type
    }
  });
});

router.post("/id", (req, res) => {
  let payload = req.token_payload;
  res.json({
    id: payload.user.f_id
  });
});

module.exports = router;
