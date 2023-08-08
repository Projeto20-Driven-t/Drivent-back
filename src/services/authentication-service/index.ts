import sessionRepository from "@/repositories/session-repository";
import userRepository from "@/repositories/user-repository";
import { exclude } from "@/utils/prisma-utils";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { invalidCredentialsError } from "./errors";
import axios from "axios";
import dotenv from 'dotenv'
import qs from "query-string";
dotenv.config()

async function signIn(params: SignInParams): Promise<SignInResult> {
  const { email, password } = params;

  const user = await getUserOrFail(email);

  await validatePasswordOrFail(password, user.password);

  const token = await createSession(user.id);

  return {
    user: exclude(user, "password"),
    token,
  };
}

export async function loginWithGitHub(code:string) {
  const token=await changeCode(code)
  console.log('token',token)
  const user= await fetchUser(token)
  return user
}

type GitHubToken={
  code:string,
  grant_type:string,
  redirect_uri:string,
  client_id:string,
  client_secret:string
}

async function fetchUser(token:string) {
  const response= await axios.get("http://api.github.com/user",{
    headers:{
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}

async function changeCode(code:string) {
  const GITHUB_TOKEN_URL='https://github.com/login/oauth/access_token'
  const {REDIRECT_URL,CLIENT_ID,CLIENT_SECRET}=process.env

  const params:GitHubToken={
    code,
    grant_type:'authorization_code',
    redirect_uri:REDIRECT_URL,
    client_id:CLIENT_ID,
    client_secret:CLIENT_SECRET 
  }
    console.log('params',params)
    const {data}=await axios.post(GITHUB_TOKEN_URL,params,{
      headers:{
        'Content-Type': 'application/json' 
      }
    })
    console.log('data',data)

    const {access_token}=qs.parse(data)
    console.log('access_token',access_token)
    return Array.isArray(access_token)?access_token.join(""):access_token
}

async function getUserOrFail(email: string): Promise<GetUserOrFailResult> {
  const user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  if (!user) throw invalidCredentialsError();

  return user;
}

async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  await sessionRepository.create({
    token,
    userId,
  });

  return token;
}

async function validatePasswordOrFail(password: string, userPassword: string) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) throw invalidCredentialsError();
}

export type SignInParams = Pick<User, "email" | "password">;

type SignInResult = {
  user: Pick<User, "id" | "email">;
  token: string;
};

type GetUserOrFailResult = Pick<User, "id" | "email" | "password">;

const authenticationService = {
  signIn,
  loginWithGitHub
};

export default authenticationService;
export * from "./errors";
