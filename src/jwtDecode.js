import jwt from "jsonwebtoken";

// Hàm decode mà không xác minh
export const decodeJWTWithoutVerify= (token)=> {
  if (!token) {
    throw new Error("Token không được cung cấp.");
  }

  try {
    const decoded = jwt.decode(token, { complete: true }); // Decode cả header và payload
    return decoded;
  } catch (error) {
    throw new Error("Không thể decode JWT.",error);
  }
}

// Hàm xác minh và decode
export const decodeJWTWithVerify= (token, secretKey) => {
  if (!token) {
    throw new Error("Token không được cung cấp.");
  }

  try {
    const verifiedPayload = jwt.verify(token, secretKey); // Xác minh token với secret key
    return verifiedPayload;
  } catch (error) {
    throw new Error("JWT không hợp lệ hoặc hết hạn.",error);
  }
}

// Ví dụ sử dụng
// const token = localStorage.getItem("token");
// try {
//   const payload = decodeJWTWithoutVerify(token);
//   console.log("Payload không xác minh:", payload);

//   // Hoặc với xác minh
//   const secretKey = "your-secret-key"; // Đặt khóa bí mật của bạn
//   const verifiedPayload = decodeJWTWithVerify(token, secretKey);
//   console.log("Payload đã xác minh:", verifiedPayload);
// } catch (error) {
//   console.error(error.message);
// }
