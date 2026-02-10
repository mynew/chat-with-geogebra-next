"use client"

import Link from "next/link"
import { Calculator } from "lucide-react"

export default function ContactPage() {
  return (
    <>
      {/* Header (与首页风格一致) */}
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
            <a href="#features" className="hover:text-blue-600 transition">
              功能特性
            </a>
            <a href="#cases" className="hover:text-blue-600 transition">
              教学案例
            </a>
            <a href="#enterprise" className="hover:text-blue-600 transition">
              机构方案
            </a>
            <Link
              href="/chat"
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              立即体验
            </Link>
          </div>
        </div>
      </nav>

      {/* Main */}
      <div className="min-h-screen bg-slate-50 text-slate-900 pt-28 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
            <div className="grid md:grid-cols-2">
              {/* Left: Info */}
              <div className="p-10 bg-linear-to-b from-blue-600 to-blue-700 text-white">
                <h1 className="text-3xl font-extrabold mb-3">联系我们</h1>
                <p className="text-slate-100/90 mb-6">
                  如需产品支持、合作咨询或媒体联系，请使用下面任一方式联系我们。我们通常在1-2个工作日内回复。
                </p>

                <div className="space-y-4 text-sm">
                  <div>
                    <div className="text-slate-200/80">支持邮箱</div>
                    <div className="font-medium">contact@ivory.cafe</div>
                  </div>
                  <div>
                    <div className="text-slate-200/80">商务与合作</div>
                    <div className="font-medium">contact@ivory.cafe</div>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href="/"
                    className="inline-block bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm"
                  >
                    返回首页
                  </Link>
                </div>
              </div>

              {/* Right: Contact Methods */}
              <div className="p-8 md:p-10">
                <h2 className="text-2xl font-bold mb-4">联系方式</h2>

                <ul className="space-y-4 text-slate-700">
                  <li>
                    <div className="text-sm text-slate-500">支持邮箱</div>
                    <a
                      className="text-blue-600 font-medium"
                      href="mailto:contact@ivory.cafe"
                    >
                      contact@ivory.cafe
                    </a>
                  </li>
                  <li>
                    <div className="text-sm text-slate-500">商务与合作</div>
                    <a
                      className="text-blue-600 font-medium"
                      href="mailto:contact@ivory.cafe"
                    >
                      contact@ivory.cafe
                    </a>
                  </li>
                </ul>

                <div className="mt-6 text-sm text-slate-500">
                  我们会尊重并保护您的隐私。提交的任何信息仅用于处理您的请求。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer （与首页保持一致） */}
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
          © 2025 Chat-with-GeoGebra Inc. 保留所有权利。
        </div>
        <div className="mx-auto text-sm text-center">
          MADE WITH ❤️ BY{" "}
          <span className="font-bold">Ivory (full-stack-development)</span> &{" "}
          <span className="font-bold">Neal (algorithm)</span>.
        </div>
      </footer>
    </>
  );
}

