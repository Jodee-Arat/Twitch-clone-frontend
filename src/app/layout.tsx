import { GeistSans } from "geist/font/sans";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
} from "@/libs/constants/seo.constants";
import { APP_URL } from "@/libs/constants/url.constant";

import { ApolloClientProvider } from "@/providers/ApolloClientProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ToastProvider } from "@/providers/ToastProvider";

import "../styles//globals.css";

export const metadata: Metadata = {
  title: {
    absolute: SITE_NAME,
    template: `%s - ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(APP_URL),
  applicationName: SITE_NAME,
  authors: [
    {
      name: "Jodee-Arat",
      url: new URL("https://github.com/Jodee-Arat"),
    },
  ],
  keywords: SITE_KEYWORDS,
  generator: "Next.js",
  creator: "JodeeAratxd",
  publisher: "JodeeAratxd",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/touch-icons/256x256.png",
    other: {
      rel: "/touch-icons",
      url: "/touch-icons/256x256.png",
      sizes: "256x256",
      type: "image/png",
    },
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    emails: ["obgon02@bk.ru"],
    url: new URL(APP_URL),
    siteName: SITE_NAME,
    images: [
      {
        url: "/touch-icons/512x512.png",
        width: 512,
        height: 512,
        alt: SITE_NAME,
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/touch-icons/512x512.png",
        width: 512,
        height: 512,
        alt: SITE_NAME,
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={GeistSans.variable}>
        <ApolloClientProvider>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              disableTransitionOnChange
            >
              <ToastProvider /> {children}
            </ThemeProvider>
          </NextIntlClientProvider>
        </ApolloClientProvider>
      </body>
    </html>
  );
}
