import { ChangeEvent, useContext, useState } from "react";
import { Link, useLocation } from "wouter";
import { authContext } from "../context/auth";
import Button from "../components/base/Button";
import SignInWithGoogle from "../components/base/SignInWithGoogle";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const auth = useContext(authContext);

    const [_, setLocation] = useLocation();

    async function login() {
        let ok = await auth.login(email, password);
        if (!ok) {
            alert("Login failed!!!");
            return;
        }

        setLocation("/");
    }

    function onEmailChange(e: ChangeEvent<HTMLInputElement>) {
        setEmail(e.target.value);
    }

    function onPasswordChange(e: ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value);
    }

    function signInWithGoogle() {
        window.location.href = "/auth/redirect/google";
    }

    return (
        <div className="main-center">
            <div className="mt-12 border rounded-md bg-white w-full md:w-[30rem] p-6 mx-auto ">
                <h2 className="text-2xl font-bold text-center">Log in to VibeShare</h2>
                <p className="text-center">{history.state}</p>
                <input value={email} onChange={onEmailChange} className="mt-6" placeholder="Email" type="email"></input>
                <input value={password} onChange={onPasswordChange} className="mt-2" placeholder="Password" type="password"></input>
                <div className="flex justify-end mt-2">
                    <Link href="/reset-password" className={"text-gray-500"}>Forgot your password?</Link>
                </div>
                <Button onClick={login} className="w-full mt-4">Log in</Button>
                <SignInWithGoogle className="w-full mt-2" onClick={signInWithGoogle} />
            </div>

        </div>
    );
}

export default Login;