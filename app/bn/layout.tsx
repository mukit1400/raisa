import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "রাইসা - আপনার বাঙালি এআই বন্ধু | ইংরেজি বা বাংলায় চ্যাট করুন",
  description:
    "রাইসা, পার্থো এবং রুদ্রর সাথে চ্যাট করুন - আপনার বন্ধুত্বপূর্ণ বাঙালি এআই সহকারী। ইংরেজি বা বাংলায় স্বাভাবিক কথোপকথনের মাধ্যমে বাঙালি সংস্কৃতি অনুভব করুন।",
  keywords: ["বাংলা এআই", "বাংলা চ্যাটবট", "এআই চ্যাট", "বাংলা ভাষা", "বাংলা শিখুন", "বাংলা সংস্কৃতি"],
  alternates: {
    canonical: "https://raisa.im/bn",
    languages: {
      en: "https://raisa.im",
      bn: "https://raisa.im/bn",
    },
  },
  openGraph: {
    title: "রাইসা - আপনার বাঙালি এআই বন্ধু | ইংরেজি বা বাংলায় চ্যাট করুন",
    description: "আপনার বন্ধুত্বপূর্ণ বাঙালি এআই সহকারী - রাইসা, পার্থো এবং রুদ্রর সাথে চ্যাট করুন। কথোপকথনের মাধ্যমে বাঙালি সংস্কৃতি অনুভব করুন।",
    url: "https://raisa.im/bn",
    locale: "bn_BD",
  },
}

export default function BengaliLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div lang="bn">{children}</div>
}
