import { dbconnect } from "../dbConnection";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

interface TokenResponse {
  success: boolean;
  token?: string;
}

const getUser = async (email: string): Promise<{ success: boolean; user?: User }> => {
  const [user]:any = await dbconnect.execute("SELECT * FROM user WHERE email = ?", [email]);

  if (user?.length)
    return {
      success: true,
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        password: user[0].password,
      },
    };
  else
    return {
      success: false,
    };
};

const getToken = async (userID: number): Promise<TokenResponse> => {
  const [tokenArray]:any = await dbconnect.execute("SELECT token FROM token WHERE user_id = ?", [userID]);
  if (tokenArray[0])
    return {
      success: true,
      token: tokenArray[0],
    };
  else
    return {
      success: false,
    };
};

const deleteExistingToken = async (userId: number): Promise<boolean> => {
  try {
    const { success } = await getToken(userId);
    if (success) {
      await dbconnect.execute("DELETE FROM token WHERE user_id = ?", [userId]);
    }
    return true;
  } catch (error) {
    return false;
  }
};

const saveRefreshToken = async (userId: number, refreshToken: string): Promise<void> => {
  await dbconnect.execute("INSERT INTO token (user_id, token) VALUES (?, ?)", [userId, refreshToken]);
};

const saveUser = async (userName: string, email: string, hashPassword: string): Promise<any> =>
  await dbconnect.execute("INSERT INTO user (name, email, password) VALUES (?, ?, ?)", [userName, email, hashPassword]);

const errorHandler = <T extends (...args: any[]) => Promise<any>>(callBackFunction: T) =>
  async (...args: Parameters<T>): Promise<{ success: boolean; data?: ReturnType<T> }> => {
    try {
      const result = await callBackFunction(...args);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
      };
    }
  };

export default function authService() {
  return {
    getUser: errorHandler(getUser),
    deleteExistingToken: errorHandler(deleteExistingToken),
    getToken: errorHandler(getToken),
    saveRefreshToken: errorHandler(saveRefreshToken),
    saveUser: errorHandler(saveUser),
  };
}
