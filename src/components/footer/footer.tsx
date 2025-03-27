import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="m-auto mt-4 bg-white py-3">
      <div className="grid grid-cols-3 mx-auto max-w-screen-xl p-2">
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/logo.png"
            alt="Website Logo"
            width={60}
            height={60}
            className="rounded-full"
            priority
          />
          <p className="text-3xl font-semibold">Tea Bliss</p>
          <p className="text-sm font-extralight mt-4">
            ĐVHD: CVPM Quang Trung, Quận 12, TP. HCM
          </p>
        </div>
        <div className="flex justify-between">
          {/* Cột 2: Điều hướng nhanh */}
          <nav>
            <h2 className="text-lg font-semibold">Điều hướng</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/gioi-thieu" className="hover:text-rose-500">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/san-pham" className="hover:text-rose-500">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-rose-500">
                  Bài viết
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="hover:text-rose-500">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </nav>

          {/* Cột 3: Chính sách & Điều khoản */}
          <nav>
            <h2 className="text-lg font-semibold">Chính sách</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/chinh-sach-doi-tra"
                  className="hover:text-rose-500"
                >
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach-van-chuyen"
                  className="hover:text-rose-500"
                >
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link href="/bao-mat" className="hover:text-rose-500">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  href="/dieu-khoan-su-dung"
                  className="hover:text-rose-500"
                >
                  Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="text-end">
          <nav>
            <h2 className="text-lg font-semibold">Nhận thanh toán</h2>
          </nav>
        </div>
      </div>
      <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
      <div className="grid grid-cols-3 mx-auto max-w-screen-xl p-2 mt-4">
        <div className="text-xs font-thin text-left">
          Copyright © 2025 - Tea Bliss{" "}
        </div>
        <div>
          <ul className="flex gap-2 justify-center">
            <li>
              <Link href={""}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="20"
                  height="20"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#2962ff"
                    d="M15,36V6.827l-1.211-0.811C8.64,8.083,5,13.112,5,19v10c0,7.732,6.268,14,14,14h10	c4.722,0,8.883-2.348,11.417-5.931V36H15z"
                  ></path>
                  <path
                    fill="#eee"
                    d="M29,5H19c-1.845,0-3.601,0.366-5.214,1.014C10.453,9.25,8,14.528,8,19	c0,6.771,0.936,10.735,3.712,14.607c0.216,0.301,0.357,0.653,0.376,1.022c0.043,0.835-0.129,2.365-1.634,3.742	c-0.162,0.148-0.059,0.419,0.16,0.428c0.942,0.041,2.843-0.014,4.797-0.877c0.557-0.246,1.191-0.203,1.729,0.083	C20.453,39.764,24.333,40,28,40c4.676,0,9.339-1.04,12.417-2.916C42.038,34.799,43,32.014,43,29V19C43,11.268,36.732,5,29,5z"
                  ></path>
                  <path
                    fill="#2962ff"
                    d="M36.75,27C34.683,27,33,25.317,33,23.25s1.683-3.75,3.75-3.75s3.75,1.683,3.75,3.75	S38.817,27,36.75,27z M36.75,21c-1.24,0-2.25,1.01-2.25,2.25s1.01,2.25,2.25,2.25S39,24.49,39,23.25S37.99,21,36.75,21z"
                  ></path>
                  <path
                    fill="#2962ff"
                    d="M31.5,27h-1c-0.276,0-0.5-0.224-0.5-0.5V18h1.5V27z"
                  ></path>
                  <path
                    fill="#2962ff"
                    d="M27,19.75v0.519c-0.629-0.476-1.403-0.769-2.25-0.769c-2.067,0-3.75,1.683-3.75,3.75	S22.683,27,24.75,27c0.847,0,1.621-0.293,2.25-0.769V26.5c0,0.276,0.224,0.5,0.5,0.5h1v-7.25H27z M24.75,25.5	c-1.24,0-2.25-1.01-2.25-2.25S23.51,21,24.75,21S27,22.01,27,23.25S25.99,25.5,24.75,25.5z"
                  ></path>
                  <path
                    fill="#2962ff"
                    d="M21.25,18h-8v1.5h5.321L13,26h0.026c-0.163,0.211-0.276,0.463-0.276,0.75V27h7.5	c0.276,0,0.5-0.224,0.5-0.5v-1h-5.321L21,19h-0.026c0.163-0.211,0.276-0.463,0.276-0.75V18z"
                  ></path>
                </svg>
              </Link>
            </li>
            <li>
              <Link href={""}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="20"
                  height="20"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#039be5"
                    d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"
                  ></path>
                  <path
                    fill="#fff"
                    d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"
                  ></path>
                </svg>
              </Link>
            </li>
            <li>
              <Link href={""}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="20"
                  height="20"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#212121"
                    fillRule="evenodd"
                    d="M10.904,6h26.191C39.804,6,42,8.196,42,10.904v26.191 C42,39.804,39.804,42,37.096,42H10.904C8.196,42,6,39.804,6,37.096V10.904C6,8.196,8.196,6,10.904,6z"
                    clipRule="evenodd"
                  ></path>
                  <path
                    fill="#ec407a"
                    fillRule="evenodd"
                    d="M29.208,20.607c1.576,1.126,3.507,1.788,5.592,1.788v-4.011 c-0.395,0-0.788-0.041-1.174-0.123v3.157c-2.085,0-4.015-0.663-5.592-1.788v8.184c0,4.094-3.321,7.413-7.417,7.413 c-1.528,0-2.949-0.462-4.129-1.254c1.347,1.376,3.225,2.23,5.303,2.23c4.096,0,7.417-3.319,7.417-7.413L29.208,20.607L29.208,20.607 z M30.657,16.561c-0.805-0.879-1.334-2.016-1.449-3.273v-0.516h-1.113C28.375,14.369,29.331,15.734,30.657,16.561L30.657,16.561z M19.079,30.832c-0.45-0.59-0.693-1.311-0.692-2.053c0-1.873,1.519-3.391,3.393-3.391c0.349,0,0.696,0.053,1.029,0.159v-4.1 c-0.389-0.053-0.781-0.076-1.174-0.068v3.191c-0.333-0.106-0.68-0.159-1.03-0.159c-1.874,0-3.393,1.518-3.393,3.391 C17.213,29.127,17.972,30.274,19.079,30.832z"
                    clipRule="evenodd"
                  ></path>
                  <path
                    fill="#fff"
                    fillRule="evenodd"
                    d="M28.034,19.63c1.576,1.126,3.507,1.788,5.592,1.788v-3.157 c-1.164-0.248-2.194-0.856-2.969-1.701c-1.326-0.827-2.281-2.191-2.561-3.788h-2.923v16.018c-0.007,1.867-1.523,3.379-3.393,3.379 c-1.102,0-2.081-0.525-2.701-1.338c-1.107-0.558-1.866-1.705-1.866-3.029c0-1.873,1.519-3.391,3.393-3.391 c0.359,0,0.705,0.056,1.03,0.159V21.38c-4.024,0.083-7.26,3.369-7.26,7.411c0,2.018,0.806,3.847,2.114,5.183 c1.18,0.792,2.601,1.254,4.129,1.254c4.096,0,7.417-3.319,7.417-7.413L28.034,19.63L28.034,19.63z"
                    clipRule="evenodd"
                  ></path>
                  <path
                    fill="#81d4fa"
                    fillRule="evenodd"
                    d="M33.626,18.262v-0.854c-1.05,0.002-2.078-0.292-2.969-0.848 C31.445,17.423,32.483,18.018,33.626,18.262z M28.095,12.772c-0.027-0.153-0.047-0.306-0.061-0.461v-0.516h-4.036v16.019 c-0.006,1.867-1.523,3.379-3.393,3.379c-0.549,0-1.067-0.13-1.526-0.362c0.62,0.813,1.599,1.338,2.701,1.338 c1.87,0,3.386-1.512,3.393-3.379V12.772H28.095z M21.635,21.38v-0.909c-0.337-0.046-0.677-0.069-1.018-0.069 c-4.097,0-7.417,3.319-7.417,7.413c0,2.567,1.305,4.829,3.288,6.159c-1.308-1.336-2.114-3.165-2.114-5.183 C14.374,24.749,17.611,21.463,21.635,21.38z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-xs font-thin text-end">Việt Nam</div>
      </div>
    </footer>
  );
}
