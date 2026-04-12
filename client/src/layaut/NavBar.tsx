import {Link, useNavigate} from "react-router";
import {useLogoutMutation} from "../feature/auth/authApi.ts";
import {useAppSelector} from "../store/store.ts";

export const NavBar = () => {
    const auth = useAppSelector((s) => s.auth);
    const guestMenu = [
        {title: 'Login', path: '/login'},
        {title: 'Register', path: '/register'},
    ]
    
    const userMenu = [
        {title: 'Profile', path: '/profile'},
        {title: 'Dashboard', path: '/dashboard'},
      //  {title: 'Logout', path: '/logout'},
    ]
    
    const menu = auth.user != null ? userMenu : guestMenu;
    const homeLink = auth.user != null ? '/dashboard' : '/';

    const [logout] = useLogoutMutation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        console.log("Logout");
        try {
            console.log("Logout");
            await logout().unwrap();
            navigate("/login");
        } catch (err) {
            console.error(err);
        }
    };
    
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <Link to={homeLink} className="btn btn-ghost text-xl">daisyUI</Link>
            </div>
            <div className="flex gap-2">

                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="Tailwind CSS Navbar component"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                    </div>
                    <ul
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {menu.map((item) => (
                            <li key={item.path}>
                                <Link to={item.path}>{item.title}</Link>
                            </li>
                        ))}
                        {auth.user != null && <li><button className="btn btn-ghost" onClick={handleLogout}>Logout</button></li>}
                    </ul>
                </div>
            </div>
        </div>
    )
}
