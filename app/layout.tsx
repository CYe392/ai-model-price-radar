import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "ModelScope｜AI 模型价格雷达", description: "聚合云服务商 AI API 价格、行业动态与场景选型建议。" };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-CN"><body>{children}</body></html>}
