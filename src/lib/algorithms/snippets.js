export const LANGUAGES = [
    { id: "cpp", label: "C++" },
    { id: "python", label: "Python" },
    { id: "javascript", label: "JavaScript" },
    { id: "typescript", label: "TypeScript" },
];

// Implementation snippets per algorithm, per language. Kept deliberately small and
// faithful to the pseudocode shown in the visualizer.
export const SORT_CODE = {
    bubble: {
        cpp: [
            {
                title: "Bubble sort",
                code: `void bubbleSort(vector<int>& a) {
    int n = a.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - 1 - i; j++)
            if (a[j] > a[j + 1]) {
                swap(a[j], a[j + 1]);
                swapped = true;
            }
        if (!swapped) break;   // already sorted
    }
}`,
            },
        ],
        python: [
            {
                title: "Bubble sort",
                code: `def bubble_sort(a):
    n = len(a)
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swapped = True
        if not swapped:        # already sorted
            break
    return a`,
            },
        ],
        javascript: [
            {
                title: "Bubble sort",
                code: `function bubbleSort(a) {
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
    if (!swapped) break;   // already sorted
  }
  return a;
}`,
            },
        ],
        typescript: [
            {
                title: "Bubble sort",
                code: `function bubbleSort(a: number[]): number[] {
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
    if (!swapped) break;   // already sorted
  }
  return a;
}`,
            },
        ],
    },
    selection: {
        cpp: [
            {
                title: "Selection sort",
                code: `void selectionSort(vector<int>& a) {
    int n = a.size();
    for (int i = 0; i < n; i++) {
        int mn = i;
        for (int j = i + 1; j < n; j++)
            if (a[j] < a[mn]) mn = j;
        if (mn != i) swap(a[i], a[mn]);
    }
}`,
            },
        ],
        python: [
            {
                title: "Selection sort",
                code: `def selection_sort(a):
    n = len(a)
    for i in range(n):
        mn = i
        for j in range(i + 1, n):
            if a[j] < a[mn]:
                mn = j
        a[i], a[mn] = a[mn], a[i]
    return a`,
            },
        ],
        javascript: [
            {
                title: "Selection sort",
                code: `function selectionSort(a) {
  const n = a.length;
  for (let i = 0; i < n; i++) {
    let mn = i;
    for (let j = i + 1; j < n; j++) {
      if (a[j] < a[mn]) mn = j;
    }
    if (mn !== i) [a[i], a[mn]] = [a[mn], a[i]];
  }
  return a;
}`,
            },
        ],
        typescript: [
            {
                title: "Selection sort",
                code: `function selectionSort(a: number[]): number[] {
  const n = a.length;
  for (let i = 0; i < n; i++) {
    let mn = i;
    for (let j = i + 1; j < n; j++) {
      if (a[j] < a[mn]) mn = j;
    }
    if (mn !== i) [a[i], a[mn]] = [a[mn], a[i]];
  }
  return a;
}`,
            },
        ],
    },
    insertion: {
        cpp: [
            {
                title: "Insertion sort",
                code: `void insertionSort(vector<int>& a) {
    int n = a.size();
    for (int i = 1; i < n; i++) {
        int key = a[i], j = i - 1;
        while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = key;
    }
}`,
            },
        ],
        python: [
            {
                title: "Insertion sort",
                code: `def insertion_sort(a):
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a`,
            },
        ],
        javascript: [
            {
                title: "Insertion sort",
                code: `function insertionSort(a) {
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
  return a;
}`,
            },
        ],
        typescript: [
            {
                title: "Insertion sort",
                code: `function insertionSort(a: number[]): number[] {
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
  return a;
}`,
            },
        ],
    },
};
