import { useState, useContext } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../contexts/AuthContext.jsx";

const Register = () => {
  const { register, token } = useContext(AuthContext);
  const navigate = useNavigate();

  if (token) {
    return <Navigate to="/" replace />;
  }

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

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
      await register(form);
      toast.success("注册成功");
      navigate("/", { replace: true });
    } catch (err) {
      const code = err?.response?.data?.message;
      if (code === "EMAIL_ALREADY_EXISTS") {
        toast.error("该邮箱已被注册");
      } else {
        toast.error("注册失败，请稍后再试");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-20 flex justify-center">
      <div className="w-full max-w-sm rounded-md bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-xl font-semibold">注册</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
            type="text"
            name="name"
            placeholder="用户名"
            value={form.name}
            onChange={handleChange}
            required
          />

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
            placeholder="密码（至少 8 位）"
            value={form.password}
            onChange={handleChange}
            minLength={8}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 py-2 text-white disabled:opacity-50"
          >
            {loading ? "注册中..." : "注册"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          已有账号？
          <Link to="/auth/login" className="ml-1 text-blue-600 hover:underline">
            登录
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
