import { useState } from 'react';
import './Sign.scss';
import { useNavigate } from 'react-router';
import { post } from '@/utils/request';

function Sign() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const handleSignup = () => {
        if (password !== confirmPassword) {
            alert('两次输入的密码不一致，请重新输入');
            return;
        }     
        post('/register', { username, password }, false).then((res) => {
            console.log(res);
            localStorage.setItem('token', res);
            navigate('/');
        });
  }

    return (
        <div className="container1">
            <div className="login-wrapper">
                <div className="header">注 册 你 的 用 户</div>
                <div className="form-wrapper">
                    <input type="text" name="username" placeholder="请输入用户名"
                        className="input-item" onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" name="password" placeholder="请输入密码"
                        className="input-item" onChange={(e) => setPassword(e.target.value)} />
                    <input type="password" name="password" placeholder="请确认密码"
                        className="input-item" onChange={(e) => setConfirmPassword(e.target.value)} />    
                    <div className="btn" onClick={handleSignup}>注    册</div>
                </div>
            </div>
        </div>
    );
}
  
export default Sign;