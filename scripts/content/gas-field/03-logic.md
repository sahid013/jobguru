=== subject gf-digital-logic | Digital Logic & Computer Architecture
=== topic kmap-three-variable | 4.1 Three-variable K-map | JG_AE:Q6
> **{{JG_AE:Q6}}**
>
> Simplify F(A, B, C) = A′BC′ + ABC′ + ABC using a K-map and represent it in sum-of-minterms form.

### Step 1: minterms

| Term | A B C | Minterm |
|---|---|---|
| A′BC′ | 0 1 0 | m2 |
| ABC′ | 1 1 0 | m6 |
| ABC | 1 1 1 | m7 |

**Sum of minterms: F(A, B, C) = Σm(2, 6, 7)**

### Step 2: K-map and groups

```figure
kmap3
```

- **m6 + m7** (row A = 1, columns 11 and 10): A = 1 and B = 1, so the term is **AB**.
- **m2 + m6** (column BC = 10, both rows): B = 1 and C = 0, A changes, so the term is **BC′**.

### Result

**F = AB + BC′**, which factors to **F = B(A + C′)**.

*Watch out:* writing F = AB + A′BC′ is correct but **not minimal**. m2 can pair with m6, so the single cell becomes BC′.

=== topic kmap-four-variable | 4.2 Four-variable K-map | BG_AE:Q1
> **{{BG_AE:Q1}}**
>
> Simplify the Boolean expression F = ABC′D′ + ABC′D + ABCD + ABCD′ + AB′C′D + AB′CD + AB′CD′.

### Step 1: minterms

| Term | ABCD | m |
|---|---|---|
| ABC′D′ | 1100 | 12 |
| ABC′D | 1101 | 13 |
| ABCD | 1111 | 15 |
| ABCD′ | 1110 | 14 |
| AB′C′D | 1001 | 9 |
| AB′CD | 1011 | 11 |
| AB′CD′ | 1010 | 10 |

F = Σm(9, 10, 11, 12, 13, 14, 15). That is every minterm with A = 1 **except** m8 (1000).

### Step 2: K-map

```figure
kmap4
```

| Group | Cells | Constant variables | Term |
|---|---|---|---|
| Row AB = 11 | 12, 13, 15, 14 | A = 1, B = 1 | **AB** |
| Columns CD = 01, 11 in rows 11, 10 | 13, 15, 9, 11 | A = 1, D = 1 | **AD** |
| Columns CD = 11, 10 in rows 11, 10 | 15, 14, 11, 10 | A = 1, C = 1 | **AC** |

### Result

**F = AB + AC + AD = A(B + C + D)**

Quick check: A(B + C + D) is 1 when A = 1 and at least one of B, C, D is 1. That is every A = 1 row except 1000 ✓

=== topic full-adder-from-half-adders | 4.3 Full adder from two half adders | GT_SAE:Q3
> **{{GT_SAE:Q3}}**
>
> দু'টি হাফ অ্যাডার দিয়ে একটি ফুল অ্যাডার ডিজাইন কর।
>
> *(Design a full adder using two half adders.)*

### Answer

A **half adder** adds two bits: Sum = A ⊕ B, Carry = A·B. A **full adder** must also add a carry-in, so chain two half adders:

1. Half adder 1 adds A and B, giving S1 = A ⊕ B and C1 = AB.
2. Half adder 2 adds S1 and Cin, giving **Sum = S1 ⊕ Cin = A ⊕ B ⊕ Cin** and C2 = S1·Cin.
3. A carry out happens if *either* half adder produced one: **Cout = C1 + C2 = AB + (A ⊕ B)Cin**.

```figure
full-adder
```

### Truth table check

| A | B | Cin | S1 | C1 | C2 | **Sum** | **Cout** |
|---|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 | 0 | 0 | 1 | 0 |
| 0 | 1 | 0 | 1 | 0 | 0 | 1 | 0 |
| 0 | 1 | 1 | 1 | 0 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 | 0 | 0 | 1 | 0 |
| 1 | 0 | 1 | 1 | 0 | 1 | 0 | 1 |
| 1 | 1 | 0 | 0 | 1 | 0 | 0 | 1 |
| 1 | 1 | 1 | 0 | 1 | 0 | 1 | 1 |

C1 and C2 are never both 1. So the OR gate could even be an XOR.

=== topic logic-circuit-function | 4.4 Function of a logic circuit | BP:Q2
> **{{BP:Q2}}**
>
> Write the function for which the output is 1. *(Circuit: A and B feed an AND gate and an OR gate; the OR output is inverted; the AND output and the inverted OR output go into an OR gate, whose output is inverted again.)*

```figure
gate-circuit
```

### Reading the circuit

- AND gate: AB
- OR gate, then NOT: (A + B)′
- Second OR: AB + (A + B)′
- Final NOT: **F = (AB + (A + B)′)′**

### Simplifying

| Step | Expression | Law |
|---|---|---|
| 1 | (AB + (A + B)′)′ | given |
| 2 | (AB)′ · ((A + B)′)′ | De Morgan on the outer NOT |
| 3 | (A′ + B′) · (A + B) | De Morgan, double negation |
| 4 | A′A + A′B + B′A + B′B | distribute |
| 5 | **A′B + AB′** | A′A = 0, B′B = 0 |

