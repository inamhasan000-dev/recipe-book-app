'use client'
import { SessionProvider } from 'next-auth/react'
import React from 'react'
import AuthLayout from './AuthLayout'
import AppLayout from './AppLayout'
import { Toaster } from 'sonner';

const Layout = ({ children }) => {
  return (
    <>
      <SessionProvider>
        <AuthLayout>
          <div
            className='bg-cover bg-black '
            style={{
              backgroundImage:
                "url('https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')",
            }}
          >

            <AppLayout>

              {children}

              <Toaster theme='dark' />
            </AppLayout>
          </div>
        </AuthLayout>
      </SessionProvider>
    </>
  )
}

export default Layout