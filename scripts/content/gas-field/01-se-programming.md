=== subject gf-software-engineering | Software Engineering
=== topic waterfall-model | 1.1 Waterfall model | JG_SAE:Q1
> **{{JG_SAE:Q1}}**
>
> Describe software development waterfall model design.

### Answer

The **waterfall model** is the classic, plan-driven SDLC. The work is split into fixed phases that run **one after another, like water falling down steps**. A phase starts only when the previous one is complete and its document is approved, and going back up is expensive.

```figure
waterfall
```

| Phase | What happens | Deliverable |
|---|---|---|
| 1. Requirements analysis | Talk to users, fix *what* the system must do | SRS (Software Requirements Specification) |
| 2. System design | Decide *how*: architecture, modules, database, UI | SDD (design document) |
| 3. Implementation | Write the code module by module, unit-test it | Source code |
| 4. Integration & testing | Join modules, test the whole system against the SRS | Test report, accepted build |
| 5. Deployment | Install at the client site, train users | Running system |
| 6. Maintenance | Fix bugs, adapt, enhance | Updated releases |

**Use it when** requirements are clear and stable, the technology is well understood and the project is short. A gas-billing module with a fixed government rule set is a good example.

| Advantages | Disadvantages |
|---|---|
| Simple to understand and manage | No working software until late |
| Clear milestones and documents | A requirement change means going back up the steps |
| Easy to estimate cost and time | Testing comes late, so defects are found late |
| Works well for small, fixed projects | Poor fit for long or uncertain projects |

> **Exam tip:** draw the steps, name the deliverable of each phase, and end with *one* line on when to use it. That is what earns full marks.

=== topic forward-reverse-engineering | 1.2 Forward vs reverse engineering | JG_AE:Q11
> **{{JG_AE:Q11}}**
>
> What is Reverse Engineering and Forward Engineering?

### Answer

- **Forward engineering** is the normal direction of development: **requirements → design → code**. You move from an abstract idea to a concrete product.
- **Reverse engineering** goes the other way: **existing code or product → design → specification**. You study something that already exists to understand how it works, usually because the documents are lost or out of date.

| | Forward engineering | Reverse engineering |
|---|---|---|
| Starts from | Requirements (SRS) | Working code, binary or product |
| Ends with | A new system | Design models, documentation |
| Goal | Build | Understand, document, recover, migrate |
| Typical tools | IDE, compiler, CASE tools | Decompiler, debugger, code analysers |
| Example | Building a new prepaid-meter app from its SRS | Reading an old COBOL billing system to draw its ER diagram before rewriting it |

**Re-engineering** = reverse engineering (to understand the old system) **+** forward engineering (to build its improved replacement).

=== topic sdlc-matching | 1.3 Matching life-cycle activities | TG:Q3b
> **{{TG:Q3b}}**
>
> Match the software life-cycle activities. P. Requirements Capture, Q. Design, R. Implementation, S. Maintenance with 1. Module development and Integration, 2. Domain Analysis, 3. Structural and behavioral modeling, 4. Performance tuning.

### Answer: P–2, Q–3, R–1, S–4

| Activity | Matches | Why |
|---|---|---|
| P. Requirements capture | 2. Domain analysis | You first learn the problem domain and the users' needs |
| Q. Design | 3. Structural & behavioral modeling | Class diagrams (structure), sequence and state diagrams (behaviour) |
| R. Implementation | 1. Module development & integration | Code each module, then join them |
| S. Maintenance | 4. Performance tuning | Improving a system that is already running |

=== topic testing-types | 1.4 Types of testing | BO_24:Q4b
> **{{BO_24:Q4b}}**
>
> Given 5 scenarios of software engineering (Unit test, Regression test, Smoke test, Integration testing, Load testing), one done for you. Write the name of the testing and whether it is functional, non-functional or both.

The scenario sheet is not available, so learn the definition, a typical scenario and the type of each test. With that you can label any scenario they give.

### Answer

