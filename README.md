This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Tool Recommend

Flowchart drawing: <https://www.iodraw.com/whiteboard/>

## Post Properties

| properties | type                | description                                                                                                                     | default | require | example                                         |
| ---------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------- | ------- | ----------------------------------------------- |
| title      | string              | display as post title instead of using 'h1'                                                                                     |         | √       | title: Golang language fundamentals study notes |
| tags       | string\[\]          | post tags                                                                                                                       | `[]`    | ×       | tags:<br>  - learn<br>  - golang                |
| lang       | string              | post read language. It can be auto switched lang to the system language.                                                        |         | ×       | lang: en                                        |
| date       | yyyy-MM-dd HH:mm:ss | post first publish datetime                                                                                                     |         | √       | date: 2024-04-15 10:34:30                       |
| categories | string\[\]          | post category                                                                                                                   |         | ×       | categories:<br>  - notes                        |
| pid        | string              | post id, each post should have a unique id                                                                                      |         | √       | pid: 6f604b36-5d8f-4227-ac85-db43927cf53b       |
| last-edit  | yyyy-MM-dd HH:mm:ss | the date of the last edit of the post, if not, used date property value. If it is more than 3 months, the post may be outdated. | `#date` | ×       | last-edit: 2024-09-15 14:23:49                  |
| duration   | string              | estimated reading time                                                                                                          | -       | ×       | duration: 15min                                 |
| author      | string              | post author                                                                                                                      |         | x       | author: Clover                                   |

## Getting Started

First, run the development server:

```bash

pnpm dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
