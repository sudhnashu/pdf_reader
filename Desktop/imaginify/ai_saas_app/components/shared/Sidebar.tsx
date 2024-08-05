"use client"
import { navLinks } from '@/constants'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'
import { Component } from 'react'



const Sidebar = () => {
  //usePathname is a Client Component hook that lets you read the current URL's pathname.
  const pathname = usePathname();

  return (
    // aside is a HTML Component which means that something is on the side 
    <aside className="sidebar">
      <div className="flex size-full flex-col gap-4">
        {/* Logo which acts as a Link  */}
        <Link href="/" className="sidebar-logo">
          <Image src="/assets/images/logo-text.svg" alt="logo" width={180} height={28} />
        </Link>

        <nav className="sidebar-nav">
          {/* this is shown only when we are signed in  */}
          <SignedIn>
            <ul className="sidebar-nav_elements">
              {/* putting only the top 6 elements using slice  */}
              {navLinks.slice(0, 6).map((link) => {
                // check if the we are on the same path as that of link
                const isActive = link.route === pathname

                return (
                  <li key={link.route} className={`sidebar-nav_element group ${
                    isActive ? 'bg-purple-gradient text-white' : 'text-gray-700'
                  }`}>
                    <Link className="sidebar-link" href={link.route}>
                      <Image 
                        src={link.icon}
                        alt="logo"
                        width={24}
                        height={24}
                        className={`${isActive && 'brightness-200'}`}
                      />
                      {link.label}
                    </Link>
                  </li>
                )
              })}
              </ul>

             {/* navlink:
             {
       label: "Profile",
       route: "/profile",
      icon: "/assets/icons/profile.svg",
          }, */}
            <ul className="sidebar-nav_elements">
              {/* putting the elements at 6 index till the end  */}
              {navLinks.slice(6).map((link) => {
                const isActive = link.route === pathname

                return (
                  <li key={link.route} className={`sidebar-nav_element group ${
                    isActive ? 'bg-purple-gradient text-white' : 'text-gray-700'
                  }`}>
                    <Link className="sidebar-link" href={link.route}>
                      <Image 
                        src={link.icon}
                        alt="logo"
                        width={24}
                        height={24}
                        className={`${isActive && 'brightness-200'}`}
                      />
                      {link.label}
                    </Link>
                  </li>
                )
              })}

              <li className="flex-center cursor-pointer gap-2 p-4">
              {/* showName: Controls if the user name is displayed next to the user image button. */}
                <UserButton afterSignOutUrl='/' showName />
              </li>
            </ul>
          </SignedIn>
           {/* Content inside it will be displayed when we are signed Out */}
          <SignedOut>
            {/* here we are using asChild because we cannot use button inside button  */}
            <Button asChild className="button bg-purple-gradient bg-cover">
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </nav>
      </div>
    </aside>
  )
}


export default Sidebar