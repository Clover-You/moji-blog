'use client'
import { Image, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from '@nextui-org/react'
import Link from 'next/link'

import React from 'react'
import { GitHubIcon } from '#/components/icons/github-icon'
import { GoTopBtn } from '#/components/gotop'
import { useToggleTheme } from '#/hooks/useToggleTheme'

interface MojiNavbarProps {
  items?: {
    url: string
    target?: React.HTMLAttributeAnchorTarget
    iconClass?: string
    textColor?: string
    iconColor?: string
    label?: string
    iconSize?: string
    title?: string
  }[]
  logoText?: string
  logo?: string
}

export function MojiNavbar({ items, logoText, logo }: MojiNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const { toggle } = useToggleTheme()

  return (
    <>
      <Navbar
        maxWidth="full"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <Link href="/" color="foreground">
          <NavbarBrand>
            <Image src={logo} width={25} height={25} radius="none" />
            <p className="font-bold text-inherit ml-2">{logoText}</p>
          </NavbarBrand>
        </Link>

        <NavbarContent className="hidden sm:flex gap-4 navbar-content" justify="center">
          {items?.map((item, index) => {
            return (
              <NavbarItem key={item.label ?? index}>
                <Link color={item.textColor} href={item.url} target={item.target} className="flex gap-2" title={item.title ?? item.label}>
                  {item.iconClass
                    ? <span className={`${item.iconClass} align-text-bottom !w-5 !h-5 text-center`} style={{ fontSize: item.iconSize ?? 20 }}></span>
                    : undefined}
                  {item.label ? <span>{item.label}</span> : undefined}
                </Link>
              </NavbarItem>
            )
          })}

          <NavbarItem>
            <div color="foreground" className="cursor-pointer" onClick={toggle}>
              <span className="icon-[ph--sun] dark:icon-[ph--moon] !w-5 !h-5 align-text-bottom"></span>
            </div>
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu className="navbar-content">
          <NavbarMenuItem>
            <Link color="foreground" href="/" title="Blog">
              Blog
            </Link>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <Link color="foreground" href="/about" title="About">
              About
            </Link>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <Link color="foreground" href="https://github.com/Clover-You" target="_blank" className="flex gap-2" title="GitHub">
              <GitHubIcon className="w-[18px] text-center" fill="var(--font-color)" />
              <span>GitHub</span>
            </Link>
          </NavbarMenuItem>
        </NavbarMenu>

        <NavbarContent className="sm:hidden" justify="end">
          <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} />
        </NavbarContent>

        <div color="foreground" className="cursor-pointer sm:hidden" onClick={toggle}>
          <span className="icon-[ph--sun] dark:icon-[ph--moon] !w-5 !h-5 align-text-bottom"></span>
        </div>
      </Navbar>
      <GoTopBtn />
    </>
  )
}
