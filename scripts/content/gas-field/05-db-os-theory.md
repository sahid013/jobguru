=== subject gf-database | Database
=== topic account-but-no-loan | 6.1 Customers with an account but no loan | JG_SAE:Q6
> **{{JG_SAE:Q6}}**
>
> We have two relations, Depositor and Borrower. Write an SQL command to find customers with an account but not a loan.

Assume `depositor(customer_name, account_number)` and `borrower(customer_name, loan_number)`, as in the Korth (Silberschatz) bank schema.

### Answer: set difference

```sql
SELECT customer_name FROM depositor
EXCEPT                              -- MINUS in Oracle
SELECT customer_name FROM borrower;
```

**Equivalent forms**, useful when EXCEPT is not supported (e.g. older MySQL):

```sql
-- NOT IN
SELECT DISTINCT customer_name
FROM depositor
WHERE customer_name NOT IN (SELECT customer_name FROM borrower);

-- NOT EXISTS (also safe if borrower.customer_name can be NULL)
SELECT DISTINCT d.customer_name
FROM depositor d
WHERE NOT EXISTS (SELECT 1 FROM borrower b WHERE b.customer_name = d.customer_name);
```

Relational algebra: **Π customer_name (depositor) − Π customer_name (borrower)**

=== topic acid-properties | 6.2 ACID properties | JG_AE:Q4
> **{{JG_AE:Q4}}**
>
> Write the ACID properties of a DBMS.

A **transaction** is a unit of work (e.g. *transfer ৳1,000 from X to Y*). A DBMS guarantees four properties for it:

| Property | Meaning | In the transfer | Ensured by |
|---|---|---|---|
| **Atomicity** | all or nothing | both the debit and the credit happen, or neither does | undo log / rollback |
| **Consistency** | moves the DB from one valid state to another | total money X + Y is unchanged; no rule is broken | constraints and application logic |
| **Isolation** | concurrent transactions do not see each other's half-done work | two transfers on X behave as if run one after the other | locking, MVCC |
| **Durability** | once committed, it survives crashes | the transfer stays even after a power cut | redo log, write-ahead logging |

=== topic salary-like-rahim | 6.3 Employee salary queries | BG_AM:Q5
> **{{BG_AM:Q5}}**
>
> Employee and Department tables are given. (i) Find employees with the same salary as Rahim but a different job. (ii) Find the employees whose salary is above the company's average salary.

The tables are not printed in the question. Assume `Employee(emp_id, name, job, salary, dept_id)` and `Department(dept_id, dept_name)`.

### (i) Same salary as Rahim, different job

```sql
SELECT e.name
FROM Employee e
JOIN Employee r ON r.name = 'Rahim'
WHERE e.salary = r.salary
  AND e.job   <> r.job;
```

