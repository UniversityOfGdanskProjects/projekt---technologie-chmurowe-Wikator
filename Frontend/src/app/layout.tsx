'use client';

import React from "react";
import Navbar from "@/app/navbar";
import { Toaster } from "react-hot-toast";

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main>
        {children}
      </main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 5000,
          success: {
            style: {
              fontSize: '1.2rem',
            }
          },
          error: {
            style: {
              fontSize: '1.2rem',
            }
          }
        }} />
    </>
  )
}
