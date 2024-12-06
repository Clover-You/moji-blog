'use client'

import type { LinkProps } from '@nextui-org/react'
import { Avatar, Card, CardBody, CardFooter, CardHeader, Link, ScrollShadow, Skeleton, Tooltip } from '@nextui-org/react'
import { Octokit } from 'octokit'
import React, { useCallback, useEffect } from 'react'
import { useSessionStorage } from 'react-use'

interface GitHubTooltipAnchorPropsc extends LinkProps, React.PropsWithChildren {
  user: string
}

export function GitHubTooltipAnchor({ user, children: chrldren, target, href }: GitHubTooltipAnchorPropsc) {
  return (
    <Tooltip
      delay={250}
      showArrow
      placement="bottom"
      content={<TooltipContent user={user} />}
      classNames={{
        base: ['before:bg-default-200'],
        content: ['p-0', 'bg-transparent'],
      }}
    >
      <Link target={target ?? '_blank'} href={href}>{chrldren}</Link>
    </Tooltip>
  )
}

const octokit = new Octokit({ auth: process.env.GH_AUTHORIZE })

function TooltipContent({ user }: { user: string }) {
  const [info, setup] = React.useState<any>()
  const [isLoading, setLoading] = React.useState(false)
  const [data, setData] = useSessionStorage(`github/users/${user}`)

  const getUsers = useCallback(async (id: string) => {
    if (data) {
      setup(data)
      setLoading(true)
      return
    }

    try {
      setLoading(false)
      const res = await octokit.request('GET /users/{account_id}', {
        account_id: id,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      })

      setup(res.data)
      setData(res.data)
    }
    catch (err) {
      console.error(err)
    }
    finally {
      setLoading(true)
    }
  }, [setup, setLoading, setData, data])

  useEffect(() => {
    getUsers(user)
  }, [user, getUsers])

  return (
    <Card className="p-0 m-0">
      <CardHeader>
        <div className="flex gap-3 w-full">
          <Skeleton className="rounded-full" isLoaded={isLoading}>
            <Avatar isBordered radius="full" size="md" src={info?.avatar_url} />
          </Skeleton>
          <div className="flex flex-col justify-center flex-grow">
            <Skeleton className={`${!isLoading ? 'mb-2' : ''} min-w-16 h-4`} isLoaded={isLoading}>
              <h4 className="text-small font-semibold leading-none text-default-600">{info?.name}</h4>
            </Skeleton>
            <Skeleton isLoaded={isLoading} className="h-4 min-w-8">
              <h5 className="text-small tracking-tight text-default-500">
                @
                {info?.login}
              </h5>
            </Skeleton>
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-3 py-0">
        <ScrollShadow className="max-w-[300px] max-h-[100px]">
          <Skeleton isLoaded={isLoading} className="w-full min-h-10">
            <p className="text-small pl-px text-default-500 max-w-64">
              {info?.bio}
              {' '}
            </p>
          </Skeleton>
        </ScrollShadow>
      </CardBody>
      <CardFooter className="gap-3">
        <Skeleton isLoaded={isLoading}>
          <div className="flex gap-1">
            <p className="font-semibold text-default-600 text-small">{info?.following}</p>
            <p className=" text-default-500 text-small">Following</p>
          </div>
        </Skeleton>
        <Skeleton isLoaded={isLoading}>
          <div className="flex gap-1">
            <p className="font-semibold text-default-600 text-small">{info?.followers}</p>
            <p className="text-default-500 text-small">Followers</p>
          </div>
        </Skeleton>
      </CardFooter>
    </Card>
  )
}
