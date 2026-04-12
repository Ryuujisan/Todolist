import {useAppSelector} from "../../store/store.ts";

export const ProfilePage = () => {
    const auth = useAppSelector((s) => s.auth);

    return (
        <div>
           <p> email: {auth.user.email}</p>
            <p> name: {auth.user.name}</p>
            <p> description: {auth.user.descriptions}</p>
            <p> created at: {auth.user.createdAt}</p>
            <p> updated at: {auth.user.updatedAt}</p>
        </div>
    )
}
