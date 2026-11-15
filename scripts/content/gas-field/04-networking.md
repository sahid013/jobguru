=== subject gf-networking | Networking & Security
=== topic firewall-iot-ipv6 | 5.1 Short notes: Firewall, IoT, IPv6 | GT_SAE:Q1
> **{{GT_SAE:Q1}}**
>
> সংক্ষেপে লিখ: (ক) Firewall (খ) IoT (গ) IPv6
>
> *(Short notes on Firewall, IoT and IPv6.)*

**(ক) Firewall.** Hardware or software that sits between a trusted network and an untrusted one (such as the Internet) and **allows or blocks traffic by rules**: IP address, port, protocol or application. Types: packet-filtering, stateful inspection, proxy/application-level, and next-generation (NGFW). Example: allow only port 443 to the billing server and block everything else.

**(খ) IoT (Internet of Things).** Everyday physical devices fitted with **sensors, processors and network connectivity** that collect and exchange data without a person in the loop. In the gas sector: smart prepaid meters, pipeline pressure sensors and leak detectors reporting to a central SCADA or cloud system.

**(গ) IPv6.** The successor to IPv4:

- **128-bit** addresses written in hexadecimal, e.g. `2001:db8::1`, giving about 3.4 × 10³⁸ addresses
- simpler fixed 40-byte header, no checksum, no fragmentation by routers
- built-in IPsec support and stateless auto-configuration (SLAAC)
- no need for NAT, because every device can have a public address

=== topic osi-model | 5.2 The OSI model | JG_SAE:Q3, GT_SAE:Q2
> **{{JG_SAE:Q3}}**
>
> OSI model এর চারটি ধাপ লিখুন। *(Write four layers of the OSI model.)*

> **{{GT_SAE:Q2}}**
>
> OSI Model এর লেয়ারগুলোর নাম লিখ বা লেয়ারগুলো কি। *(Name the OSI layers / what are they?)*

### Answer

The OSI (Open Systems Interconnection) model splits network communication into **seven layers**. Each layer serves the layer above and uses the one below. Any four answer the first question; all seven, with one line each, answer the second.

```figure
osi
```

| # | Layer | Job | Devices / protocols |
|---|---|---|---|
| 7 | Application | services the user's program talks to | HTTP, SMTP, FTP, DNS |
| 6 | Presentation | format, encryption, compression | TLS, JPEG, ASCII |
| 5 | Session | open, manage and close sessions | NetBIOS, RPC |
| 4 | Transport | end-to-end delivery, ports, reliability | TCP, UDP |
| 3 | Network | logical addressing and routing | IP, ICMP, routers |
| 2 | Data link | framing, MAC addresses, error detection | Ethernet, switches |
| 1 | Physical | raw bits on the medium | cables, hubs, signals |

=== topic full-forms | 5.3 Full forms | GT_SAE:Q5
> **{{GT_SAE:Q5}}**
>
> পূর্ণরূপ লিখুন: ADSL, DML, CASE, RAID, SCSI, DNS, GIGO, DHCP, MICR, ODMS, SMTP, CISC.

| Short | Full form |
|---|---|
| ADSL | Asymmetric Digital Subscriber Line |
| DML | Data Manipulation Language |
| CASE | Computer-Aided Software Engineering |
| RAID | Redundant Array of Independent (originally *Inexpensive*) Disks |
| SCSI | Small Computer System Interface |
| DNS | Domain Name System |
| GIGO | Garbage In, Garbage Out |
| DHCP | Dynamic Host Configuration Protocol |
| MICR | Magnetic Ink Character Recognition |
| ODMS | most likely *Object Database Management System* (usually written ODBMS) |
| SMTP | Simple Mail Transfer Protocol |
| CISC | Complex Instruction Set Computer |

*ODMS is not a standard acronym; the paper most likely meant ODBMS.*

=== topic network-commands | 5.4 Network administrator commands | BG_SAE:Q3
> **{{BG_SAE:Q3}}**
>
> নিচের Network Administrator কমান্ডগুলোর কাজ লিখ: i. ipconfig ii. arp -a iii. nslookup iv. netstat v. traceroute