**F = A′B + AB′ = A ⊕ B (XOR).** The output is 1 when **A ≠ B**, i.e. for inputs (A, B) = (0, 1) or (1, 0).

=== topic mux-4-to-1 | 4.5 4-to-1 multiplexer in SOP form | TG:Q2a
> **{{TG:Q2a}}**
>
> A 4×1 MUX is given. Write its expression in sum-of-minterms (SOP) form.

### Answer

Two select lines S1 S0 choose one of four inputs I0–I3:

| S1 | S0 | Y |
|---|---|---|
| 0 | 0 | I0 |
| 0 | 1 | I1 |
| 1 | 0 | I2 |
| 1 | 1 | I3 |

Each row becomes one AND term (the select minterm ANDed with its input), and the rows are ORed:

**Y = S1′S0′·I0 + S1′S0·I1 + S1S0′·I2 + S1S0·I3**

Hardware: 2 NOT gates (for S1′, S0′), 4 three-input AND gates and one 4-input OR gate.

=== topic mux-2-to-1-realization | 4.6 Realising f(S, x1, x2) | BO_22:Q5
> **{{BO_22:Q5}}**
>
> Realise f(S, x1, x2) with basic logic gates and simplify with a K-map *(x1 = 0, x2 = 1 given)*.

The printed question is incomplete. It is the textbook **2-to-1 multiplexer**: S selects x1 (S = 0) or x2 (S = 1).

### Truth table → K-map

f = 1 when (S = 0 and x1 = 1) or (S = 1 and x2 = 1):

| S \ x1x2 | 00 | 01 | 11 | 10 |
|---|---|---|---|---|
| **0** | 0 | 0 | **1** | **1** |
| **1** | 0 | **1** | **1** | 0 |

Groups: the top-row pair (x1 = 1, S = 0) gives **S′x1**, and the bottom-row pair (x2 = 1, S = 1) gives **S·x2**.

**f = S′·x1 + S·x2**. *(A third group x1·x2 is redundant, the consensus term.)*

```figure
mux2
```

With the given values x1 = 0 and x2 = 1: f = S′·0 + S·1 = **S**. The output simply follows the select line.

=== topic traffic-light-fsm | 4.7 Traffic light FSM: how many flip-flops? | BO_24:Q4a
> **{{BO_24:Q4a}}**
>
> A traffic signal cycles GREEN → YELLOW → RED → GREEN. GREEN is on for 70 s, YELLOW for 5 s and RED for 75 s. It is implemented as an FSM whose only input is a clock with a 5 s period. What is the minimum number of flip-flops?

### Answer: 5 flip-flops

The FSM has no timer input, so it can only **count clock ticks**. Every tick inside a colour must be a separate state.

| Light | On time | Ticks (states) |
|---|---|---|
| GREEN | 70 s | 70 / 5 = 14 |
| YELLOW | 5 s | 5 / 5 = 1 |
| RED | 75 s | 75 / 5 = 15 |
| **Total** | 150 s | **30 states** |

n flip-flops give 2ⁿ states, so we need 2ⁿ ≥ 30. Since 2⁴ = 16 < 30 ≤ 32 = 2⁵, **n = ⌈log₂ 30⌉ = 5**.

```figure
traffic-fsm
```

=== topic parallel-circuit | 4.8 Find R and I in a parallel circuit | BO_22:Q6
> **{{BO_22:Q6}}**
>
> Find R and I from the circuit.

```figure
parallel-circuit
```

### Solution

In a parallel circuit **every branch has the same voltage**, and the source current is the **sum** of the branch currents.

| Step | Working | Result |
|---|---|---|
| Branch voltage | V = I₁R₁ = 2 × 6 | **12 V** |
| Current in 9 Ω | I₂ = V / 9 = 12 / 9 | **1.33 A** (4/3 A) |
| Resistance R | P = V²/R, so R = V²/P = 144 / 12 | **R = 12 Ω** |
| Current in R | I₃ = V / R = 12 / 12 (or P / V) | **1 A** |
| Total current | I = I₁ + I₂ + I₃ = 2 + 1.33 + 1 | **I = 4.33 A** (13/3 A) |

So E = 12 V. As a check, the equivalent resistance is 1 / (1/6 + 1/9 + 1/12) = 36/13 Ω, and 12 ÷ 36/13 = 13/3 A ✓

=== topic adc-circuit | 4.9 Analog-to-digital converter circuit | BO_22:Q7
> **{{BO_22:Q7}}**
>
> Draw an ADC circuit which converts an analog signal to a digital signal.

### Answer: a 2-bit flash (parallel) ADC

The fastest and easiest ADC to draw:

1. A **resistor ladder** of equal resistors divides Vref into reference levels: ¼, ½ and ¾ Vref.
2. **Comparators** (2ⁿ − 1 = 3 for n = 2 bits) compare Vin with each level. A comparator outputs 1 if Vin is above its reference.
3. The outputs form a *thermometer code* (000, 001, 011, 111). A **priority encoder** turns that into binary.

