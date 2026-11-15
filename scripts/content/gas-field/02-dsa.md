=== subject gf-dsa | Data Structures & Algorithms
=== topic algorithm-complexity | 3.1 Best and worst case complexities | BG_SAE:Q4, RP:Q2
> **{{BG_SAE:Q4}}**
>
> নিচের Algorithm গুলোর Worst case Complexity লিখ: Bubble Sort, Quick Sort, Merge Sort, Selection Sort, Insertion Sort.

> **{{RP:Q2}}**
>
> Write the best and worst case complexity of binary search, quick sort and DFS.

### Answer

| Algorithm | Best | Average | Worst | Note |
|---|---|---|---|---|
| Bubble sort | O(n) | O(n²) | **O(n²)** | Best case needs the "no swap → stop" flag |
| Selection sort | O(n²) | O(n²) | **O(n²)** | Always scans the whole unsorted part |
| Insertion sort | O(n) | O(n²) | **O(n²)** | Best on already-sorted input |
| Merge sort | O(n log n) | O(n log n) | **O(n log n)** | Needs O(n) extra space |
| Quick sort | O(n log n) | O(n log n) | **O(n²)** | Worst when the pivot is always the smallest or largest (see 3.9) |
| Binary search | O(1) | O(log n) | **O(log n)** | Best: the key is the first middle element |
| DFS | O(V + E) | O(V + E) | **O(V + E)** | With an adjacency list; O(V²) with an adjacency matrix |

DFS has no real best or worst case: a full traversal always touches every vertex and edge once.

=== topic bfs-dfs-graph | 3.2 BFS and DFS trees of a directed graph | BG_AE:Q2
> **{{BG_AE:Q2}}**
>
> Make the DFS and BFS trees of the graph below. When traversing, take vertices in alphabetical order.

```figure
digraph
```

### BFS from A (queue, neighbours in alphabetical order)

| Step | Dequeue | Newly discovered | Queue after |
|---|---|---|---|
| 1 | A | B | B |
| 2 | B | C | C |
| 3 | C | D, E, F | D E F |
| 4 | D | — (E, F already seen) | E F |
| 5 | E | — | F |
| 6 | F | — | empty |

**BFS order: A B C D E F.** Tree edges: A→B, B→C, C→D, C→E, C→F.

### DFS from A (go as deep as possible, alphabetical first)

| Step | Stack (top on right) | Action |
|---|---|---|
| 1 | A | visit A → B |
| 2 | A B | visit B → C |
| 3 | A B C | visit C → first neighbour D |
| 4 | A B C D | visit D → first unvisited neighbour E |
| 5 | A B C D E | E has no outgoing edge → back to D |
| 6 | A B C D | next unvisited neighbour of D: F |
| 7 | A B C D F | F's neighbours D, E already visited → back |
| 8 | — | unwind D, C, B, A |

**DFS order: A B C D E F.** Tree edges: A→B, B→C, C→D, D→E, D→F.

```figure
bfs-dfs-trees
```

Same visiting order, **different trees**: BFS is wide and shallow (C is the parent of D, E and F), while DFS is narrow and deep (D is the parent of E and F).

=== topic bfs-dfs-binary-tree | 3.3 BFS and DFS of a binary tree | BP:Q5
> **{{BP:Q5}}**
>
> What are BFS and DFS for the binary tree below?

```figure
binary-tree
```

### Answer

- **BFS** (breadth-first, also called *level order*) visits level by level using a **queue**.
- **DFS** (depth-first) goes down one branch fully before the next, using **recursion or a stack**. On a binary tree it comes in three orders.

| Traversal | Rule | Order |
|---|---|---|
| BFS / level order | level 0, then 1, then 2 | **1 2 3 4 5** |
| DFS pre-order | Root → Left → Right | **1 2 4 5 3** |
| DFS in-order | Left → Root → Right | **4 2 5 1 3** |
| DFS post-order | Left → Right → Root | **4 5 2 3 1** |