| Test | What it checks (typical scenario) | Type |
|---|---|---|
| **Unit test** | One function or class alone. *"Check `calculateBill()` returns ৳1,080 for 60 m³."* | Functional |
| **Integration test** | Modules working together. *"Meter-reading module passes data correctly to billing."* | Functional |
| **Smoke test** | A new build starts and its core features run at all, before deeper testing. *"App opens, login works, bill page loads."* | Functional |
| **Regression test** | Old features still work after a change or bug fix. *"After adding bKash payment, card payment still works."* | Mainly functional; can include non-functional checks (both) |
| **Load test** | Behaviour under expected heavy use. *"10,000 customers pay bills in the last hour of the month."* | Non-functional |

**Rule of thumb:** if the test asks *"does it do the right thing?"* it is functional. If it asks *"how well, how fast, how many users?"* it is non-functional (performance, load, stress, security, usability).

=== topic black-box-testing | 1.5 Black-box testing: equivalence classes & boundary values | BO_22:Q3
> **{{BO_22:Q3}}**
>
> What is black box test? Consider a program which computes the square root of an input integer between 0 and 5000. Determine the equivalence class test cases. Determine the test cases using boundary value analysis also.

### What is black-box testing?

The tester sees the program only from outside: **input → expected output**, with no knowledge of the code. Test cases come from the specification. (Its opposite, white-box testing, designs tests from the code's paths and branches.)

### Equivalence class partitioning

Split the input domain into classes where the program should behave the same way, then test **one representative per class**.

| Class | Range | Test input | Expected output |
|---|---|---|---|
| E1, invalid (too small) | n < 0 | −25 | Error message |
| E2, valid | 0 ≤ n ≤ 5000 | 2500 | 50 |
| E3, invalid (too large) | n > 5000 | 7000 | Error message |
| E4, invalid (not an integer) *(optional extra)* | text / fraction | "abc", 12.5 | Error message |

### Boundary value analysis

Errors cluster at the edges, so test **each boundary, just inside it and just outside it**.

| Input | Position | Expected |
|---|---|---|
| −1 | just below minimum | Error |
| 0 | minimum | 0 |
| 1 | just above minimum | 1 |
| 4999 | just below maximum | ≈ 70.70 |
| 5000 | maximum | ≈ 70.71 |
| 5001 | just above maximum | Error |

**Test set:** {−25, 2500, 7000} for equivalence classes and {−1, 0, 1, 4999, 5000, 5001} for boundaries.

=== topic library-class-diagram | 1.6 Library management class diagram | BG_AM:Q6
> **{{BG_AM:Q6}}**
>
> Draw the class diagram of a library management system.

### Answer

```figure
library-classes
```

**How to read it**

- Each box is a class: **name** on top, **attributes** in the middle, **operations** at the bottom. `-` means private, `+` means public.
- **Generalization** (hollow triangle): `Member` and `Librarian` *are* `Person`s, so they inherit `id`, `name`, `email` and `login()`.
- **Associations with multiplicity:**
  - A member *borrows* through loans: one `Member` has `0..*` `Loan`s.
  - A librarian *issues* loans: one `Librarian` handles `0..*` `Loan`s.
  - Each `Loan` is *for* exactly one `Book`, and a book can appear in many loans over time.
- `Loan` holds the dates and calculates the late `fine()`. That keeps borrowing history out of `Book` and `Member`.

> **Exam tip:** three to five classes with correct arrows and multiplicities score better than ten classes drawn loosely.

=== subject gf-programming | Programming
=== topic xor-function-output | 2.1 Output of an XOR function | JG_AE:Q1
> **{{JG_AE:Q1}}**
>
> Write the output of the following code:

```cpp
#include <iostream>
using namespace std;
int f(int *arr, int size) {
    int x = 0;
    for (int i = 0; i < size; i++) {
        x = x ^ *(arr + i);
    }
    return x;
}
int main() {
    int arr[] = {0, 1, 1, 0, 1, 1, 0, 1};
    cout << f(arr, 2) << f(arr, 3) << f(arr, 5) << f(arr, 8) << endl;
    return 0;
}
```

### Answer: `1011`

`f` XORs the first `size` elements (`*(arr + i)` is just `arr[i]`). For bits, XOR gives **1 when the number of 1s is odd** and 0 when it is even.

| Call | Elements XORed | Count of 1s | Result |
|---|---|---|---|
| `f(arr, 2)` | 0, 1 | 1 (odd) | 1 |
| `f(arr, 3)` | 0, 1, 1 | 2 (even) | 0 |
| `f(arr, 5)` | 0, 1, 1, 0, 1 | 3 (odd) | 1 |
| `f(arr, 8)` | 0, 1, 1, 0, 1, 1, 0, 1 | 5 (odd) | 1 |

`cout` prints the four values with no spaces between them, so the line is **1011**.

=== topic loop-break-trace | 2.2 Loop with break, traced step by step | BG_AE:Q3
> **{{BG_AE:Q3}}**
>
> Find the step-by-step output of the program:

```c
#include <stdio.h>
int main () {
    int i, sum = 0, p;
    for (i = -1, p = 0; i <= 10; i = i + 2) {
        p = i * i;
        if (i > 5)
            break;
        sum = sum + (i + p);
        printf("i = %d p = %d sum = %d\n", i, p, sum);
    }
    printf("The Outer Loop i = %d p = %d sum = %d", i, p, sum);
    return 0;
}
```

### Trace

`i` starts at −1 and goes up by 2. Note that `p = i * i` is computed **before** the `break` check.

| Pass | i | p = i·i | i > 5? | sum = sum + (i + p) | Printed |
|---|---|---|---|---|---|
| 1 | −1 | 1 | no | 0 + 0 = **0** | yes |
| 2 | 1 | 1 | no | 0 + 2 = **2** | yes |
| 3 | 3 | 9 | no | 2 + 12 = **14** | yes |
| 4 | 5 | 25 | no | 14 + 30 = **44** | yes |
| 5 | 7 | 49 | **yes → break** | stays 44 | no |

### Output

```text
i = -1 p = 1 sum = 0
i = 1 p = 1 sum = 2
i = 3 p = 9 sum = 14
i = 5 p = 25 sum = 44
The Outer Loop i = 7 p = 49 sum = 44
```

The trap is the last line: after `break`, `i` is 7 and `p` is already 49, but `sum` was never updated.

=== topic if-chain-output | 2.3 Separate if statements vs else-if | BO_24:Q1a
> **{{BO_24:Q1a}}**
>
> Write the output of the program when a = 85.

```c
if (a >= 90) printf("A");
if (a >= 80) printf("B");
if (a >= 70) printf("C");
if (a >= 60) printf("D");
else printf("F");
```

### Answer: `BCD`

These are **four independent `if` statements**, not an `else if` ladder. Each one is checked, and the `else` belongs only to the *last* `if`.

| Statement | 85 ≥ ? | Prints |
|---|---|---|
| `if (a >= 90)` | false | — |
| `if (a >= 80)` | true | B |
| `if (a >= 70)` | true | C |
| `if (a >= 60) … else` | true, so `else` is skipped | D |

With `else if` on every line, only the first true branch would run and the output would be just **B**.

=== topic java-access-specifiers | 2.4 Java access specifiers | BO_24:Q1b
> **{{BO_24:Q1b}}**
>
> Java has three access specifiers. Find which ones work with public, private and protected mode; write Y for yes and N for no.

The exam's blank table is not available. This is the standard visibility table every version of the question is built on:

| Accessed from … | `public` | `protected` | *default* (no keyword) | `private` |
|---|---|---|---|---|
| Same class | Y | Y | Y | Y |
| Another class, same package | Y | Y | Y | N |
| Subclass, different package | Y | Y | N | N |
| Non-subclass, different package | Y | N | N | N |

**Remember:** `public` is visible everywhere, `private` only inside its own class, and `protected` is like *default* plus subclasses in other packages.

=== topic second-largest-java | 2.5 Second largest of three numbers (Java) | JG_SAE:Q7
> **{{JG_SAE:Q7}}**
>
> library function use না করে তিনটি সংখ্যার মধ্যে দ্বিতীয় বৃহত্তম সংখ্যা নির্ণয়ের একটি জাভা প্রোগ্রাম লিখ।
>
> *(Write a Java program to find the second largest of three numbers without using library functions.)*

### Idea

Among three numbers, the second largest is simply the **middle** one: the number that is neither above both others nor below both. Only comparisons are needed, so no `Math.max` or sorting.

```java
import java.util.Scanner;

public class SecondLargest {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt(), b = sc.nextInt(), c = sc.nextInt();
        int second;

        if ((a >= b && a <= c) || (a <= b && a >= c)) {
            second = a;              // a sits between b and c
        } else if ((b >= a && b <= c) || (b <= a && b >= c)) {
            second = b;              // b sits between a and c
        } else {
            second = c;              // otherwise c is the middle one
        }
        System.out.println("Second largest = " + second);
    }
}
```

| Input | a in middle? | b in middle? | Output |
|---|---|---|---|
| 7 12 9 | no | no | **9** |
| 40 15 22 | no | no | **22** |
| 5 5 3 | yes (5 ≥ 5 and 5 ≥ 3) | — | **5** |

=== topic prime-check | 2.6 Prime check: program and flowchart | BG_SAE:Q2, GT_SAE:Q4
> **{{BG_SAE:Q2}}**
>
> N সংখ্যাটি Prime number কিনা যাচাই করার জন্য একটি Program (any language) লিখ।

> **{{GT_SAE:Q4}}**
>
> একটি সংখ্যা Prime Number কিনা, তার ফ্লোচার্ট অংকন কর।

### Flowchart

```figure
prime-flow
```

### Program (C)

```c
#include <stdio.h>

int main(void) {
    int n, i, isPrime = 1;
    scanf("%d", &n);

    if (n <= 1) isPrime = 0;                 /* 0, 1 and negatives are not prime */
    for (i = 2; i * i <= n && isPrime; i++) {
        if (n % i == 0) isPrime = 0;         /* found a divisor */
    }

    printf(isPrime ? "Prime\n" : "Not prime\n");
    return 0;
}
```

| N | Divisors tried | Verdict |
|---|---|---|
| 29 | 2, 3, 4, 5 (6 × 6 = 36 > 29, stop), none divide | Prime |
| 21 | 2, then 3 divides 21 | Not prime |
| 1 | loop never runs, caught by `n <= 1` | Not prime |

**Why stop at √N?** If N = a × b with a ≤ b, then a ≤ √N. So if nothing up to √N divides N, nothing above does either. This makes the check O(√N) instead of O(N).

=== topic remove-substring | 2.7 Remove a substring from a string (C) | RP:Q1
> **{{RP:Q1}}**
>
> Write a C program: input `programming`, then input `gram`. Output: `programming` without the `gram`.

### Program

Walk through the string. Wherever the pattern starts, jump over it; otherwise copy the character.

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char s[200], t[100], out[200];
    scanf("%199s %99s", s, t);

    int n = strlen(s), m = strlen(t), k = 0;
    for (int i = 0; i < n; ) {
        if (m > 0 && strncmp(s + i, t, m) == 0)
            i += m;                 /* pattern found: skip it */
        else
            out[k++] = s[i++];      /* keep this character */
    }
    out[k] = '\0';

    printf("%s\n", out);
    return 0;
}
```

### Trace

`p r o g r a m m i n g`: at index 3 the text `gram` matches, so indices 3–6 are skipped. The kept characters are `pro` + `ming`.

**Output: `proming`**

=== topic reverse-number | 2.8 Reverse a number | BG_AM:Q3
> **{{BG_AM:Q3}}**
>
> Take an input and print it reversed. Input: 6789, Output: 9876.

```c
#include <stdio.h>