| Command | What it does | Example use |
|---|---|---|
| `ipconfig` (Windows) / `ifconfig`, `ip a` (Linux) | Shows each interface's IP address, subnet mask, default gateway and DNS; `ipconfig /release`, `/renew` redo DHCP | "Did this PC get an IP from DHCP?" |
| `arp -a` | Lists the ARP cache: IP → MAC mappings on the local network | Spotting a duplicate IP or ARP spoofing |
| `nslookup` | Queries DNS: name → IP and back | "Does titasgas.org.bd resolve correctly?" |
| `netstat` | Shows active connections, listening ports and the routing table (`-an`, `-r`) | "Which program is listening on port 3306?" |
| `traceroute` (Linux) / `tracert` (Windows) | Lists every router hop to a destination with the delay at each | Finding where a connection slows down or breaks |

=== topic website-requirements | 5.5 What a customer-information website needs | BG_SAE:Q5
> **{{BG_SAE:Q5}}**
>
> বাখরাবাদের যেকোনো গ্রাহকের সকল তথ্য পেতে একটি ওয়েবসাইট বানাতে কি কি Software ও Service এর প্রয়োজন হবে?
>
> *(Which software and services are needed to build a website showing all information of any Bakhrabad customer?)*

```figure
web-stack
```

**Software**

- **Operating system** for the server, e.g. Linux (Ubuntu or RHEL).
- **Web server**: Nginx or Apache.
- **Application / back-end**: PHP (Laravel), Java (Spring) or Python (Django), holding the business logic, search and authentication.
- **Database (DBMS)**: MySQL, PostgreSQL or Oracle for customer, meter and billing records.
- **Front-end**: HTML, CSS and JavaScript (optionally React or Vue).

**Services**

- **Domain name + DNS**, e.g. `bgdcl.gov.bd`.
- **Hosting**: own data centre, cloud or a VPS.
- **SSL/TLS certificate** for HTTPS.
- **Firewall / WAF** and **user authentication** (login, roles, OTP), since this is personal data.
- **SMS and email gateway** for bill and OTP notices, and a **payment gateway** for online bill pay.
- **Backup, monitoring and logging**.

=== topic email-to-cc-bcc | 5.6 TO, CC, BCC and the mail server | BG_SAE:Q7
> **{{BG_SAE:Q7}}**
>
> Mail এ TO, CC, BCC এর কাজ কি? Mail server এর মধ্যে কি থাকে?

| Field | Meaning | Who sees the address |
|---|---|---|
| **TO** | main recipients, expected to act or reply | everyone |
| **CC** (carbon copy) | kept informed, no action expected | everyone |
| **BCC** (blind carbon copy) | hidden recipients | only the sender (and that BCC person) |

Use BCC when mailing many people who should not see each other's addresses.

**Inside a mail server**

- **MTA** using **SMTP** (port 25/587) to send and relay mail between servers
- **Mailbox storage**: each user's inbox and folders
- **MDA / retrieval** through **POP3** (110/995) or **IMAP** (143/993)
- user accounts and authentication
- spam and virus filters, mail queue and logs
- DNS **MX record** pointing other servers to it

=== topic tcp-three-way-handshake | 5.7 TCP three-way handshake | BG_AE:Q4
> **{{BG_AE:Q4}}**
>
> What is a 3-way handshake? Why does TCP use it?

### Answer

Before any data, TCP opens a **connection** in three messages:

```figure
tcp-handshake
```

1. **SYN**: the client says "let's talk; my starting sequence number is *x*."
2. **SYN-ACK**: the server agrees, acknowledges *x + 1* and sends its own number *y*.
3. **ACK**: the client acknowledges *y + 1*. The connection is **ESTABLISHED**.

**Why TCP uses it**

- Both sides prove they can **send and receive**.
- They **agree on initial sequence numbers**, which TCP needs for ordering, loss detection and retransmission.
- It allocates buffers only for real peers and rejects stale or duplicate connection requests.

(Closing uses FIN / ACK from each side, a four-way exchange.)

=== topic class-c-subnets | 5.8 Class C range and four equal subnets | BG_AE:Q5
> **{{BG_AE:Q5}}**
>
> Write the Class C IPv4 range. If a Class C network is divided into 4 equal subnets, how many PCs can each subnet have?

### Answer

- **Class C range:** 192.0.0.0 – 223.255.255.255 (first octet 192–223, leading bits 110). Default mask 255.255.255.0 (/24): 2⁸ − 2 = **254 hosts**.
- **4 equal subnets** need 2 extra network bits, since 2² = 4: /24 becomes **/26**, mask **255.255.255.192**.
- Host bits left: 32 − 26 = 6, giving 2⁶ = 64 addresses per subnet and **64 − 2 = 62 usable PCs** (network and broadcast addresses are reserved).

