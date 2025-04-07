"use client";
import Image from "next/image";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus("Đang gửi...");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setStatus("Gửi thành công!");
        setFormData({ name: "", phone: "", email: "", message: "" });
      } else {
        setStatus(`Lỗi: ${result.message}`);
      }
    } catch (error) {
      setStatus("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-30">
      <div className="grid grid-cols-1 md:grid-cols-3 items-stretch">
        {/* Hình ảnh chiếm 2/3 */}
        <div className="md:col-span-2">
          <div className="w-full h-full overflow-hidden">
            <Image
              src="/images/vitri.png"
              alt="vitri"
              width={1200}
              height={800}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Form chiếm 1/3 */}
        <div className="bg-white bg-opacity-90 p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 mb-3">
              Liên hệ với chúng tôi!
            </h1>
            <p className="text-gray-600 mb-6">
              Hãy cho chúng tôi biết cách có thể hỗ trợ bạn tốt nhất.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Họ tên"
                className="w-full border-b-2 border-blue-400 bg-transparent text-gray-700 py-2 focus:outline-none focus:border-blue-600"
                required
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Số điện thoại"
                className="w-full border-b-2 border-blue-400 bg-transparent text-gray-700 py-2 focus:outline-none focus:border-blue-600"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border-b-2 border-blue-400 bg-transparent text-gray-700 py-2 focus:outline-none focus:border-blue-600"
                required
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Nội dung tin nhắn"
                rows={4}
                className="w-full border-b-2 border-blue-400 bg-transparent text-gray-700 py-2 focus:outline-none focus:border-blue-600 resize-none"
                required
              ></textarea>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition-all"
              >
                Gửi đi
              </button>
            </form>

            {status && (
              <p className="mt-4 text-center text-sm text-red-600">{status}</p>
            )}
          </div>

          <div className="mt-6 text-center text-blue-600 font-semibold text-lg">
            📞 +(84) 925 111 159
          </div>
        </div>
      </div>
    </div>
  );
}