=== topic hashing-linear-probing | 3.4 Hashing with linear probing | JG_AE:Q5
> **{{JG_AE:Q5}}**
>
> A hash function h(x) = x % 11 is given. Find the location of keys 18, 41, 22, 44, 32, 31, 73, 55. Use linear probing as the collision resolution technique.

### Answer

The table has 11 slots (0–10). **Linear probing:** if slot h(x) is taken, try h(x)+1, h(x)+2, … wrapping round after slot 10.

| Key | x % 11 | Slots tried | Stored at |
|---|---|---|---|
| 18 | 7 | 7 | **7** |
| 41 | 8 | 8 | **8** |
| 22 | 0 | 0 | **0** |
| 44 | 0 | 0 (22) → 1 | **1** |
| 32 | 10 | 10 | **10** |
| 31 | 9 | 9 | **9** |
| 73 | 7 | 7, 8, 9, 10, 0, 1 all full → 2 | **2** |
| 55 | 0 | 0, 1, 2 full → 3 | **3** |

### Final table

| Slot | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Key | 22 | 44 | 73 | 55 | – | – | – | 18 | 41 | 31 | 32 |

Key 73 needed 6 probes. That is **primary clustering**, the main weakness of linear probing; quadratic probing or double hashing spread keys out better.

=== topic binary-search | 3.5 Binary search: program, trace, recurrence | BO_22:Q1, BO_22:Q8
> **{{BO_22:Q1}}**
>
> Write a C/C++ program for binary search.

> **{{BO_22:Q8}}**
>
> Find the recurrence equation of binary search and solve it.

### Program (iterative, array must be sorted)

```c
#include <stdio.h>

int binarySearch(const int a[], int n, int key) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;   /* avoids int overflow */
        if (a[mid] == key) return mid;
        if (a[mid] < key) low = mid + 1;    /* key is in the right half */
        else high = mid - 1;                /* key is in the left half */
    }
    return -1;                              /* not found */
}

int main(void) {
    int a[] = {5, 12, 18, 23, 31, 44, 52, 67, 80};
    printf("%d\n", binarySearch(a, 9, 44));   /* prints 5 */
    return 0;
}
```

| Step | low | high | mid | a[mid] | Decision |
|---|---|---|---|---|---|
| 1 | 0 | 8 | 4 | 31 | 31 < 44 → low = 5 |
| 2 | 5 | 8 | 6 | 52 | 52 > 44 → high = 5 |
| 3 | 5 | 5 | 5 | 44 | found at index 5 |

### Recurrence and its solution

Each call does constant work *c* and continues on half the array:

**T(n) = T(n/2) + c, T(1) = c**

Unrolling:

T(n) = T(n/2) + c = T(n/4) + 2c = … = T(n/2ᵏ) + k·c

The range reaches size 1 when n/2ᵏ = 1, i.e. k = log₂ n, so

**T(n) = c + c·log₂ n = O(log n)**

The master theorem gives the same result: a = 1, b = 2, f(n) = Θ(1) = Θ(n^(log₂1)), so T(n) = Θ(log n).

=== topic binary-tree-array | 3.6 Storing a binary tree in an array | BG_AM:Q1
> **{{BG_AM:Q1}}**
>
> How do you represent a binary tree using an array?

### Answer

Number the nodes **level by level, left to right**, and store node *k* at index *k*.

| With root at index 1 | With root at index 0 |
|---|---|
| left child of *k* → **2k** | left child → 2k + 1 |
| right child of *k* → **2k + 1** | right child → 2k + 2 |
| parent of *k* → **⌊k / 2⌋** | parent → ⌊(k − 1) / 2⌋ |

A missing child leaves its slot empty. For the tree in 3.3 (1; 2, 3; 4, 5):

| Index | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Node | 1 | 2 | 3 | 4 | 5 |

- **Good for** complete trees and heaps: no pointers are needed, and you can jump straight to a parent or child.
- **Bad for** skewed trees: a right-only chain of *h* nodes needs 2ʰ − 1 slots.

