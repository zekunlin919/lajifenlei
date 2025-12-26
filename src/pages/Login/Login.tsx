import { useState } from "react";
import { useNavigate } from "react-router";
import "./Login.scss";
import { post } from '@/utils/request.tsx'



function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    function handleLogin() {
        post('/api/login', { username, password}, false).then((res) => {
            console.log(res);
            localStorage.setItem('token', res.token);
            navigate('/user1');
        }).catch((err) => {
            console.log(err);
        });
    }

    return (
        <div className="container1">
            <div className="login-wrapper">
                <div className="header">垃圾分类系统</div>
                <div className="form-wrapper">
                    <input type="text" name="username" placeholder="请输入用户名"
                        className="input-item" onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" name="password" placeholder="请输入密码"
                        className="input-item" onChange={(e) => setPassword(e.target.value)} />
                    <div className="login-btn">
                        <div className="btn" onClick={() => handleLogin()}>用户登录</div>
                    </div>
                </div>
                <div className="msg">
                    Don't have account?
                    <a href="/sign">Sign up</a>
                </div>
            </div>
        </div>
    );
}

export default Login;