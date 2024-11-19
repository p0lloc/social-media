import { useContext, useState } from "react";
import Button from "../components/base/Button";
import { authContext } from "../context/auth";

function ResetPassword() {

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("Enter your email to send a password reset email.");
    const auth = useContext(authContext);

    async function register() {
        await auth.resetPassword(email);
        setMessage("Sent password reset email!");
    }

    return (
        <div className="main-center">
            <div className="mt-12 border rounded-md w-full md:w-[30rem] bg-white p-6 mx-auto ">
                <h2 className="text-2xl font-bold text-center">Reset password</h2>
                <p className={"mt-2 text-center"}>{message}</p>
                <input onChange={(e) => setEmail(e.target.value)} className="mt-6" placeholder="Email" type="email"></input>
                <Button onClick={register} className="w-full mt-4">Send reset mail</Button>
            </div>

        </div>
    );
}

export default ResetPassword;

