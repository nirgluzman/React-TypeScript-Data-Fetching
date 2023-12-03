// Generic "get" function.
// "Type Casting" takes place right inside the 'get' function to "force" TypeScript
// to treat data as type T.

export async function get<T>(url: string) {
	const response = await fetch(url, {
		method: 'GET',
	});

	// 'fetch' throw an error if it fails to send the request, e.g. there is no connectivity (bad url).
	// 'fetch' does not throw an error if we get an error response.
	if (!response.ok) {
		throw new Error('Failed to fetch data.');
	}

	const data = (await response.json()) as unknown; // type safety -> 'unknown' forces us to explicity set our own types.

	return data as T; // "Type Casting" takes place right inside the 'get' function to "force" TypeScript to treat data as type T.
}
