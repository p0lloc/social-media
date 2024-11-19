import { useContext, useEffect, useState } from "react";
import Button from "../components/base/Button";
import { authService } from "../bootstrap";
import { authContext } from "../context/auth";
import { useLocation } from "wouter";

function Settings() {

    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const auth = useContext(authContext);
    const [_, setLocation] = useLocation();

    useEffect(() => {
        if (!auth.loaded || auth.authenticatedUser != null) {
            return;
        }

        setLocation("/login");
    }, [auth.authenticatedUser]);

    async function changePassword() {
        if (!await authService.setPassword(password, newPassword)) {
            setMessage("Incorrect password!");
            return
        }

        setPassword("");
        setNewPassword("");
        setMessage("Password changed.");
    }

    async function logout() {
        await auth.logout();
        setLocation("/login");
    }

    return (
        <div className={"main-center mt-8 p-2"}>
            <div className={"bg-white p-4 border rounded-md"}>
                <div className={"flex justify-between items-center"}>
                    <h2 className={"text-4xl font-bold"}>Settings</h2>
                    <Button onClick={logout}>Log out</Button>
                </div>
                <div className={"md:w-1/4"}>
                    <h2 className={"mt-8 text-2xl font-bold"}>Change password</h2>
                    <p>{message}</p>
                    <input className={"mt-4"} value={password} onChange={(e) => setPassword(e.target.value)}
                        type={"password"} placeholder={"Previous password"} />
                    <input className={"mt-2"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                        type={"password"} placeholder={"New password"} />
                    <Button onClick={changePassword} className={"mt-4"}>Change password</Button>
                </div>
            </div>
        </div>
    );
}

export default Settings;

