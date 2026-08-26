import { cookiesDate } from "@/src/types/global.type";
import { compare, hash } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { cookies } from "next/headers";


const ACCESS_SECRET = process.env.ACCESS_TOKEN_PRIVATE_KEY;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET_KEY;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("Critical Error: JWT Secret keys are not defined in environment variables.");
}



export const PasswordService = {
  async hash(password : string):Promise<string> {
    return await hash(password , 12)
  },
  async compare(password : string , hash:string) : Promise<boolean>{
    return await compare(password , hash)
  }
};


export const TokenService = {
  generateAccessToken<t extends cookiesDate>(data:t) : string{
    return sign({...data} , ACCESS_SECRET , {expiresIn : "1d"})
  },
  generateRefreshToken <t extends cookiesDate>(data : t) : string {
    return sign({...data} , REFRESH_SECRET , {expiresIn : "15d"})
  },
  verifyAccessToken<t extends cookiesDate>(token : string):t|null{
      try{
          const payload = verify(token , ACCESS_SECRET) as t
          return payload
      }catch(err){
          console.error("Access Token Verification Failed:", err instanceof Error ? err.message : err);
          return null; 
      }
  },
  verifyRefreshToken<t extends cookiesDate>(token:string) : t | null{
    try{
        const payload = verify(token , REFRESH_SECRET) as t
        return payload
    }catch(err){
        console.error("Access Token Verification Failed:", err instanceof Error ? err.message : err);
        return null; 
    }
  },
};

export async function getCookies(target: string): Promise<string | null> {
  const cookiesStore = await cookies();
  return cookiesStore.get(target)?.value ?? null;
}