| Subnet | Network | Usable | Broadcast |
|---|---|---|---|
| 1 | x.x.x.0 | .1 – .62 | .63 |
| 2 | x.x.x.64 | .65 – .126 | .127 |
| 3 | x.x.x.128 | .129 – .190 | .191 |
| 4 | x.x.x.192 | .193 – .254 | .255 |

=== topic network-broadcast-hosts | 5.9 Network, broadcast and host count | BO_22:Q2
> **{{BO_22:Q2}}**
>
> IP: 168.20.96.63, Subnet mask: 255.255.192.0. Find the broadcast address, the network address and the number of hosts.

### Solution

The mask 255.255.192.0 has 8 + 8 + 2 = 18 one-bits, so it is **/18**. Only the **3rd octet** is interesting (the 4th octet of the mask is 0):

- 96 = 0110 0000, mask 192 = 1100 0000
- AND → 0100 0000 = **64**
- Block size in the 3rd octet = 256 − 192 = 64, so the networks are .0, .64, .128, .192 and 96 falls in the **64** block.

| Item | Value |
|---|---|
| Network address | **168.20.64.0** |
| Broadcast address | **168.20.127.255** (next block 128 − 1) |
| Usable range | 168.20.64.1 – 168.20.127.254 |
| Hosts | 2¹⁴ − 2 = **16,382** |

=== topic routing-table-lookup | 5.10 Routing table lookup | BP:Q1
> **{{BP:Q1}}**
>
> Using the routing table, find the outgoing interface for each destination: 172.168.165.121, 172.168.167.151, 172.168.163.151, 172.168.171.92, 0.0.0.0.

| Network | Mask | Interface |
|---|---|---|
| 172.168.164.0 | 255.255.254.0 | 0 |
| 172.168.166.0 | 255.255.254.0 | 1 |
| 172.168.168.0 | 255.255.254.0 | 2 |
| 172.168.170.0 | 255.255.254.0 | 3 |
| 0.0.0.0 | default | 4 |

### Method

255.255.254.0 is **/23**: in the 3rd octet the mask is 254 = 1111 1110, so it drops the last bit. **AND the 3rd octet with 254**, which turns any odd number into the even number below it, then look up the row.

| Destination | 3rd octet & 254 | Matches | Interface |
|---|---|---|---|
| 172.168.165.121 | 165 → 164 | 164.0/23 | **0** |
| 172.168.167.151 | 167 → 166 | 166.0/23 | **1** |
| 172.168.163.151 | 163 → 162 | none | **4** (default) |
| 172.168.171.92 | 171 → 170 | 170.0/23 | **3** |
| 0.0.0.0 | — | default route | **4** |

=== topic ip-address-types | 5.11 Loopback, host and broadcast addresses | BG_AM:Q8
> **{{BG_AM:Q8}}**
>
> Match each address with its category: A. 127.0.0.1, B. 192.168.1.10, C. 192.168.1.255, D. 255.255.255.255 with 1. Loopback, 2. Host, 3. Network broadcast, 4. Limited broadcast.

### Answer: A–1, B–2, C–3, D–4

| Address | Type | Why |
|---|---|---|
| 127.0.0.1 | **Loopback** | the 127.0.0.0/8 block always means "this machine"; packets never leave it |
| 192.168.1.10 | **Host** | an ordinary device address in 192.168.1.0/24 |
| 192.168.1.255 | **Network (directed) broadcast** | all host bits 1, so it reaches every host *of that network* and can be routed to it |
| 255.255.255.255 | **Limited broadcast** | all hosts on the *local* segment only; routers never forward it |

=== topic ipv4-ipv6-nat | 5.12 IPv4 vs IPv6 bits, and why IPv6 needs no NAT | RP:Q5, RP:Q6
> **{{RP:Q5}}**
>
> How many bits are in IPv4 and IPv6 addresses, and why is NAT not needed in IPv6?

**IPv4 = 32 bits** (≈ 4.3 billion addresses). **IPv6 = 128 bits** (≈ 3.4 × 10³⁸ addresses).