```figure
flash-adc
```

| Vin (with Vref = 4 V) | C3 C2 C1 | Output B1 B0 |
|---|---|---|
| 0 – 1 V | 0 0 0 | 00 |
| 1 – 2 V | 0 0 1 | 01 |
| 2 – 3 V | 0 1 1 | 10 |
| 3 – 4 V | 1 1 1 | 11 |

**Trade-off:** flash ADCs are very fast (one comparison step), but an n-bit one needs 2ⁿ − 1 comparators. Successive-approximation ADCs use one comparator over n steps instead.

=== topic serial-parallel-transmission | 4.10 Serial vs parallel transmission | BG_SAE:Q1
> **{{BG_SAE:Q1}}**
>
> ক) Serial ও Parallel Transmission এর মধ্যে পার্থক্য লিখ। খ) 8-bit এর Serial ও Parallel Transmission এর diagram আঁক।
>
> *(a) Differentiate serial and parallel transmission. (b) Draw 8-bit serial and parallel transmission.)*

### (a) Differences

| | Serial | Parallel |
|---|---|---|
| Wires for data | **1** | **n** (8 for a byte) |
| Bits per clock | 1 | n |
| Speed at short range | lower per clock | higher |
| Long distance | reliable | skew and crosstalk between wires |
| Cable cost | cheap | expensive |
| Examples | USB, SATA, RS-232, Ethernet | old printer port (LPT), internal CPU buses |

Modern links are mostly serial: a single fast line avoids the skew problem and can run at much higher clock speeds.

### (b) Sending the byte 10110010

```figure
serial-parallel
```

=== topic microprocessor-8086 | 4.11 8086: interrupts, flags and block diagram | JG_SAE:Q4, BG_AM:Q7
> **{{JG_SAE:Q4}}**
>
> 8086 Microprocessor এর দুটি Hardware Interrupt এবং দুটি Flag Register এর নাম লিখুন।

### Answer A

- **Hardware interrupts:** **NMI** (non-maskable, pin 17, cannot be disabled) and **INTR** (maskable, pin 18, controlled by IF).
- **Flags (any two):** **CF** (carry) and **ZF** (zero).

| Status flags (set by results) | Control flags (set by the programmer) |
|---|---|
| CF carry, PF parity, AF auxiliary carry, ZF zero, SF sign, OF overflow | TF trap (single-step), IF interrupt enable, DF direction |

> **{{BG_AM:Q7}}**
>
> Write the different parts of the 8086 microprocessor *(a block diagram with parts marked A–E)*.

### Answer B

```figure
cpu8086
```

| Mark | Part | Job |
|---|---|---|
| **A** | Bus Interface Unit (BIU) | Talks to memory: computes addresses, fetches instructions, reads and writes data |
| **B** | Execution Unit (EU) | Decodes and executes instructions |
| **C** | ALU | Arithmetic and logic operations; updates the flags |
| **D** | Instruction queue (6 bytes) | Holds pre-fetched instruction bytes |
| **E** | Control unit | Decodes instructions and generates timing and control signals |

Physical address = segment × 16 + offset, worked out by the BIU's adder (for example CS:IP). The BIU fetches while the EU executes, which is a simple **pipeline**.

=== topic cisc-vs-risc | 4.12 CISC vs RISC | TG:Q2b
> **{{TG:Q2b}}**
>
> Write which is related to CISC or RISC from the given descriptions.

The list of descriptions is not available. Use this table to label any statement:

| Feature | CISC | RISC |
|---|---|---|
| Instruction set | large, complex | small, simple |
| Instruction length | variable | fixed |
| Clocks per instruction | many | mostly one |
| Memory access | many instructions use memory operands | only LOAD / STORE touch memory |
| Addressing modes | many | few |
| Registers | few | many |
| Control unit | microprogrammed | hardwired |
| Pipelining | harder | easy, a core design goal |
| Code size | smaller | larger |
| Examples | Intel x86, 8086 | ARM, MIPS, RISC-V |

**Memory hook:** CISC puts the complexity in the hardware; RISC moves it to the compiler.

=== topic gas-leak-sensor-signal | 4.13 Gas-leak sensor signal to a microcontroller | JG_AE:Q12
> **{{JG_AE:Q12}}**
>
> JGTDSL wants you to design a microcontroller system. Which signal could a sensor use to send to the microcontroller if it finds a gas leak?

### Answer

A gas sensor (for example the MQ-series) gives an **analog voltage** that rises with gas concentration. It can reach the microcontroller in two ways:

1. **Analog signal → ADC pin.** The program reads the voltage, converts it to ppm and compares it with a safe limit. This gives the actual concentration level.
2. **Digital signal → interrupt pin.** A comparator (often built into the sensor module) gives a logic **HIGH** the moment the threshold is crossed. That triggers an **interrupt**, so the microcontroller reacts at once instead of waiting for its next poll.

The best design uses both: the interrupt for instant alarm, and the analog reading for logging and severity.

```figure
gas-sensor
```

On a leak, the microcontroller sounds the buzzer, lights the LED, sends an SMS through GSM and can close a solenoid valve.
