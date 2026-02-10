"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/client/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/client/components/ui/card"
import { useTranslation, type Locale } from "@/client/lib/i18n"
import { Calculator, Home, Search, ArrowLeft, Globe } from "lucide-react"

export default function NotFound() {
  const [locale, setLocale] = useState<Locale>("zh-CN")
  const { t } = useTranslation(locale)

  const toggleLocale = () => {
    setLocale((prev) => (prev === "zh-CN" ? "en-US" : "zh-CN"))
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Calculator className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Chat with GeoGebra</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleLocale}>
              <Globe className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-8">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto relative">
              <div className="text-9xl font-bold text-primary/20 select-none">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="h-20 w-20 text-primary/60" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">
              {locale === "zh-CN" ? "页面未找到" : "Page Not Found"}
            </CardTitle>
            <CardDescription className="text-lg">
              {locale === "zh-CN"
                ? "抱歉，您访问的页面不存在或已被移除。"
                : "Sorry, the page you're looking for doesn't exist or has been moved."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link href="/">
                  <Home className="h-5 w-5" />
                  {locale === "zh-CN" ? "返回首页" : "Go Home"}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2" onClick={() => window.history.back()}>
                <span className="cursor-pointer">
                  <ArrowLeft className="h-5 w-5" />
                  {locale === "zh-CN" ? "返回上一页" : "Go Back"}
                </span>
              </Button>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground text-center">
                {locale === "zh-CN" ? (
                  <>
                    如果您认为这是一个错误，请{" "}
                    <a href="https://github.com/tiwe0/chat-with-geogebra/issues" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                      报告问题
                    </a>
                  </>
                ) : (
                  <>
                    If you believe this is an error, please{" "}
                    <a href="https://github.com/tiwe0/chat-with-geogebra/issues" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                      report an issue
                    </a>
                  </>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
