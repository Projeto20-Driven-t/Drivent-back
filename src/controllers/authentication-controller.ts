import authenticationService, { SignInParams, loginWithGitHub } from "@/services/authentication-service";
import { Request, Response } from "express";
import httpStatus from "http-status";
export async function singInPost(req: Request, res: Response) {
  const { email, password } = req.body as SignInParams;

  try {
    const result = await authenticationService.signIn({ email, password });

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send({});
  }
}

export async function login(req: Request, res: Response) {
  const { code }=req.body as {code: string}; //joi
  console.log(code);
  try {
    const user=await loginWithGitHub(code);
    // console.log("token do github",token);
    return res.status(httpStatus.OK).send(user);
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send("Something went wrong with GitHub access");
  }
}
