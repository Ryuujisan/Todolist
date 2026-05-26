import type { AuthData} from "../../type/User.ts";
import {useNavigate} from "react-router";
import {useLoginMutation} from "./authApi.ts";
import {type FormEvent, useEffect, useState} from "react";
import {useAppSelector} from "../../store/store.ts";

export const LoginPage = () => {
    const auth = useAppSelector((s) => s.auth);
    const [authData, setAuthData] = useState<AuthData>({email: "", password: ""});
    const [login, { isLoading }] = useLoginMutation();
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.user) navigate("/profile");
    }, [auth.user, navigate]);

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (isLoading) return;
            await login(authData).unwrap();
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
                        <input type="email" className="input validator" placeholder="Email" required value={authData.email} onChange={(e) => setAuthData({...authData, email: e.target.value})}/>
                        <p className="validator-hint hidden">Required</p>
                    </fieldset>

                    <label className="fieldset">
                        <span className="label">Password</span>
                        <input type="password" className="input validator" placeholder="Password" required value={authData.password} onChange={(e) => setAuthData({...authData, password: e.target.value})}/>
                        <span className="validator-hint hidden">Required</span>
                    </label>

                    <button className="btn btn-neutral mt-4" disabled={isLoading}>Login</button>
                    <button className="btn btn-ghost mt-1" type="reset">Reset</button>
                </form>
        </div>
    )
}
