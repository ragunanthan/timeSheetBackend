import { boolRes, userType } from "./types";
import { dbconnect } from "../dbConnection";

const getUser = async (body: any): Promise<userType> => {
  const user: any = await dbconnect.query(
    `SELECT * FROM "User" WHERE email = $1`,
    [body.Email]
  );
  
  if (user.rows?.length)
    return {
      success: true,
      data: user.rows[0]
    };
  else
    return {
      success: false,
    };
};

// const getToken = async (userID: number): Promise<TokenType> => {
//   const [tokenArray]: any = await dbconnect.query(
//     "SELECT token FROM token WHERE user_ID = ?",
//     [userID]
//   );
//   if (tokenArray[0])
//     return {
//       success: true,
//       data: tokenArray[0],
//     };
//   else
//     return {
//       success: false,
//     };
// };

// const deleteExistingToken = async (
//   userId: number
// ): Promise<boolRes> => {
//   try {
//     const { success } = await getToken(userId);
//     if (success) {
//       await dbconnect.query("DELETE FROM token WHERE user_ID = ?", [userId]);
//     }
//     return {
//       success: true,
//     };
//   } catch (error) {
//     return {
//       success: false,
//     };
//   }
// };

// const saveRefreshToken = async (
//   userId: number,
//   refreshToken: string
// ): Promise<boolRes> => {
//   try {
//     await dbconnect.query(
//       "INSERT INTO token (user_ID, token) VALUES (?, ?)",
//       [userId, refreshToken]
//     );
//     return {
//       success: true,
//     };
//   } catch {
//     return {
//       success: false,
//     };
//   }
// };

const saveUser = async (body: any, hashPassword: string): Promise<boolRes> => {
  try {
    const res = await dbconnect.query(
      `INSERT INTO "User" (name, email, password) VALUES ($1, $2, $3)`,
      [body.userName, body.Email, hashPassword]
    );
    return {
      success: true,
    };
  } catch (err) {
    console.log(err);

    return {
      success: false,
    };
  }
};

export { getUser, saveUser };