int main(void) {
    int n, rev = 0;
    scanf("%d", &n);
    while (n > 0) {
        rev = rev * 10 + n % 10;    /* append the last digit */
        n /= 10;                    /* drop the last digit */
    }
    printf("%d\n", rev);
    return 0;
}
```

| Step | n | n % 10 | rev | n / 10 |
|---|---|---|---|---|
| 1 | 6789 | 9 | 9 | 678 |
| 2 | 678 | 8 | 98 | 67 |
| 3 | 67 | 7 | 987 | 6 |
| 4 | 6 | 6 | **9876** | 0 (loop ends) |

=== topic balanced-brackets | 2.9 Is the expression closed correctly? (stack) | TG:Q5b
> **{{TG:Q5b}}**
>
> Write a program to find out whether an expression is ended correctly or not. Input: `((a+b)+(a-b))` → Matched. Input: `(a+b)+a-c)` → Not matched.

*As printed in the paper, the first input `((a+b) +(a-b)` is one `)` short. With a correct program it would print "Not matched". The intended input is clearly `((a+b)+(a-b))`.*

### Idea: a stack

Push every opening bracket. On a closing bracket, the top of the stack must be its partner, so pop it. The expression is correct only if no pop fails **and** the stack is empty at the end.

```c
#include <stdio.h>

