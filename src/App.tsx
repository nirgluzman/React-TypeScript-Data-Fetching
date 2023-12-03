import {useEffect, useState, type ReactNode} from 'react';

import {z} from 'zod';

import BlogPosts, {type BlogPost} from './components/BlogPosts.tsx';
import {get} from './util/http.ts';
import fetchingImg from './assets/data-fetching.png';

// raw data type definition we fetch from JSONPlaceholder website, https://jsonplaceholder.typicode.com/guide/
type RawDataBlogPost = {
	id: number;
	userId: number;
	title: string;
	body: string;
};

// Zod schema for a single blog post.
// We define it outside of App component function, since this doesn't need to be re-created all the time.
const rawDataBlogPostSchema = z.object({
	id: z.number(),
	userId: z.number(),
	title: z.string(),
	body: z.string(),
});

// z.array() is a Zod method that creates a new schema based on another schema.
// As the name suggests, it's simply an array containing the expected objects.
const expectedResponseDataSchema = z.array(rawDataBlogPostSchema);

function App() {
	const [fetchedPosts, setFetchPosts] = useState<BlogPost[]>();

	useEffect(() => {
		async function fetchPosts() {
			// const rawData = (await get(
			// 	'https://jsonplaceholder.typicode.com/posts'
			// )) as RawDataBlogPost[]; // 'as' for type casting.

			// // using a "generic" get function with type casting.
			// const rawData = await get<RawDataBlogPost[]>('https://jsonplaceholder.typicode.com/posts');

			// try {
			// 	const rawData = await get('https://jsonplaceholder.typicode.com/posts');

			// 	// Type casting with "as" is NOT needed!
			// 	// Instead, here, TypeScript "knows" that parsedData will be an array with objects as defined by the above schema.
			// 	// It will throw an error if rawData is not in line with the defined schema (e.g., if a property is missing or of a different value type).
			// 	// This is why we use try/catch block.
			// 	const parsedData = expectedResponseDataSchema.parse(rawData);

			// 	const blogPosts: BlogPost[] = parsedData.map((rawPost) => {
			// 		return {
			// 			id: rawPost.id,
			// 			title: rawPost.title,
			// 			text: rawPost.body,
			// 		};
			// 	});

			// 	setFetchPosts(blogPosts);
			// } catch (error) {
			// 	console.log(error);
			// }

			// zodSchema validation is done inside 'get' function.
			const data = await get(
				'https://jsonplaceholder.typicode.com/posts',
				z.array(rawDataBlogPostSchema)
			);

			const blogPosts: BlogPost[] = data.map((rawPost) => {
				return {
					id: rawPost.id,
					title: rawPost.title,
					text: rawPost.body,
				};
			});

			setFetchPosts(blogPosts);
		}

		fetchPosts();
	}, []);

	let content: ReactNode;
	if (fetchedPosts) {
		content = <BlogPosts posts={fetchedPosts} />;
	}

	return (
		<main>
			<img
				src={fetchingImg}
				alt='An abstract image depicting a data fetching process.'
			/>
			{content}
		</main>
	);
}

export default App;
