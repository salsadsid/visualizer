const snippet = (title, code) => ({ title, code });

export const OPERATION_CODE = {
    access: {
        cpp: [snippet("Read by index", `int value = a[i];          // one address calculation, one read`)],
        python: [snippet("Read by index", `value = a[i]               # one address calculation, one read`)],
        javascript: [snippet("Read by index", `const value = a[i];        // one address calculation, one read`)],
        typescript: [snippet("Read by index", `const value: number = a[i];   // one address calculation, one read`)],
    },
    insert: {
        cpp: [
            snippet("Insert into a fixed-size array", `bool insertAt(int a[], int& n, int capacity, int index, int value) {
    if (n == capacity) return false;          // no room
    for (int j = n - 1; j >= index; j--)
        a[j + 1] = a[j];                      // shift right, from the end
    a[index] = value;
    n++;
    return true;
}`),
            snippet("With std::vector", `v.insert(v.begin() + index, value);       // still shifts everything after index`),
        ],
        python: [
            snippet("Insert into a fixed-size array", `def insert_at(a, n, index, value):
    if n == len(a):                           # no room
        return False
    for j in range(n - 1, index - 1, -1):
        a[j + 1] = a[j]                       # shift right, from the end
    a[index] = value
    return True`),
            snippet("With a list", `a.insert(index, value)                    # the list does the same shifting for you`),
        ],
        javascript: [
            snippet("Insert into a fixed-size array", `function insertAt(a, n, index, value) {
    if (n === a.length) return false;         // no room
    for (let j = n - 1; j >= index; j--) a[j + 1] = a[j];   // shift right, from the end
    a[index] = value;
    return true;
}`),
            snippet("With a JavaScript array", `a.splice(index, 0, value);                // the engine shifts everything after index`),
        ],
        typescript: [
            snippet("Insert into a fixed-size array", `function insertAt(a: (number | null)[], n: number, index: number, value: number): boolean {
    if (n === a.length) return false;         // no room
    for (let j = n - 1; j >= index; j--) a[j + 1] = a[j];   // shift right, from the end
    a[index] = value;
    return true;
}`),
            snippet("With a TypeScript array", `a.splice(index, 0, value);                // the engine shifts everything after index`),
        ],
    },
    delete: {
        cpp: [
            snippet("Delete from a fixed-size array", `int removeAt(int a[], int& n, int index) {
    int removed = a[index];
    for (int j = index; j < n - 1; j++)
        a[j] = a[j + 1];                      // shift left
    n--;
    return removed;
}`),
            snippet("With std::vector", `v.erase(v.begin() + index);               // shifts everything after index`),
        ],
        python: [
            snippet("Delete from a fixed-size array", `def remove_at(a, n, index):
    removed = a[index]
    for j in range(index, n - 1):
        a[j] = a[j + 1]                       # shift left
    return removed`),
            snippet("With a list", `removed = a.pop(index)                    # pop(0) is O(n); use collections.deque for a queue`),
        ],
        javascript: [
            snippet("Delete from a fixed-size array", `function removeAt(a, n, index) {
    const removed = a[index];
    for (let j = index; j < n - 1; j++) a[j] = a[j + 1];   // shift left
    return removed;
}`),
            snippet("With a JavaScript array", `const [removed] = a.splice(index, 1);     // shifts everything after index`),
        ],
        typescript: [
            snippet("Delete from a fixed-size array", `function removeAt(a: number[], n: number, index: number): number {
    const removed = a[index];
    for (let j = index; j < n - 1; j++) a[j] = a[j + 1];   // shift left
    return removed;
}`),
            snippet("With a TypeScript array", `const [removed] = a.splice(index, 1);     // shifts everything after index`),
        ],
    },
    search: {
        cpp: [snippet("Linear search", `int linearSearch(const int a[], int n, int target) {
    for (int i = 0; i < n; i++)
        if (a[i] == target) return i;
    return -1;                                // not found
}`)],
        python: [snippet("Linear search", `def linear_search(a, target):
    for i in range(len(a)):
        if a[i] == target:
            return i
    return -1                                 # not found (a.index(target) raises instead)`)],
        javascript: [snippet("Linear search", `function linearSearch(a, target) {
    for (let i = 0; i < a.length; i++)
        if (a[i] === target) return i;
    return -1;                                // not found (a.indexOf does the same)
}`)],
        typescript: [snippet("Linear search", `function linearSearch(a: number[], target: number): number {
    for (let i = 0; i < a.length; i++)
        if (a[i] === target) return i;
    return -1;                                // not found (a.indexOf does the same)
}`)],
    },
    reverse: {
        cpp: [snippet("Reverse in place", `void reverseInPlace(int a[], int n) {
    int lo = 0, hi = n - 1;
    while (lo < hi) {
        std::swap(a[lo], a[hi]);
        lo++;
        hi--;
    }
}`)],
        python: [snippet("Reverse in place", `def reverse_in_place(a):
    lo, hi = 0, len(a) - 1
    while lo < hi:
        a[lo], a[hi] = a[hi], a[lo]
        lo += 1
        hi -= 1`)],
        javascript: [snippet("Reverse in place", `function reverseInPlace(a) {
    let lo = 0, hi = a.length - 1;
    while (lo < hi) {
        [a[lo], a[hi]] = [a[hi], a[lo]];
        lo++;
        hi--;
    }
}`)],
        typescript: [snippet("Reverse in place", `function reverseInPlace(a: number[]): void {
    let lo = 0, hi = a.length - 1;
    while (lo < hi) {
        [a[lo], a[hi]] = [a[hi], a[lo]];
        lo++;
        hi--;
    }
}`)],
    },
};