**Why NAT exists, and why IPv6 drops it:** IPv4 ran out of addresses, so whole offices hide behind **one public IP**. NAT on the router rewrites private addresses (10.x, 172.16–31.x, 192.168.x) to that public one. IPv6 has so many addresses that **every device gets its own globally unique address**, so no translation is needed. Dropping NAT also restores true end-to-end connectivity (simpler VoIP and peer-to-peer). Security comes from firewalls, not from NAT.

> **{{RP:Q6}}**
>
> IP address related problem.

The paper gives no details here. Practise with the three IP problems above: **5.8** (subnetting a Class C), **5.9** (network and broadcast from a mask) and **5.10** (routing table lookup).

=== topic traceroute-hops | 5.13 Counting traceroute hops | TG:Q4b
> **{{TG:Q4b}}**
>
> A traceroute to marketplace.com shows: 1. gateway.titasgas.gov.bd, 2. backup.titasgas.gov.bd, … 8. global.com, 9. \* \* \*, 10. \* \* \*, 11. \* \* \*, 12. marketplace.com. How many hops are needed to reach it? What do lines 9–11 mean?

### Answer

- **12 hops.** Each numbered line is one router (hop) on the path, and line 12 is the destination itself.
- **Lines 9–11 (`* * *`)** mean those three routers **did not answer within the timeout**. Each `*` is one of the three probes timing out.
- This **does not mean the path is broken**. Line 12 replied, so those routers did forward the packets. They are simply set to **drop or rate-limit ICMP "time exceeded" replies** (often for security, or behind a firewall).

How traceroute works: it sends packets with TTL = 1, 2, 3, …. Each router that drops a packet whose TTL reached 0 sends back an ICMP *time exceeded* message, and that reveals its name and delay.

=== topic distance-vector-routing | 5.14 Distance vector routing tables | JG_AE:Q9
> **{{JG_AE:Q9}}**
>
> Given a distance-vector routing topology, find the table of each node after the first round.

The topology picture is not available, so here is the method on a small example. Apply it the same way to any figure.

### Rule (Bellman–Ford)

Each router knows only its neighbours' costs. Every round it **sends its distance vector to its neighbours** and updates:

**D(x → y) = min over neighbours v of { cost(x, v) + D(v → y) }**

### Example: A–B = 2, B–C = 3, A–C = 7

| Node | Initial table (direct links) | After the first exchange |
|---|---|---|
| A | B: 2, C: 7 | B: 2, C: min(7, 2 + 3) = **5 via B** |
| B | A: 2, C: 3 | A: 2, C: 3 (no change) |
| C | A: 7, B: 3 | A: min(7, 3 + 2) = **5 via B**, B: 3 |

Repeat until no table changes (convergence). A known weakness is **count-to-infinity** after a link failure, eased by split horizon and poison reverse. RIP is the classic distance-vector protocol.

=== topic shannon-capacity | 5.15 Channel capacity (Shannon) | RP:Q8
> **{{RP:Q8}}**
>
> A telephone line has a bandwidth of 3000 Hz (300 – 3300 Hz) for data. The signal-to-noise ratio is 3162. Calculate the channel capacity.

### Solution

Shannon capacity: **C = B · log₂(1 + SNR)**, with SNR as a plain ratio (not dB).

- C = 3000 × log₂(1 + 3162)
- C = 3000 × log₂(3163)
- log₂ 3163 = ln 3163 / ln 2 ≈ 8.059 / 0.693 ≈ **11.63**
- **C ≈ 3000 × 11.63 ≈ 34,880 bps ≈ 34.9 kbps**