=== topic tree-from-postorder | 3.7 A binary tree from its post-order | BO_24:Q2a
> **{{BO_24:Q2a}}**
>
> A binary tree has nodes a … i. Its post-order is `a b f c h d e g i`. Draw the binary tree and show its array representation. *(approximate)*

### The catch

Post-order **alone does not fix a unique tree**. You also need the in-order (or the tree must be full or complete). The paper itself says "approximate", so draw *any* tree that gives this post-order and state that assumption.

**Method:** the last node of post-order is the root. Then split what is left into a left-subtree part and a right-subtree part, and repeat inside each.

- Root = **i**. Take `a b f c h d` as the left subtree and `e g` as the right subtree.
- Left part: its last node **d** is the root; take `a b f` as d's left and `c h` as d's right.
  - `a b f`: root **f** with children a, b.
  - `c h`: root **h** with left child c.
- Right part `e g`: root **g** with left child e.

```figure
postorder-tree
```

Check: post-order of this tree is (a b f)(c h) d (e g) i = **a b f c h d e g i** ✓

### Array representation (root at 1)

| Index | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Node | i | d | g | f | h | e | – | a | b | c |

(c is the left child of h at index 5, so it lands at 2 × 5 = 10.)

=== topic bellman-ford-negative-cycle | 3.8 Shortest paths with a negative cycle (Bellman–Ford) | BO_22:Q4
> **{{BO_22:Q4}}**
>
> How do you find the single-source shortest path when the graph has a negative weight cycle? Justify, and show how you find out that the graph has a negative weight cycle.

### Answer

- **Dijkstra fails** with negative edges, because it finalises a vertex and never revisits it.
- **Bellman–Ford** works with negative edges:
  1. Set dist(source) = 0 and every other vertex to ∞.
  2. Repeat **V − 1 times**: for every edge (u, v, w), if dist(u) + w < dist(v), set dist(v) = dist(u) + w (*relax*).
  3. Do **one more pass**. If any edge can *still* be relaxed, a **negative cycle is reachable** from the source. Report it, because shortest paths through it are undefined (you can loop forever and keep lowering the cost).

**Why V − 1 passes?** A shortest simple path has at most V − 1 edges, and each pass fixes at least one more edge of it. Improvement in pass V is only possible if there is a negative cycle.

### Worked example

Edges, relaxed in this order: S→A (5), A→B (3), B→C (−5), C→A (1). The cycle A→B→C→A has weight 3 − 5 + 1 = **−1**. V = 4, so 3 normal passes.

| Pass | A | B | C | What changed |
|---|---|---|---|---|
| start | ∞ | ∞ | ∞ | S = 0 |
| 1 | 5 → **4** | 8 | 3 | C→A improves A to 4 |
| 2 | 3 | 7 | 2 | everything keeps dropping |
| 3 (= V − 1) | 2 | 6 | 1 | still dropping |
| 4 (check) | — | 2 + 3 = 5 < 6 | — | **an edge still relaxes → negative cycle** |

Complexity: O(V·E).

=== topic quicksort-sorted-input | 3.9 Quick sort on already sorted input | BO_24:Q2b
> **{{BO_24:Q2b}}**
>
> Quick sort takes the first element as the pivot. Analyse its time complexity when the input is already sorted.

### Answer: Θ(n²), the worst case

With sorted input, the first element is the **smallest**, so every partition is maximally unbalanced: **0 elements on the left, n − 1 on the right**.

| Call on | Pivot | Left | Right | Comparisons |
|---|---|---|---|---|
| 1 2 3 4 5 | 1 | — | 2 3 4 5 | 4 |
| 2 3 4 5 | 2 | — | 3 4 5 | 3 |
| 3 4 5 | 3 | — | 4 5 | 2 |
| 4 5 | 4 | — | 5 | 1 |

Recurrence:

T(n) = T(n − 1) + (n − 1)

which gives

T(n) = (n − 1) + (n − 2) + … + 1 = **n(n − 1)/2 = Θ(n²)**

The recursion is also n levels deep, so the stack uses O(n) space.

**Fix:** choose a random pivot or the median of first, middle and last. Splits then stay balanced on average and the cost is back to O(n log n).

