import {useEffect, useState, type ReactNode} from 'react';

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

function App() {
	const [fetchedPosts, setFetchPosts] = useState<BlogPost[]>();

	useEffect(() => {
		async function fetchPosts() {
			const rawData = (await get(
				'https://jsonplaceholder.typicode.com/posts'
			)) as RawDataBlogPost[];

			const blogPosts: BlogPost[] = rawData.map((rawPost) => {
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