int main(void) {
    char e[256], st[256];
    int top = -1, ok = 1;
    fgets(e, sizeof e, stdin);

    for (int i = 0; e[i] && ok; i++) {
        char c = e[i];
        if (c == '(' || c == '[' || c == '{') {
            st[++top] = c;                               /* push */
        } else if (c == ')' || c == ']' || c == '}') {
            char want = c == ')' ? '(' : c == ']' ? '[' : '{';
            if (top < 0 || st[top] != want) ok = 0;      /* nothing to match */
            else top--;                                  /* pop */
        }
    }
    puts(ok && top == -1 ? "Matched" : "Not matched");
    return 0;
}
```

| Input | Stack depth after each bracket | Result |
|---|---|---|
| `((a+b)+(a-b))` | 1 2 1 2 1 0 | Matched |
| `(a+b)+a-c)` | 1 0, then `)` with an empty stack | Not matched |

=== topic recursive-nested-loops | 2.10 Recursive version of nested loops | TG:Q1a
> **{{TG:Q1a}}**
>
> Write a recursive function for the given scenario:

```c
for (int i = 1; i < n; i++)
    for (int j = 0; j < i; j++)
        for (int k = 0; k < i; k++)
            x = x + 1;
```

### Analysis

For a fixed `i`, the two inner loops run `i × i` times, so they add `i²` to `x`. The outer loop runs `i = 1 … n−1`:

x = 1² + 2² + … + (n−1)²

The last term depends on `n − 1`, which gives the recursion **f(n) = f(n−1) + (n−1)²**, with f(1) = 0 (no iterations).

```c
int f(int n) {                       /* value added to x by the loops */
    if (n <= 1) return 0;            /* base case: outer loop never runs */
    return f(n - 1) + (n - 1) * (n - 1);
}
```

| n | added this call | f(n) |
|---|---|---|
| 1 | — | 0 |
| 2 | 1 | 1 |
| 3 | 4 | 5 |
| 4 | 9 | 14 |
| 5 | 16 | 30 |

Closed form: f(n) = (n−1)·n·(2n−1) / 6, so the loops do **Θ(n³)** work.

=== topic html-form | 2.11 Design a form in HTML | JG_SAE:Q5
> **{{JG_SAE:Q5}}**
>
> Design the form using HTML.

The picture of the target form is not available. This version covers every common control (text, email, password, radio, select, checkbox, textarea, submit), so you can adapt it to whichever form they show.

```html
<form action="/register" method="post">
  <label>Name: <input type="text" name="name" required></label><br>
  <label>Email: <input type="email" name="email" required></label><br>
  <label>Password: <input type="password" name="password" minlength="6" required></label><br>

  Gender:
  <label><input type="radio" name="gender" value="male"> Male</label>
  <label><input type="radio" name="gender" value="female"> Female</label><br>

  <label>Department:
    <select name="dept">
      <option>CSE</option>
      <option>EEE</option>
      <option>ICT</option>
    </select>
  </label><br>

  <label>Message:<br><textarea name="message" rows="3" cols="30"></textarea></label><br>
  <label><input type="checkbox" name="agree" required> I agree</label><br>

  <input type="submit" value="Submit">
</form>
```

```figure
form-preview
```

**Points examiners look for:** `action` and `method` on `<form>`; the same `name` on radio buttons so only one can be chosen; `type="email"` and `required` for built-in validation; a `<label>` for every control.
