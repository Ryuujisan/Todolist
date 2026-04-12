import {useAppSelector} from "../../store/store.ts";
import {useEffect, useState} from "react";
import type {AuthData} from "../../type/User.ts";
import {useNavigate} from "react-router";
import {useRegisterMutation} from "./authApi.ts";

export const RegisterPage = () => {

    const auth = useAppSelector((s) => s.auth);
    const [authData, setAuthData] = useState<AuthData | null>(null);
    const [password, setPassword] = useState('');
    const [register, { isLoading, error }] = useRegisterMutation();
    const navigate = useNavigate();
    const isMatch = password === authData?.password;
    const onSubmit = async () => {
        
        try {
            await register(authData).unwrap();
            navigate("/profile");
        } catch (err) {
            console.error(err);
        }
    };
    
    return (
        <div className="flex items-center justify-center">
            <form className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                <fieldset className="fieldset">
                    <label className="label">Email</label>
                    <input type="email" className="input validator" placeholder="Email" required onChange={(e) => setAuthData({email: e.target.value, password: authData?.password ?? ''})} />
                    <p className="validator-hint hidden">Required</p>
                </fieldset>

                <label className="fieldset">
                    <span className="label">Password</span>
                    <input type="password" className="input validator" placeholder="Password" required  onChange={(e) => setAuthData({email: authData?.email ?? '', password: e.target.value})}/>
                    <span className="validator-hint hidden">Required</span>
                </label>

                <label className="fieldset">
                    <span className="label">Re-Password</span>
                    <input type="password" className="input validator" placeholder="Re-Password" required  onChange={(e) => (
                        setPassword(e.target.value)
                    )}/>
                    <span className="validator-hint hidden">Required</span>
                </label>
                
                <button className="btn btn-neutral mt-4" onClick={() => onSubmit()}>Register</button>
                <button className="btn btn-ghost mt-1" type="reset">Reset</button>
            </form>
        </div>
    )
}
