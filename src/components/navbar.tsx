'use client'
import { Image, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from '@nextui-org/react'
import Link from 'next/link'

import React from 'react'
import { useTheme } from 'next-themes'
import { GitHubIcon } from '#/components/icons/github-icon'
import { GoTopBtn } from '#/components/gotop'

interface MojiNavbarProps {
  items?: {
    url: string
    target?: React.HTMLAttributeAnchorTarget
    iconClass?: string
    textColor?: string
    iconColor?: string
    label?: string
    iconSize?: string
  }[]
  logoText?: string
  logo?: string
}

export function MojiNavbar(props: MojiNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const theme = useTheme()

  function test() {
    theme.setTheme(theme.theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <>
      <Navbar
        maxWidth="full"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <Link href="/" color="foreground">
          <NavbarBrand>
            <Image src={props.logo} width={25} height={25} radius="none" />
            <p className="font-bold text-inherit ml-2">{props.logoText}</p>
          </NavbarBrand>
        </Link>

        <NavbarContent className="hidden sm:flex gap-4 navbar-content" justify="center">
          {props.items?.map((item, index) => {
            return (
              <NavbarItem key={index}>
                <Link color={item.textColor} href={item.url} target={item.target} className="flex gap-2">
                  {item.iconClass
                    ? <span className={`${item.iconClass} align-text-bottom !w-5 !h-5 text-center`} style={{ fontSize: item.iconSize ?? 20 }}></span>
                    : undefined}
                  {item.label ? <span>{item.label}</span> : undefined}
                </Link>
              </NavbarItem>
            )
          })}

          <NavbarItem>
            <div color="foreground" className="cursor-pointer" onClick={test}>
              <span className="icon-[ph--sun] dark:icon-[ph--moon] !w-5 !h-5 align-text-bottom"></span>
            </div>
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu className="navbar-content">
          <NavbarMenuItem>
            <Link color="foreground" href="/">
              Blog
            </Link>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <Link color="foreground" href="/about">
              About
            </Link>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <Link color="foreground" href="https://github.com/Clover-You" target="_blank" className="flex gap-2">
              <GitHubIcon className="w-[18px] text-center" fill="var(--font-color)" />
              <span>GitHub</span>
            </Link>
          </NavbarMenuItem>
        </NavbarMenu>

        <NavbarContent className="sm:hidden" justify="end">
          <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} />
        </NavbarContent>

        <div color="foreground" className="cursor-pointer sm:hidden" onClick={test}>
          <span className="icon-[ph--sun] dark:icon-[ph--moon] !w-5 !h-5 align-text-bottom"></span>
        </div>
      </Navbar>
      <GoTopBtn />
    </>
  )
}
