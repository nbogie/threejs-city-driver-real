/** Given a number, n, and a function, f, which creates an object (or primitive) of type T,
 * create an array of n instances of those values, by repeatedly calling the function f and 
 * collecting its return values in an array.
 * @param n number of items to create
 * @param creationFunction function to call, n times
 * @returns array of n items
 
 */
export function collect<T>(n: number, creationFunction: (n: number) => T): T[] {
    const arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(creationFunction(i))
    }
    return arr;
}