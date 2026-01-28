// File: src/pages/LoginPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth.js";

const LoginPage = () => {
  const { login, token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) navigate("/", { replace: true });
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      await login(form);
      toast.success("登录成功");
      navigate("/", { replace: true });
    } catch (err) {
      const code = err?.response?.data?.message;
      if (code === "INVALID_CREDENTIALS") {
        toast.error("邮箱或密码错误");
      } else {
        toast.error("登录失败，请稍后再试");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <div className="w-full max-w-sm rounded-md bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-xl font-semibold">登录</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
            type="email"
            name="email"
            placeholder="邮箱"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
            type="password"
            name="password"
            placeholder="密码"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 py-2 text-white disabled:opacity-50"
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          还没有账号？
          <Link
            to="/auth/register"
            className="ml-1 text-blue-600 hover:underline"
          >
            注册
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
