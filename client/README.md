
### Frontend

#### Framework

Considering a social media site might want to be searchable from search engines (maybe when we add the feature to create posts in the future SEO would be helpful), the frontend is built with Next 13 with the app directory. Next 13 is drastically different from the previous Next js versions. It implemented React 18's server components. Server components allow for a small bundle size which reduces load time. 

#### UI

On top, tailwind is used to add styling to the app. Tailwind makes it easy to configure overall app design -- theme colors, spacing, typography etc.. It also reduces the amount of css you need to write which makes development easier and less, if not none stylesheet to maintain.

#### Data fetching

useSWR is used to perform 90% of the data fetching. useSWR saves you from having to using multiple hooks `useEffect`, `useState`, to handling data fetching and handling the result and error. More importantly, useSWR helps implement client-side caching -- it serves data fetching result from previously stored cache, while revalidating it in the background -- which in turns provides a better user experience.

#### Form validation

Considering there are no complex form validation logic in this app, form validation is handled by util functions written in simple JavaScript to check if required fields are submitted. For more complex form validation, `react-hook-form` is a good package to use. It uses `ref` to validate input, which prevent unnecessary re-renders.