(Forouzan's textbook rounds log₂ 3163 to 11.62 and prints 34,860 bps. Either is accepted.) In dB this SNR is 10·log₁₀ 3162 ≈ **35 dB**. This is the theoretical upper limit for that line; real modems reach less.

=== topic sha-avalanche-scaling | 5.16 SHA-256/512, avalanche effect, scaling | RP:Q7
> **{{RP:Q7}}**
>
> What are SHA-256 and SHA-512 in network security? What is the avalanche effect, and is it desirable or undesirable? Draw a server-rack diagram of horizontal and vertical scaling.

**SHA-256 / SHA-512** are cryptographic **hash functions** of the SHA-2 family. They turn any input into a fixed **256-bit / 512-bit** digest. They are one-way (you cannot recover the input) and collision-resistant. Used for file and message integrity, digital signatures, TLS certificates, password hashing (with salt) and blockchain.

**Avalanche effect:** changing **one bit** of the input changes about **half of the output bits** unpredictably. It is **desirable**: similar inputs give unrelated hashes or ciphertexts, so an attacker learns nothing from small changes.

**Scaling**

```figure
scaling
```

| | Vertical (scale up) | Horizontal (scale out) |
|---|---|---|
| How | bigger machine: more CPU, RAM, disk | more machines behind a load balancer |
| Limit | the largest server you can buy | almost unlimited |
| Downtime | often needs a restart | add or remove servers live |
| Failure | single point of failure | survives one server dying |

=== topic cryptography-types | 5.17 Types of cryptographic algorithms | BP:Q4, JG_AE:Q10
> **{{BP:Q4}}**
>
> Identify the type of each algorithm: (i) MD5 (ii) AES (iii) RSA (iv) Diffie–Hellman.

| Algorithm | Type | Used for |
|---|---|---|
| MD5 | **Hash function** (no key, 128-bit digest), now broken for security | checksums |
| AES | **Symmetric-key block cipher** (128-bit blocks; 128/192/256-bit keys) | bulk encryption |
| RSA | **Asymmetric (public-key)** cipher | key exchange, digital signatures |
| Diffie–Hellman | **Key-exchange** protocol (asymmetric technique) | agreeing on a shared secret over an open channel |

> **{{JG_AE:Q10}}**
>
> Write two symmetric-key cryptographic algorithm names.

**AES** and **DES**. Others: 3DES, Blowfish, Twofish, RC4, ChaCha20. *Symmetric* means the same key encrypts and decrypts.

=== topic xss-csrf-dhcp-mitm | 5.18 XSS, CSRF and MITM on DHCP | TG:Q3c, TG:Q4c
> **{{TG:Q3c}}**
>
> How do you prevent XSS and CSRF attacks?

| Attack | What happens | Prevention |
|---|---|---|
| **XSS** (cross-site scripting) | attacker's JavaScript gets stored or reflected into a page and runs in other users' browsers | escape output by context (HTML, attribute, JS); validate and sanitise input; **Content-Security-Policy** header; **HttpOnly** cookies so scripts cannot read session IDs |
| **CSRF** (cross-site request forgery) | a malicious site makes a logged-in user's browser send an unwanted request (e.g. a transfer) | **anti-CSRF token** in every form; **SameSite** cookies; check Origin/Referer; re-authenticate for sensitive actions; never change state with GET |

> **{{TG:Q4c}}**
>
> How does a man-in-the-middle attack affect a DHCP server?

DHCP has **no authentication**: a client takes the first offer it hears.

- **Rogue DHCP server:** the attacker answers DISCOVER messages faster and hands out its own IP as the **default gateway and DNS**. Now all the victim's traffic flows through the attacker (MITM), who can read it, change it or redirect users to fake sites.
- **DHCP starvation:** the attacker floods requests with fake MAC addresses until the real server's address pool is empty. Genuine clients get no IP (denial of service), which helps the rogue server take over.

**Defence:** **DHCP snooping** on switches (only trusted ports may send offers), **port security** (limit MACs per port), **Dynamic ARP Inspection**, and 802.1X port authentication.

=== topic mmwave-edge-server | 5.19 mmWave in IoT and the need for edge servers | BO_24:Q5c, BO_24:Q5d
> **{{BO_24:Q5c}}**
>
> What is the use of mm-waves in IoT?

**mmWave** = radio at **30–300 GHz** (5G bands such as 24–40 GHz). Its very wide bandwidth gives:

- multi-gigabit speeds and **very low latency**, good for HD video surveillance and AR maintenance
- support for a **dense mass of IoT devices** in a small area (smart plants, factories)
- precise **radar-style sensing** (motion, presence, vibration)

Limits: **short range**, blocked by walls and rain. It needs many small cells and line-of-sight.

> **{{BO_24:Q5d}}**
>
> What is the need of an edge server?

An **edge server** processes data **close to where it is produced** instead of in a distant cloud:

- **Low latency.** A gas-leak or pressure alarm triggers a valve within milliseconds.
- **Less bandwidth.** Only summaries go to the cloud, not raw sensor streams.
- **Works offline.** The site keeps running if the WAN link fails.
- **Privacy and compliance.** Sensitive data stays on-site.