=== topic stack-operations | 3.10 Stack push and pop | BP:Q6
> **{{BP:Q6}}**
>
> Push(200), Push(500), Push(100), S = Pop(). What is the value of S after the operations?

### Answer: S = 100

A stack is **LIFO** (last in, first out), so `Pop` returns the most recently pushed item.

| Operation | Stack (bottom → top) |
|---|---|
| Push(200) | 200 |
| Push(500) | 200, 500 |
| Push(100) | 200, 500, 100 |
| S = Pop() | 200, 500, and **S = 100** |

=== topic block-matrix-multiplication | 3.11 Multiplying 16×16 matrices on an 8×8 unit | BG_AM:Q2
> **{{BG_AM:Q2}}**
>
> You are given two 16×16 matrices, but your processor supports only 8×8 matrix multiplication. Write an algorithm to multiply them.

### Idea: block (partitioned) multiplication

Cut each 16×16 matrix into four 8×8 blocks. Block matrices multiply **exactly like 2×2 matrices**, with each entry being an 8×8 product the processor can do.

A = [A₁₁ A₁₂; A₂₁ A₂₂], B = [B₁₁ B₁₂; B₂₁ B₂₂]

| Result block | Formula |
|---|---|
| C₁₁ | A₁₁·B₁₁ + A₁₂·B₂₁ |
| C₁₂ | A₁₁·B₁₂ + A₁₂·B₂₂ |
| C₂₁ | A₂₁·B₁₁ + A₂₂·B₂₁ |
| C₂₂ | A₂₁·B₁₂ + A₂₂·B₂₂ |

### Algorithm

1. Split A and B into 8×8 blocks: X_ij = rows 8(i−1)+1 … 8i, columns 8(j−1)+1 … 8j.
2. For i = 1, 2 and j = 1, 2:
   - P ← MUL8(A_i1, B_1j) *(hardware 8×8 multiply)*
   - Q ← MUL8(A_i2, B_2j)
   - C_ij ← P + Q *(element-wise 8×8 addition)*
3. Put C₁₁, C₁₂, C₂₁, C₂₂ back together as the 16×16 result.

**Cost:** 8 block multiplies and 4 block additions. (Strassen's method does it with 7 multiplies and more additions.)

=== topic proper-binary-tree-leaves | 3.12 Leaves = internal nodes + 1 | TG:Q1b
> **{{TG:Q1b}}**
>
> If a complete binary tree is a proper binary tree, prove that the number of leaf nodes is one more than the number of internal nodes.

### Proof (counting edges)

In a **proper (full)** binary tree every internal node has **exactly 2 children**. Let I = internal nodes, L = leaves and N = I + L.

1. Every node except the root has exactly one parent edge, so **edges = N − 1**.
2. Every edge goes down from an internal node, and each internal node sends exactly 2, so **edges = 2I**.
3. Therefore N − 1 = 2I, so I + L − 1 = 2I, which gives **L = I + 1**. ∎

**Check:** the tree with root 1, children 2 and 3, and 4 and 5 under 2 has I = {1, 2} = 2 and L = {3, 4, 5} = 3 = 2 + 1 ✓

*(Induction also works: start with a single leaf, where L = 1 and I = 0. Turning a leaf into an internal node with two new leaves adds 1 to I and adds 2 − 1 = 1 to L.)*

=== topic polynomial-reduction | 3.13 Which problem is harder after a reduction? | TG:Q1c
> **{{TG:Q1c}}**
>
> Problem A can be reduced to problem B in polynomial time. Which problem is harder, and why?

### Answer: B is at least as hard as A (A ≤ₚ B)

A polynomial reduction is a fast converter: any instance of A becomes an instance of B with the same yes/no answer. So

*solve A* = *convert (polynomial)* + *solve B*

- If B is easy (polynomial), A is easy too.
- If A is hard (for example NP-hard), B must be hard too. Otherwise the converter plus a fast B solver would solve A quickly.

So B can never be easier than A. This is exactly how NP-completeness is proved: reduce a known NP-hard problem (like SAT) **to** the new problem.
