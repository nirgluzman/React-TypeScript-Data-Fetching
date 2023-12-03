// Generic "get" function.
// "Type Casting" takes place right inside the 'get' function to "force" TypeScript
// to treat data as type T.

// adjusting the function to accept a second parameter, zodSchema, of type ZodType.
// https://www.udemy.com/course/react-typescript-the-practical-guide/learn/lecture/40470748#questions/20931846/

import {z} from 'zod';

export async function get<T>(url: string, zodSchema: z.ZodType<T>) {
	const response = await fetch(url, {
		method: 'GET',
	});

	// 'fetch' throw an error if it fails to send the request, e.g. there is no connectivity (bad url).
	// 'fetch' does not throw an error if we get an error response.
	if (!response.ok) {
		throw new Error('Failed to fetch data.');
	}

	const data = (await response.json()) as unknown; // type safety -> 'unknown' forces us to explicity set our own types.

	// return data as T; // "Type Casting" takes place right inside the 'get' function to "force" TypeScript to treat data as type T.

	try {
		return zodSchema.parse(data); // use Zod schema to parse the received response.
	} catch (error) {
		// Zod throws an error if parsing the data fails.
		// Therefore, TypeScript knows that if it succeeds, the data will be a value of the type defined by the Zod schema.
		// I.e., TypeScript will narrow the type to be of that type.
		throw new Error('Invalid data received from server!');
	}
}
