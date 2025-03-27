import LoginForm from "@/app/(auth)/login/login-form";

export default function page() {
  return (
    <div className="mt-40 max-w-[400px] m-auto py-4 px-8 bg-white rounded-md">
      <h1 className="text-center text-3xl mt-4 font-semibold">Đăng nhập</h1>
      <LoginForm />
    </div>
  );
}
