// const jwt = require("jsonwebtoken");

// const createJWT = ({ payload }) => {
//   const token = jwt.sign(payload, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_LIFETIME,
//   });
//   return token;
// };

// const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

// const attachCookiesToResponse = ({ res, payload }) => {
//   const token = createJWT({ payload });
//   const oneDay = 1000 * 60 * 60 * 24;

//   res.cookie("token", token, {
//     httpOnly: true,
//     expires: new Date(Date.now() + oneDay),
//     secure: process.env.NODE_ENV === "production",
//     signed: true,
//   });
// };

// module.exports = { createJWT, isTokenValid, attachCookiesToResponse };

///////////////////////////////////////////////////////////////////////

const jwt = require("jsonwebtoken");

const createJWT = ({
  payload,
  secret = process.env.JWT_SECRET,
  expiresIn = process.env.JWT_LIFETIME,
}) => {
  return jwt.sign(payload, secret, { expiresIn });
};

const isTokenValid = ({ token, secret = process.env.JWT_SECRET }) => {
  return jwt.verify(token, secret);
};

const attachCookiesToResponse = ({ res, payload }) => {
  const accessToken = createJWT({ payload });
  const refreshToken = createJWT({
    payload,
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_REFRESH_LIFETIME,
  });

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", accessToken, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