(A self-join: `r` is Rahim's row, `e` is everyone else. Rahim himself drops out automatically, because his job equals his own.)

### (ii) Salary above the company average

```sql
SELECT name, salary
FROM Employee
WHERE salary > (SELECT AVG(salary) FROM Employee);
```

If the examiner meant **departments** whose average beats the company average:

```sql
SELECT d.dept_name, AVG(e.salary) AS dept_avg
FROM Employee e JOIN Department d ON d.dept_id = e.dept_id
GROUP BY d.dept_name
HAVING AVG(e.salary) > (SELECT AVG(salary) FROM Employee);
```

=== topic cheapest-wheel-supplier | 6.4 Supplier of 'wheel' at the least cost | TG:Q5a
> **{{TG:Q5a}}**
>
> Write a query to find the names of suppliers who supply 'wheel' at the least cost. Suppliers(sid, sname, address), Parts(pid, pname, color), Catalog(sid, pid, cost).

```sql
SELECT s.sname
FROM Suppliers s
JOIN Catalog  c ON c.sid = s.sid
JOIN Parts    p ON p.pid = c.pid
WHERE p.pname = 'wheel'
  AND c.cost = (
        SELECT MIN(c2.cost)
        FROM Catalog c2
        JOIN Parts p2 ON p2.pid = c2.pid
        WHERE p2.pname = 'wheel'
      );
```

The inner query finds the cheapest price for a wheel. The outer query returns **every** supplier charging that price, so ties are kept. (`ORDER BY cost LIMIT 1` would wrongly drop tied suppliers.)

=== topic dept-average-course-offerings | 6.5 Department average and course offerings | BO_24:Q3
> **{{BO_24:Q3}}**
>
> Employee(empno PK, empname, monthlysalary, deptno FK, mgrno FK), Department(deptno, deptname, deptlocation), Course(crscode PK, crsdesc, crscategory, crsduration), Offering(offbegindate, crscode FK, offeringlocation, empno FK). (a) Find departments whose average monthly salary is greater than 1000. (b) Find courses with more than two offerings.

### (a)

```sql
SELECT d.deptno, d.deptname, AVG(e.monthlysalary) AS avg_salary
FROM Department d
JOIN Employee e ON e.deptno = d.deptno
GROUP BY d.deptno, d.deptname
HAVING AVG(e.monthlysalary) > 1000;
```

### (b)

```sql
SELECT c.crscode, c.crsdesc, COUNT(*) AS offerings
FROM Course c
JOIN Offering o ON o.crscode = c.crscode
GROUP BY c.crscode, c.crsdesc
HAVING COUNT(*) > 2;
```

**Key point:** filters on aggregates (`AVG`, `COUNT`) go in **HAVING**, which runs after `GROUP BY`. `WHERE` runs before grouping and cannot use them.

=== topic er-diagram-gas-company | 6.6 ER diagram for a gas distribution company | BG_AE:Q7a
> **{{BG_AE:Q7a}}**
>
> Draw an ER diagram: Bakhrabad Gas has two types of customers, General and Industrial. A general customer has customer ID, name, DOB and age (calculated from DOB). An industrial customer has all the attributes of a general customer plus a TAX number. A meter has a model and producer name. Every customer has one meter.

```figure
er-gas
```

### Design decisions

- **Customer** is a supertype with key `Customer_ID` (underlined), plus `Name` and `DOB`.
- **Age** is a **derived attribute** (computed from DOB), drawn as a **dashed oval**.
- **ISA specialisation:** `General` and `Industrial` inherit every Customer attribute; Industrial adds **Tax_No**. It is *disjoint* (a customer is one type, not both) and *total* (every customer is one of them).
- **Customer — has — Meter** is **1 : 1**. Every customer has exactly one meter, and a meter belongs to one customer. Meter has `Model` and `Producer_Name`.

=== topic erd-employee-equipment | 6.7 ERD and SQL: who hired the most equipment? | BP:Q3
> **{{BP:Q3}}**
>
> Schema: employee(id, name, salary), equipment(id, name, price), hire(employee_id, equipment_id). (i) Draw the ERD. (ii) Write an SQL query to show the name of the employee who borrowed the most equipment.

### (i) ERD

```figure
erd-hire
```

`employee` and `equipment` are **many-to-many**: one employee can hire many items, and one item can be hired many times. The **`hire` junction table** resolves it, and each of its rows points to one employee and one equipment item.

### (ii) Employee with the most hires

```sql
SELECT e.name, COUNT(*) AS items
FROM employee e
JOIN hire h ON h.employee_id = e.id
GROUP BY e.id, e.name
HAVING COUNT(*) = (
    SELECT MAX(cnt)
    FROM (SELECT COUNT(*) AS cnt FROM hire GROUP BY employee_id) t
);
```

The inner query finds the highest number of hires by any employee. The outer query returns **everyone** with that count, so ties are kept.

=== subject gf-os-linux | Operating System & Linux
=== topic chmod-revoke-execute | 7.1 Revoke execute permission except for the owner | JG_AE:Q2
> **{{JG_AE:Q2}}**
>
> Write a Linux command to revoke execute permission from everyone but the owner on the file "jgtdsl.txt".

### Answer

```bash
chmod go-x jgtdsl.txt
```

`g` = group, `o` = others, `-x` = remove execute. The owner (`u`) is not mentioned, so the owner's permissions stay exactly as they were.

| Who | Before (e.g. `rwxrwxrwx`) | After `chmod go-x` |
|---|---|---|
| owner (u) | rwx | rwx |
| group (g) | rwx | rw- |
| others (o) | rwx | rw- |

Numeric form, if you want to set everything at once: `chmod 744 jgtdsl.txt` gives the owner rwx (7) and everyone else r-- (4). Here r = 4, w = 2, x = 1.

=== topic last-line-of-log | 7.2 Last line of a log file | TG:Q4a
> **{{TG:Q4a}}**
>
> A log file keeps a record of updates. How do you get the last line of the log file?

```bash
tail -n 1 update.log     # print only the last line
tail -n 20 update.log    # last 20 lines
tail -f update.log       # keep printing new lines as they are written (live)
```

`tail` reads from the end of the file, so it is fast even on very large logs.

=== topic bash-combined-listing | 7.3 Bash, and one combined listing command | BG_AE:Q6
> **{{BG_AE:Q6}}**
>
> What is Bash? Write commands that go to the home directory, list its files with all details and human-readable sizes, and display only lines 10 to 15 of that listing. Write them so they run together and show the result.

**Bash** (Bourne Again SHell) is the default command-line **shell** on most Linux systems. It reads your commands, asks the kernel to run them, and is also a scripting language (variables, loops, `if`, functions, pipes).

```bash
cd ~ && ls -lh | sed -n '10,15p'
# or
cd ~ && ls -lh | head -n 15 | tail -n 6
```

| Part | Meaning |
|---|---|
| `cd ~` | go to the home directory |
| `&&` | run the next command **only if** the previous one succeeded |
| `ls -lh` | long listing (permissions, owner, size, date) with **h**uman-readable sizes (K, M, G); add `-a` for hidden files |
| `\|` | pipe: feed one command's output into the next |
| `sed -n '10,15p'` | print only lines 10–15 |
| `head -n 15 \| tail -n 6` | first 15 lines, then the last 6 of those, giving lines 10–15 |

(The first line of `ls -l` is the `total …` line, and it counts as line 1.)

=== topic mount-point-fdisk | 7.4 Mount point and fdisk | BG_SAE:Q6
> **{{BG_SAE:Q6}}**
>
> Linux এ Mount point কি? fdisk কেন ব্যবহার করা হয়?

**Mount point.** Linux has a single directory tree starting at `/`. A disk, partition, USB drive or network share becomes usable by **attaching it to an (empty) directory**, and that directory is the mount point.

```bash
sudo mount /dev/sdb1 /mnt/data    # files on sdb1 now appear under /mnt/data
sudo umount /mnt/data
```

Permanent mounts are listed in `/etc/fstab`.

**fdisk** is a command-line **partition editor** for a disk:

```bash
sudo fdisk -l          # list disks and partitions
sudo fdisk /dev/sdb    # interactive: n = new, d = delete, p = print, w = write
```

After creating a partition you **format** it (`mkfs.ext4 /dev/sdb1`) and then **mount** it.

=== topic sjf-starvation | 7.5 Starvation in SJF | RP:Q3
> **{{RP:Q3}}**
>
> What is starvation in SJF? Name starvation-free scheduling algorithms.

**Shortest Job First** always runs the ready process with the shortest CPU burst. If short jobs keep arriving, a long job is **postponed again and again, possibly forever**. That indefinite waiting is **starvation**.

| Time | Ready queue | SJF picks |
|---|---|---|
| 0 | P1 (20 ms), P2 (2) | P2 |
| 2 | P1 (20), P3 (2) arrives | P3 |
| 4 | P1 (20), P4 (2) arrives | P4 |
| … | a new short job keeps arriving | **P1 starves** |

**Starvation-free algorithms**

- **FCFS** – everyone is served in arrival order.
- **Round Robin** – every process gets a time slice in turn.
- **Priority scheduling with aging** – a waiting process's priority rises over time.
- **HRRN** (Highest Response Ratio Next) – response ratio = (waiting + burst) / burst, so long waiters eventually win.

=== topic pcb-contents | 7.6 What a PCB stores | RP:Q4
> **{{RP:Q4}}**
>
> Name four pieces of information stored in a PCB.

The **Process Control Block** is the OS's record of one process. It is saved and restored on every context switch. Any four of:

1. **Process ID** (PID) and parent PID
2. **Process state**: new, ready, running, waiting, terminated
3. **Program counter**: address of the next instruction
4. **CPU registers**: saved register contents
5. CPU-scheduling information: priority, queue pointers
6. Memory-management information: base/limit registers, page tables
7. Accounting information: CPU time used, time limits
8. I/O status: open files, allocated devices

=== topic page-fault | 7.7 What is a page fault? | TG:Q2c
> **{{TG:Q2c}}**
>
> What is a page fault?

A **page fault** is the trap raised when a program accesses a page that is **in its virtual address space but not currently in physical memory (RAM)**. The page table entry's valid bit is 0. It is not an error: it is how **demand paging** loads pages only when needed.

```figure
page-fault
```

If the address is not part of the process at all, the OS kills it instead (segmentation fault). Too many page faults, with the CPU mostly waiting on the disk, is called **thrashing**.

=== topic circular-wait | 7.8 Circular wait in deadlock | TG:Q3a
> **{{TG:Q3a}}**
>
> Briefly explain circular wait in deadlock.

**Circular wait** is one of the four **Coffman conditions** that must *all* hold for a deadlock (with mutual exclusion, hold-and-wait and no preemption). It means there is a **closed chain** of processes P1 → P2 → … → Pn → P1 in which each holds a resource the next one is waiting for.

```figure
circular-wait
```

P1 holds R1 and waits for R2; P2 holds R2 and waits for R1. Neither can proceed.

**Prevention:** give every resource type a number and make processes **request resources only in increasing order**. A cycle then becomes impossible.

=== topic multiprogramming | 7.9 Multiprogramming on a single CPU | BG_AM:Q4
> **{{BG_AM:Q4}}**
>
> How can multiprogramming be achieved on a uniprocessor system? Explain.

### Answer

Keep **several programs in memory at once**. When the running program has to wait, usually for I/O (disk, network, keyboard), the OS **context-switches** the CPU to another ready program instead of letting it sit idle.

```figure
multiprogramming
```

What makes it work:

- **Memory management** holds several processes at once, each protected from the others.
- The **CPU scheduler** picks the next ready process.
- **Context switching**: the PCB saves and restores registers and the PC.
- **Interrupts and DMA**: I/O finishes on its own and interrupts the CPU when done.

Only one instruction stream runs at any instant, but the CPU stays busy and throughput rises. Adding a **time slice** (time-sharing) also makes several interactive users feel they each have the machine.

=== topic shell-vs-kernel | 7.10 Shell vs kernel | BO_24:Q5a
> **{{BO_24:Q5a}}**
>
> What is the difference between a shell and a kernel?

| | Shell | Kernel |
|---|---|---|
| What | command interpreter: the user's interface to the OS | core of the OS that controls the hardware |
| Talks to | the user, and the kernel through system calls | hardware (CPU, memory, devices) and processes |
| Does | reads commands, runs programs, scripting, pipes | process scheduling, memory, file systems, device drivers, security |
| Runs in | user mode | kernel (privileged) mode |
| Replaceable? | yes: bash, zsh, sh, PowerShell | no, it is the OS itself (Linux, Windows NT kernel) |

Layering: **User → Shell → Kernel → Hardware**

=== topic raid-drive-failure | 7.11 Handling a drive failure in RAID | BO_24:Q5b
> **{{BO_24:Q5b}}**
>
> How do you resolve a drive failure in RAID?

1. **Detect and confirm.** The controller or `mdadm --detail /dev/md0` shows the array as *degraded* and identifies the failed disk.
2. **Remove the failed disk.** Mark it failed and remove it (`mdadm --fail`, `--remove`), or hot-swap it if the hardware allows.
3. **Insert a replacement** of equal or larger size, or let a **hot spare** take over automatically.
4. **Rebuild.** Data is recreated from the **mirror** (RAID 1/10) or from **parity** (RAID 5/6) onto the new disk (`mdadm --add`).
5. **Monitor the rebuild and keep backups.** A second failure during the rebuild destroys a RAID 5 array (RAID 6 survives two).

**RAID 0** has no redundancy: one failed disk means **restore everything from backup**. RAID is not a backup.

=== subject gf-theory | Theory, Compiler & AI
=== topic reverse-polish-notation | 8.1 Evaluating with reverse Polish notation | JG_SAE:Q2
> **{{JG_SAE:Q2}}**
>
> Reverse polish notation এর মাধ্যমে গাণিতিক বিশ্লেষণ কর: (7 + 1) × (6 + (3 − 2))

### Step 1: convert to postfix (RPN)

Write each operator **after** its two operands:

- (7 + 1) → `7 1 +`
- (3 − 2) → `3 2 -`
- 6 + (3 − 2) → `6 3 2 - +`
- whole expression → **`7 1 + 6 3 2 - + *`**

### Step 2: evaluate with a stack

Push numbers. On an operator, pop two values, apply it (second-popped *op* first-popped) and push the result.

| Token | Action | Stack |
|---|---|---|
| 7 | push | 7 |
| 1 | push | 7 1 |
| + | 7 + 1 | 8 |
| 6 | push | 8 6 |
| 3 | push | 8 6 3 |
| 2 | push | 8 6 3 2 |
| − | 3 − 2 | 8 6 1 |
| + | 6 + 1 | 8 7 |
| × | 8 × 7 | **56** |

**Result: 56.** RPN needs no brackets or precedence rules, which is why compilers and stack machines use it.

=== topic cfg-palindrome-accounts | 8.2 CFG for palindrome account numbers | JG_AE:Q8
> **{{JG_AE:Q8}}**
>
> JGTDSL has many consumer accounts. Write a CFG to find palindrome account numbers. Assume an account contains digits only.

### Grammar

```text
S → 0S0 | 1S1 | 2S2 | 3S3 | 4S4 | 5S5 | 6S6 | 7S7 | 8S8 | 9S9
S → 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | ε
```

- The first line wraps the string in the **same digit on both ends**.
- The second line ends it with a **single middle digit** (odd length) or **ε** (even length).

Formally G = ({S}, {0, …, 9}, P, S). If an account number must not be empty, drop ε and add `S → dd` for each digit d.

**Derivation of 12321:** S ⇒ 1S1 ⇒ 12S21 ⇒ 12**3**21 ✓

**Derivation of 4554:** S ⇒ 4S4 ⇒ 45S54 ⇒ 45ε54 = 4554 ✓

=== topic cfg-language | 8.3 Language of a CFG | BG_AE:Q7b
> **{{BG_AE:Q7b}}**
>
> Write the language of the CFG: S → aSa | bSb | a | b | ε

### Answer

**L(G) = { w ∈ {a, b}\* : w = wᴿ }**, the set of **all palindromes over {a, b}**, including the empty string.

| Rule | Effect |
|---|---|
| S → aSa, S → bSb | add the same letter at both ends |
| S → a, S → b | odd-length palindrome (single centre) |
| S → ε | even-length palindrome (empty centre) |

Example: S ⇒ aSa ⇒ abSba ⇒ ab**a**ba = *ababa*. Strings like *ab* can never be produced. This language is context-free but **not regular**: a finite automaton cannot remember an unbounded first half.

=== topic code-optimization | 8.4 Why compilers optimise code | JG_AE:Q7
> **{{JG_AE:Q7}}**
>
> Why is code optimisation needed in compiler design?

A straightforward translation produces correct but **wasteful** intermediate code. The optimisation phase rewrites it **without changing what the program does**, so the final program:

- **runs faster**: fewer and cheaper instructions, better use of loops and registers
- **uses less memory**: smaller code and fewer temporaries
- **uses less power**, which matters for embedded devices such as meters and controllers
- uses the target machine well (registers, pipelines, caches)

| Technique | Before | After |
|---|---|---|
| Constant folding | `x = 2 * 3 * r` | `x = 6 * r` |
| Common subexpression elimination | `a = b*c + d; e = b*c - f` | `t = b*c; a = t + d; e = t - f` |
| Dead-code elimination | code after `return`, unused variables | removed |
| Loop-invariant code motion | `for(...) { k = n * 4; a[i] = k; }` | `k = n * 4;` moved before the loop |
| Strength reduction | `i * 2` | `i << 1` or `i + i` |

=== topic lstm-gates-ai-components | 8.5 LSTM gates and components of AI | JG_AE:Q3
> **{{JG_AE:Q3}}**
>
> Write the names of the LSTM gates in AI. Write the components of AI.

### LSTM gates

An **LSTM** (Long Short-Term Memory) is a recurrent neural network with a **cell state** (long-term memory), controlled by three sigmoid gates:

| Gate | Decides |
|---|---|
| **Forget gate** | what to erase from the cell state |
| **Input gate** | what new information to write (together with the tanh *candidate* values) |
| **Output gate** | what part of the cell state to output as the hidden state |

The gates let LSTMs keep information over long sequences and avoid the vanishing-gradient problem of plain RNNs.

### Components of AI

1. **Knowledge representation**: storing facts and rules
2. **Reasoning and problem solving**: search, inference, logic
3. **Learning**: machine learning from data
4. **Perception**: computer vision, speech recognition
5. **Natural language processing**: understanding and generating language
6. **Planning and decision making**
7. **Action / robotics**: acting on the environment
