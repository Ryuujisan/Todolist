import {useState} from "react";
import {toast} from "react-toastify";
import {useAppSelector} from "../../store/store.ts";
import {useUpdateMutation} from "./authApi.ts";

export const ProfilePage = () => {
    const auth = useAppSelector((s) => s.auth);
    const user = auth.user;
    const [profile, setProfile] = useState({
        name: user?.name ?? "",
        email: user?.email ?? "",
        descriptions: user?.descriptions ?? "",
        password: "",
    });

    const [update, {isLoading}] = useUpdateMutation();

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    const onSubmit = async () => {
        try {
            await update({
                password: profile.password || undefined,
                descriptions: profile.descriptions,
                name: profile.name,
            }).unwrap();

            toast.success("Profile saved");
        } catch (err) {
            console.error(err);
            toast.error("Failed to save profile");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="bg-base-content/10 p-4 rounded-lg shadow w-full max-w-lg">
                <div className="hero-content text-center">
                    <div className="w-full max-w-md">
                        <h1 className="text-5xl font-bold">Profile</h1>
                        <div className="avatar avatar-placeholder mt-4">
                            <div className="bg-neutral text-neutral-content w-24 rounded-full">
                                <span className="text-5xl">{user.name.charAt(0)}</span>
                            </div>
                        </div>
                        <div className="mt-4 w-full input-group">
                            <input type="email" value={profile.email} disabled className="input input-neutral input-xl w-full" />
                            <input
                                type="password"
                                placeholder="password"
                                value={profile.password}
                                disabled={isLoading}
                                className="input input-neutral input-xl mt-2 w-full"
                                onChange={(e) => setProfile({...profile, password: e.target.value})}
                            />
                            <input
                                type="text"
                                value={profile.name}
                                disabled={isLoading}
                                className="input input-neutral input-xl mt-2 w-full"
                                onChange={(e) => setProfile({...profile, name: e.target.value})}
                            />
                            <textarea
                                value={profile.descriptions}
                                disabled={isLoading}
                                className="textarea textarea-neutral textarea-xl mt-2 w-full"
                                onChange={(e) => setProfile({...profile, descriptions: e.target.value})}
                            />
                            <label className="label"><span>Create at {new Date(user.createdAt).toLocaleString()}</span></label>
                            <label className="label"><span>Update at {new Date(user.updatedAt).toLocaleString()}</span></label>
                        </div>
                        <button type="button" className="btn btn-neutral mt-4 btn-xl" disabled={isLoading} onClick={onSubmit}>Update</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
