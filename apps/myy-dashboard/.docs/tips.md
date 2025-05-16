# Tips

## Async Request APIs (Breaking Change)
In traditional Server-Side Rendering, the server waits for a request before rendering any content. However, not all components depend on request-specific data, so it's unnecessary to wait for the request to render them. Ideally, the server would prepare as much as possible before a request arrives. To enable this, and set the stage for future optimizations, we need to know when to wait for the request.

Therefore, we are transitioning APIs that rely on request-specific data—such as headers, cookies, params, and searchParams—to be asynchronous.


import { cookies } from 'next/headers';
 
export async function AdminPanel() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
 
  // ...
}
This is a breaking change and affects the following APIs:

cookies
headers
draftMode
params in layout.js, page.js, route.js, default.js, generateMetadata, and generateViewport
searchParams in page.js
For an easier migration, these APIs can temporarily be accessed synchronously, but will show warnings in development and production until the next major version. A codemod is available to automate the migration: