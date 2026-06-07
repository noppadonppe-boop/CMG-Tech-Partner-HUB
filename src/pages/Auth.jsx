import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
  const [view, setView] = useState('login'); // 'login', 'register', 'forgotPassword'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [position, setPosition] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, register, loginWithGoogle, resetPassword, refreshProfile, userData, currentUser } = useAuth();
  const navigate = useNavigate();

  // If already logged in and profile loaded, redirect based on status
  useEffect(() => {
    if (currentUser && userData) {
      if (userData.status === 'pending') {
        navigate('/pending');
      } else if (userData.status === 'approved') {
        navigate('/');
      } else if (userData.status === 'rejected') {
        setError('บัญชีของคุณถูกระงับการใช้งาน');
      }
    }
  }, [currentUser, userData, navigate]);

  const handleAuthError = (err) => {
    console.error(err);
    if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    } else if (err.code === 'auth/email-already-in-use') {
      setError('อีเมลนี้ถูกใช้งานแล้ว');
    } else if (err.code === 'auth/weak-password') {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
    } else {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (view === 'login') {
        await login(email, password);
        await refreshProfile();
      } else if (view === 'register') {
        await register(email, password, firstName, lastName, position);
        await refreshProfile();
      } else if (view === 'forgotPassword') {
        await resetPassword(email);
        setMessage('ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว');
      }
    } catch (err) {
      handleAuthError(err);
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      await refreshProfile();
    } catch (err) {
      handleAuthError(err);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-white font-inter">
      
      {/* Left Column: Branding and Information */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f172a] text-white relative overflow-hidden flex-col justify-between p-12">
        {/* Background Glows */}
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/20 blur-[100px] rounded-full pointer-events-none mix-blend-screen"></div>
        <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] bg-[#ec4899]/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-[#f97316] to-[#fb923c] rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20">
            <span className="material-symbols-outlined text-[20px]">layers</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-wide">CMG</h1>
            <p className="text-[10px] text-white/60 tracking-widest uppercase">Tech Partner Hub</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 mt-12 mb-auto flex-1 flex flex-col justify-center">
          <h2 className="text-4xl lg:text-[44px] font-bold leading-[1.2] mb-2 tracking-tight">
            ระบบจัดการศูนย์รวม<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f97316] to-[#fb923c]">
              Tech Partner HUB
            </span>
          </h2>
          
          <p className="text-white/70 text-sm mt-6 max-w-md leading-relaxed">
            Construction Management Group<br/>
            บริหารจัดการข้อมูลระบบสารสนเทศ และแพลตฟอร์มการทำงาน<br/>
            อย่างมีประสิทธิภาพ โปร่งใส และตรวจสอบได้
          </p>

          <div className="mt-12 flex flex-col gap-8">
            
            {/* Feature 1 */}
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#fb923c] text-[20px]">widgets</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1 text-white/90">รวมทุกระบบในที่เดียว</h3>
                <p className="text-xs text-white/50 leading-relaxed">เข้าถึงระบบ Project Planning, Control, Engineering และอื่นๆ ครบจบในหน้าเดียว</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#fb923c] text-[20px]">dashboard_customize</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1 text-white/90">บริหารจัดการง่าย</h3>
                <p className="text-xs text-white/50 leading-relaxed">มีระบบ Dashboard สำหรับรวบรวมข้อมูลและจัดการการ์ดเมนูอย่างเป็นระบบ</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#fb923c] text-[20px]">security</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1 text-white/90">เข้าถึงได้ทุกที่ทุกเวลา</h3>
                <p className="text-xs text-white/50 leading-relaxed">รองรับการทำงานผ่าน Web Application ด้วยความปลอดภัยมาตรฐานสากล</p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-[11px] text-white/30">
          © 2026 CMG · All rights reserved
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-y-auto max-h-screen custom-scrollbar">
        <div className="w-full max-w-[400px] py-8">
          
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-[#1e293b] mb-2 flex items-center justify-center lg:justify-start gap-2">
              {view === 'login' && <>ยินดีต้อนรับ 👋</>}
              {view === 'register' && <>สร้างบัญชีใหม่ ✨</>}
              {view === 'forgotPassword' && <>ลืมรหัสผ่าน 🔒</>}
            </h2>
            <p className="text-sm text-slate-500">
              {view === 'login' && 'กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ'}
              {view === 'register' && 'กรอกข้อมูลเพื่อลงทะเบียนเข้าใช้งานระบบ'}
              {view === 'forgotPassword' && 'ใส่อีเมลของคุณเพื่อรับลิงก์รีเซ็ตรหัสผ่าน'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl mb-6 flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
              <p>{error}</p>
            </div>
          )}

          {message && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm p-3 rounded-xl mb-6 flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">check_circle</span>
              <p>{message}</p>
            </div>
          )}

          {view !== 'forgotPassword' && (
            <>
              <button 
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white border border-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-3 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 disabled:opacity-70 disabled:pointer-events-none mb-6"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
                Continue with Google
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-[11px] text-slate-400 font-medium tracking-wide">หรือเข้าด้วย Email</span>
                <div className="h-px bg-slate-200 flex-1"></div>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {view === 'register' && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">ชื่อ</label>
                  <input 
                    type="text" 
                    required 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                    placeholder="John"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">นามสกุล</label>
                  <input 
                    type="text" 
                    required 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                    placeholder="Doe"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">ตำแหน่งงาน (Position)</label>
                  <input 
                    type="text" 
                    required 
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                    placeholder="Engineer"
                  />
                </div>
              </>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Email</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-all duration-300"
                placeholder="you@example.com"
              />
            </div>

            {view !== 'forgotPassword' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Password / รหัสผ่าน</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-all duration-300 tracking-wider"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {view === 'login' && (
              <div className="flex justify-end mt-[-8px]">
                <button 
                  type="button" 
                  onClick={() => { setView('forgotPassword'); setError(''); setMessage(''); }}
                  className="text-xs text-[#3b82f6] hover:text-[#2563eb] font-medium transition-colors"
                >
                  ลืมรหัสผ่าน?
                </button>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#2563eb] text-white py-2.5 rounded-xl font-semibold text-sm tracking-wide shadow-sm hover:bg-[#1d4ed8] transition-all duration-300 disabled:opacity-70 disabled:pointer-events-none mt-2 flex items-center justify-center gap-2"
            >
              {loading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
              {view === 'login' && 'เข้าสู่ระบบ'}
              {view === 'register' && 'ลงทะเบียน'}
              {view === 'forgotPassword' && 'ส่งลิงก์รีเซ็ต'}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-500">
            {view === 'login' ? (
              <p>
                ยังไม่มีบัญชี?{' '}
                <button onClick={() => { setView('register'); setError(''); setMessage(''); }} className="text-[#3b82f6] hover:underline font-semibold">
                  สมัครใช้งาน
                </button>
              </p>
            ) : (
              <p>
                {view === 'register' ? 'มีบัญชีอยู่แล้ว?' : 'จำรหัสผ่านได้แล้ว?'} {' '}
                <button onClick={() => { setView('login'); setError(''); setMessage(''); }} className="text-[#3b82f6] hover:underline font-semibold">
                  เข้าสู่ระบบ
                </button>
              </p>
            )}
          </div>
          
          <div className="mt-6 text-center">
            <button 
              onClick={() => navigate('/')} 
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
              กลับสู่หน้าหลัก
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Auth;
