"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Calculator, Speech, School, Book } from "lucide-react"
import { useTranslation, type Locale } from "@/client/lib/i18n"
import Zoom from "react-medium-image-zoom"
import 'react-medium-image-zoom/dist/styles.css';
import Demo from "@/public/images/index/demo.svg"
import Image from "next/image"

export default function HomePage() {
  const router = useRouter()
  const [locale, setLocale] = useState<Locale>('zh-CN')
  const [user, setUser] = useState<any>(null)
  const { t } = useTranslation(locale)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navigation */}
      <nav className="fixed w-full z-50 transition-all duration-300 bg-white/70 backdrop-blur-md glass-effect py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Calculator className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-blue-900">
              Chat with GeoGebra
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
            <Link
              href="/support/contact"
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              联系我们
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              让数学 <br />
              <span className="text-blue-600">回归灵感</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              基于强大的 GeoGebra 数学引擎，只需通过自然语言描述，我们的 AI
              助手将为您生成精准的交互式图形。告别繁琐工具栏，让数学更直观。
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/chat"
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:scale-105 transition transform shadow-xl inline-block"
              >
                开始免费体验
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <i className="fas fa-check-circle text-green-500"></i>{" "}
                无需代码基础
              </span>
              <span className="flex items-center gap-1">
                <i className="fas fa-check-circle text-green-500"></i> 支持 3D
                渲染
              </span>
              <span className="flex items-center gap-1">
                <i className="fas fa-check-circle text-green-500"></i>{" "}
                一键导出图片
              </span>
            </div>
          </div>

          {/* Demo Panel */}
          <div className="relative animate-float">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
              <div className="bg-slate-100 px-4 py-3 flex items-center justify-between border-b border-slate-200">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Live Preview
                </div>
              </div>
              <div className="flex flex-col h-100">
                <div className="grow bg-white p-6 relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "radial-gradient(#cbd5e1 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  ></div>
                  <div className="absolute inset-0">
                    <Zoom>
                      <Image
                        src={Demo}
                        alt="Demo"
                        fill
                        className="object-contain object-center"
                      />
                    </Zoom>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-200">
                  <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-inner border border-slate-200">
                    <i className="fas fa-comment-dots text-blue-500 ml-2"></i>
                    <span className="text-sm text-slate-700 typewriter">
                      在平面直角坐标系中，F1，F2分别为双曲线C: 3x^2-y^2=a^2（a
                      {">"}
                      0）的左、右焦点，给过F2的直线l与双曲线C的右支交于A，B两点，当l与x轴垂直时，三角形ABF1的面积为12
                    </span>
                    <div className="ml-auto bg-blue-600 p-2 rounded-lg text-white">
                      <i className="fas fa-paper-plane text-xs"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Calculator className="text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Chat with GeoGebra
              </span>
            </div>
            <p className="max-w-sm mb-6">
              致力于用人工智能技术赋能数学教育，让每一位老师都能轻松通过语言创造生动的几何世界。
            </p>
            <div className="flex gap-4 text-xl">
              <Link
                href="/social/weixin"
                className="hover:text-white transition"
              >
                <i className="fab fa-weixin"></i>
              </Link>
              <Link
                href="/social/github"
                className="hover:text-white transition"
              >
                <i className="fab fa-github"></i>
              </Link>
              <Link
                href="/social/twitter"
                className="hover:text-white transition"
              >
                <i className="fab fa-twitter"></i>
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">支持</h4>
            <ul className="space-y-4 text-slate-400">
              <li>
                <Link
                  href="/support/contact"
                  className="hover:text-white transition"
                >
                  联系我们
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-sm text-center">
          © 2026 Chat-with-GeoGebra Inc. 保留所有权利。
        </div>
        <div className="mx-auto text-sm text-center">
          MADE WITH ❤️ BY{" "}
          <span className="font-bold">Ivory (full-stack-development)</span> &{" "}
          <span className="font-bold">Neal (algorithm)</span>.
        </div>
      </footer>
    </div>
  );
}

