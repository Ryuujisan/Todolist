import {useState, type FormEvent} from "react";
import type {AuthData} from "../../type/User.ts";
import {useNavigate} from "react-router";
import {useRegisterMutation} from "./authApi.ts";

export const RegisterPage = () => {

    const [authData, setAuthData] = useState<AuthData>({email: "", password: ""});
    const [repeatedPassword, setRepeatedPassword] = useState("");
    const [register, { isLoading }] = useRegisterMutation();
    const navigate = useNavigate();
    const isMatch = repeatedPassword === authData.password;
    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isMatch) return;
        
        try {
            await register(authData).unwrap();
            navigate("/profile");
        } catch (err) {
            console.error(err);
        }
    };
    
    return (
        <div className="flex items-center justify-center">
            <form className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4" onSubmit={onSubmit}>
                <fieldset className="fieldset">
                    <label className="label">Email</label>
                    <input type="email" className="input validator" placeholder="Email" required value={authData.email} onChange={(e) => setAuthData({...authData, email: e.target.value})} />
                    <p className="validator-hint hidden">Required</p>
                </fieldset>

                <label className="fieldset">
                    <span className="label">Password</span>
                    <input type="password" className="input validator" placeholder="Password" required value={authData.password} onChange={(e) => setAuthData({...authData, password: e.target.value})}/>
                    <span className="validator-hint hidden">Required</span>
                </label>

                <label className="fieldset">
                    <span className="label">Re-Password</span>
                    <input type="password" className="input validator" placeholder="Re-Password" required value={repeatedPassword} onChange={(e) => setRepeatedPassword(e.target.value)}/>
                    {!isMatch && repeatedPassword && <span className="text-error text-sm">Passwords do not match</span>}
                </label>
                
                <button className="btn btn-neutral mt-4" disabled={isLoading || !isMatch}>Register</button>
                <button className="btn btn-ghost mt-1" type="reset">Reset</button>
            </form>
        </div>
    )
}
