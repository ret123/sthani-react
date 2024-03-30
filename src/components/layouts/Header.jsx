import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../features/auth/authSlice';

import avatar from '../../assets/images/profile/user-1.jpg'



const Header = () => {

    const { user: currentUser } = useSelector((state) => state.auth) ||  {};
    // const [user, setUser] = useState(currentUser);

  

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = async (event) => {
        event.preventDefault();

        let refreshToken = currentUser.tokens.refresh.token;

        dispatch(logout(refreshToken)).then((result) => {
            if (result) {
                navigate('/login');
            }
        })
    }

    return (
        <header className="app-header">
            <nav className="navbar navbar-expand-lg navbar-light">
                <ul className="navbar-nav">
                    <li className="nav-item d-block d-xl-none">
                        <Link className="nav-link sidebartoggler nav-icon-hover" id="headerCollapse" to="#">
                            <i className="ti ti-menu-2" />
                        </Link>
                    </li>
                </ul>
                <div className="navbar-collapse justify-content-end px-0" id="navbarNav">
                    <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-end">
                        <li className="nav-item dropdown">
                            <Link className="nav-link nav-icon-hover" to="#" id="drop2" data-bs-toggle="dropdown" aria-expanded="false">
                                <img src={avatar} alt="" width={35} height={35} className="rounded-circle" />
                            </Link>
                            <div className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up" aria-labelledby="drop2">
                                <div className="message-body">
                                    <h6 className="text-center">
                                    </h6 ><hr />
                                    <Link to="#" className="d-flex align-items-center gap-2 dropdown-item">
                                        <i className="ti ti-user fs-6" />
                                        <p className="mb-0 fs-3">My Profile</p>
                                    </Link>
                                    <button className="btn btn-outline-primary mx-3 mt-2 d-block" onClick={handleLogout}>Logout</button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    )
}

export default Header;