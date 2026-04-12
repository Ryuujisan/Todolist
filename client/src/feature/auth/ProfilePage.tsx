import {useAppSelector} from "../../store/store.ts";
import {useUpdateMutation} from "./authApi.ts";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
export const ProfilePage = () => {
    const auth = useAppSelector((s) => s.auth);
    const [profile, setProfile] = useState({
        name: auth.user.name,
        email: auth.user.email,
        descriptions: auth.user.descriptions,
    })
    
    const [update, { isLoading, isSuccess, isError }] = useUpdateMutation();

    const onSubmit = async () => {
        try {
            console.log("Desch: " + profile.descriptions + " password: " + profile.password)
            await update({
                password: profile.password,
                descriptions: profile.descriptions,
                name: profile.name,
            }).unwrap();

            toast.success("Udało się zapisać profil");
        } catch (err) {
            console.error(err);
            toast.error("Nie udało się zapisać profilu");
        }
    };
    return (
        <div className="flex pt:4 flex-col items-center justify-center">
            <div className={"bg-base-content/10 p-4 rounded shadow max-w rounded-box"}>
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold">Profile</h1>
                        <div className="avatar avatar-placeholder mt-4">
                            <div className="bg-neutral text-neutral-content w-24 rounded-full">
                                <span className="text-5xl">{auth.user.name.charAt(0)}</span>
                            </div>
                        </div>
                        <div className={'mt-4 w-full max-w-xs input-group'}>
                            <input type="email" placeholder={auth.user.email} disabled={'true'} className="input input-neutral input-xl" />
                            <input type="password" placeholder={"password"} disabled={isLoading} className="input input-neutral input-xl mt-2" 
                             onChange={(e) => setProfile({...profile, password: e.target.value})}/>
                            <input type="text" value={profile.name} disabled={isLoading} className="input input-neutral input-xl mt-2" 
                            onChange={(e) => setProfile({...profile, name: e.target.value})}/>
                            <textarea value={profile.descriptions} disabled={isLoading} className="textarea textarea-neutral textarea-xl mt-2" 
                            onChange={(e) => setProfile({...profile, descriptions: e.target.value})}/>
                            <label className="label"><span>Create at {auth.user.createdAt}</span></label>
                            <label className="label"><span>Update at {auth.user.updatedAt}</span></label>
                        </div>
                        <button className="btn btn-neutral mt-4 btn-xl" disabled={isLoading} onClick={onSubmit}>Update</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
